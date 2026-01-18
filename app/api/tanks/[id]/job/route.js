import { createClient } from "@supabase/supabase-js";

export async function GET(req, context) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { id } = await context.params;

  // Get the current/active job for this tank
  const { data, error } = await supabase
    .from("tank_jobs")
    .select("*")
    .eq("tank_id", id)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  if (error && error.code !== 'PGRST116') {
    return Response.json({ error: error.message }, { status: 500 });
  }

  return Response.json(data || {});
}
