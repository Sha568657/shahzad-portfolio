// Supabase public project configuration. Publishable key is intended for browser use;
// database security must be enforced by Row Level Security (RLS).
(function(){
  const SUPABASE_URL = 'https://svmsdqgvfwtwhajjvcas.supabase.co';
  const SUPABASE_PUBLISHABLE_KEY = 'sb_publishable_SYVTCvyN598zPIFpG5gzDA_I81TF5Se';
  if (!window.supabase || !window.supabase.createClient) {
    console.error('Supabase client library did not load. Check your internet connection.'); return;
  }
  window.portfolioSupabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });
})();
