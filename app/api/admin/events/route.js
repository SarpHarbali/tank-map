import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const { data, error } = await supabase
    .from("tank_events")
    .select("*")
    .order("event_time", { ascending: false });
  
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(req) {
  const body = await req.json();
  
  const { data, error } = await supabase
    .from("tank_events")
    .insert([body])
    .select();
  
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data[0]);
}

export async function PUT(req) {
  const body = await req.json();
  const { id, ...updates } = body;
  
  const { data, error } = await supabase
    .from("tank_events")
    .update(updates)
    .eq("event_id", id)
    .select();
  
  if (error) return Response.json({ error: error.message }, { status: 500 });
  
  // Guard against empty data (record not found)
  if (!data || data.length === 0) {
    return Response.json({ error: "Event not found" }, { status: 404 });
  }

  return Response.json(data[0]);
}
