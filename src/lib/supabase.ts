import { createClient } from "@supabase/supabase-js";

const supabaseUrl = "https://gpcncqedofjztgtxitxf.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdwY25jcWVkb2ZqenRndHhpdHhmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyNDY0NzIsImV4cCI6MjA4NjgyMjQ3Mn0.W7PARxQPdGP1RRa4p0uWNSz7V-PcL1lv-UWIkL34SkI";

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
