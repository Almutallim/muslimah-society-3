// js/billing.js

window.checkout = async function (plan) {
  // plan: "member" | "vip"
  const { data, error } = await supabaseClient.auth.getSession();
  if (error) {
    alert(error.message);
    return;
  }

  const access_token = data.session?.access_token;

  if (!access_token) {
    window.location.href = "login.html";
    return;
  }

  const res = await fetch("/api/create-checkout-session", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${access_token}`
    },
    body: JSON.stringify({ plan })
  });

  const out = await res.json();

  if (!res.ok) {
    alert(out?.error || "Erreur paiement");
    return;
  }

  if (!out?.url) {
    alert("URL Stripe manquante (API).");
    return;
  }

  window.location.href = out.url;
};
