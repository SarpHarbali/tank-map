import { createClient } from "@supabase/supabase-js";

export async function GET(req) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { data, error } = await supabase.from("v_map_tanks").select("*");
  if (error) return Response.json({ error: error.message }, { status: 500 });

  return Response.json(data);
}
