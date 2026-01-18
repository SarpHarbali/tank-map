import { createClient } from "@supabase/supabase-js";

export async function GET(req, context) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { id } = await context.params;

  const { data, error } = await supabase
    .from("v_map_tanks")
    .select("*")
    .eq("tank_id", id)
    .single();

  if (error) return Response.json({ error: error.message }, { status: 500 });
  if (!data) return Response.json({ error: "Tank not found" }, { status: 404 });

  return Response.json(data);
}
