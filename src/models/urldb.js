import supabase from "../config/supabase.js";

export async function saveUrl(shortCode, originalUrl) {
  const { data, error } = await supabase
    .from("urls")
    .insert([
      {
        short_code: shortCode,
        original_url: originalUrl,
      },
    ])
    .select();

  if (error) {
    throw new Error(`Database error: ${error.message}`);
  }

  return data[0];
}

export async function shortCodeExists(shortCode) {
  const { data, error } = await supabase
    .from("urls")
    .select("id")
    .eq("short_code", shortCode)
    .single();

  if (error && error.code !== "PGRST116") {
    throw new Error(`Database error: ${error.message}`);
  }

  return !!data;
}

export async function getUrlByShortCode(shortCode) {
  const { data, error } = await supabase
    .from("urls")
    .select("original_url")
    .eq("short_code", shortCode)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null;
    }
    throw new Error(`Database error: ${error.message}`);
  }
  return data.original_url;
}

export async function incrementClicks(shortCode) {
  const { data } = await supabase
    .from("urls")
    .select("clicks")
    .eq("short_code", shortCode)
    .single();

  const { error } = await supabase
    .from("urls")
    .update({ clicks: (data.clicks || 0) + 1 })
    .eq("short_code", shortCode);

  if (error) {
    throw new Error(`Failed to increment clicks: ${error.message}`);
  }
}
