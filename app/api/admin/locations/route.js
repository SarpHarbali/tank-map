import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export async function GET() {
  const { data, error } = await supabase
    .from("locations")
    .select("*")
    .order("canonical_name", { ascending: true });
  
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data);
}

export async function POST(req) {
  const body = await req.json();
  
  const { data, error } = await supabase
    .from("locations")
    .insert([body])
    .select();
  
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data[0]);
}

export async function PUT(req) {
  const body = await req.json();
  const { id, ...updates } = body;
  
  const { data, error } = await supabase
    .from("locations")
    .update(updates)
    .eq("location_id", id)
    .select();
  
  if (error) return Response.json({ error: error.message }, { status: 500 });
  return Response.json(data[0]);
}
