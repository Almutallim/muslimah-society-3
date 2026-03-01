// js/auth.js

async function register(email, password){
  const { data, error } = await supabaseClient.auth.signUp({ email, password });
  if (error) throw error;
  return data;
}

async function login(email, password){
  const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data;
}

async function logout(){
  const { error } = await supabaseClient.auth.signOut();
  if (error) console.warn("Logout error:", error.message);
  window.location.href = "index.html";
}

async function getUser(){
  const { data, error } = await supabaseClient.auth.getUser();
  if (error) return null;
  return data.user || null;
}

async function getProfile(){
  const user = await getUser();
  if(!user) return null;

  // ✅ maybeSingle évite le crash si le profil n’existe pas encore
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("subscription_status, subscription_tier, email, stripe_customer_id")
    .eq("id", user.id)
    .maybeSingle();

  if (error) throw error;

  // ✅ Si pas de profil, on renvoie un fallback propre
  if (!data) {
    return {
      email: user.email,
      subscription_status: "inactive",
      subscription_tier: "none",
      stripe_customer_id: null
    };
  }

  return data;
}
async function getProfile(){
  const user = await getUser();
  if(!user) return null;

  const { data, error } = await supabaseClient
    .from("profiles")
    .select("subscription_status, subscription_tier, email")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}
