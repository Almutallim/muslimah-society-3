// js/supabaseClient.js
// Remplace par tes clés Supabase (Project Settings > API)

const SUPABASE_URL = "https://lgxnejnihodyfgxlyycd.supabase.co";
const SUPABASE_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxneG5lam5paG9keWZneGx5eWNkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0NDg2NTcsImV4cCI6MjA4NzAyNDY1N30.3l1LlRMJRFsjDUIOXjkGqy01y4y_SZw6A4KFyVTJAFo";

// Client Supabase (supabase-js v2)
window.supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
