import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  // Fetch shipments and include the list of tank IDs
  const { data, error } = await supabase
    .from("shipments")
    .select(`
      *,
      shipment_tanks ( tank_id )
    `)
    .order("created_at", { ascending: false });
  
  if (error) return Response.json({ error: error.message }, { status: 500 });
  
  // Transform data to make frontend easier (flatten the tank array)
  const formatted = data.map(item => ({
    ...item,
    tank_ids: item.shipment_tanks.map(st => st.tank_id)
  }));

  return Response.json(formatted);
}

export async function POST(req) {
  const body = await req.json();
  const { tank_ids, ...shipmentData } = body; // Separate tank IDs from shipment data
  
  // 1. Create Shipment
  const { data: shipment, error: shipError } = await supabase
    .from("shipments")
    .insert([shipmentData])
    .select()
    .single();
  
  if (shipError) return Response.json({ error: shipError.message }, { status: 500 });

  // 2. Link Tanks (if any selected)
  if (tank_ids && tank_ids.length > 0) {
    const links = tank_ids.map(tId => ({
      shipment_id: shipment.shipment_id,
      tank_id: tId
    }));
    
    const { error: linkError } = await supabase
      .from("shipment_tanks")
      .insert(links);

    if (linkError) console.error("Error linking tanks:", linkError);
  }

  return Response.json(shipment);
}

export async function PUT(req) {
  const body = await req.json();
  const { id, tank_ids, ...updates } = body;
  
  // 1. Update Shipment Details
  const { data, error } = await supabase
    .from("shipments")
    .update(updates)
    .eq("shipment_id", id)
    .select();
  
  if (error) return Response.json({ error: error.message }, { status: 500 });

  // 2. Update Tank Links (Delete old, Insert new - easiest method)
  if (tank_ids) {
    // Remove existing links
    await supabase.from("shipment_tanks").delete().eq("shipment_id", id);
    
    // Add new links
    if (tank_ids.length > 0) {
      const links = tank_ids.map(tId => ({
        shipment_id: id,
        tank_id: tId
      }));
      await supabase.from("shipment_tanks").insert(links);
    }
  }

  return Response.json(data[0]);
}