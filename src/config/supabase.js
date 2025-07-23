import env from "dotenv";
import { createClient } from "@supabase/supabase-js";

env.config();

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_KEY;

if (!supabaseUrl || !supabaseKey) {
    console.error("Error: SUPABASE_URL or SUPABASE_KEY is not defined in the environment variables.");
    process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

export default supabase;