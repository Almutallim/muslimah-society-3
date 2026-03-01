// js/gate.js

async function requireAuth(){
  const { data, error } = await supabaseClient.auth.getUser();

  if (error) {
    console.warn("Auth error:", error.message);
    window.location.href = "login.html";
    return null;
  }

  const user = data?.user || null;
  if(!user){
    window.location.href = "login.html";
    return null;
  }
  return user;
}

// Petit helper: récupère le profil sans casser si absent
async function getProfileSafe(userId){
  const { data, error } = await supabaseClient
    .from("profiles")
    .select("subscription_status, subscription_tier")
    .eq("id", userId)
    .maybeSingle();

  if (error) throw error;

  // Fallback si profil absent
  if (!data) {
    return { subscription_status: "inactive", subscription_tier: "none" };
  }

  return data;
}

async function requireMember(){
  const user = await requireAuth();
  if(!user) return;

  let profile;
  try {
    profile = await getProfileSafe(user.id);
  } catch (e) {
    console.warn("Profile fetch error:", e?.message || e);
    window.location.href = "upgrade.html";
    return;
  }

  if(profile.subscription_status !== "active"){
    window.location.href = "upgrade.html";
    return;
  }

  if(profile.subscription_tier !== "member" && profile.subscription_tier !== "vip"){
    window.location.href = "upgrade.html";
    return;
  }
}

async function requireVIP(){
  const user = await requireAuth();
  if(!user) return;

  let profile;
  try {
    profile = await getProfileSafe(user.id);
  } catch (e) {
    console.warn("Profile fetch error:", e?.message || e);
    window.location.href = "upgrade.html";
    return;
  }

  if(profile.subscription_status !== "active" || profile.subscription_tier !== "vip"){
    window.location.href = "upgrade.html";
    return;
  }
}

async function signedUrl(bucket, path, seconds=60){
  const { data, error } = await supabaseClient
    .storage
    .from(bucket)
    .createSignedUrl(path, seconds);

  if(error) throw error;
  return data.signedUrl;
}
