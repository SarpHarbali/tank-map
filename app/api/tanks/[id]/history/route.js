import { createClient } from "@supabase/supabase-js";

export async function GET(req, context) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { id } = await context.params;

  // Get all events for this tank, ordered by most recent first
  const { data, error } = await supabase
    .from("tank_events")
    .select("*")
    .eq("tank_id", id)
    .order("event_time", { ascending: false })
    .limit(50);

  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(data || []);
}
