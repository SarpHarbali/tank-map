import { createClient } from "@supabase/supabase-js";

export async function GET(req, context) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { id } = await context.params;

  // Find the shipment_id for this tank (most recent one)
  const { data: linkData, error: linkError } = await supabase
    .from("shipment_tanks")
    .select("shipment_id")
    .eq("tank_id", id)
    // We assume the highest ID is the newest, or you could order by a created_at if added to the link table
    .limit(1)
    .single();

  if (linkError) {
    if (linkError.code === 'PGRST116') return Response.json({}); // No job found
    return Response.json({ error: linkError.message }, { status: 500 });
  }

  // Fetch the actual Shipment details
  const { data, error } = await supabase
    .from("shipments")
    .select("*")
    .eq("shipment_id", linkData.shipment_id)
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(data || {});
}