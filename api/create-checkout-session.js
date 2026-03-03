const Stripe = require("stripe");

module.exports = async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") return res.status(200).end();

  try {
    if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

    if (!process.env.STRIPE_SECRET_KEY) return res.status(500).json({ error: "STRIPE_SECRET_KEY manquante" });
    if (!process.env.PRICE_MEMBER || !process.env.PRICE_VIP) return res.status(500).json({ error: "PRICE_MEMBER ou PRICE_VIP manquant" });

    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const auth = req.headers.authorization || "";
    const token = auth.replace("Bearer ", "").trim();
    if (!token) return res.status(401).json({ error: "Non authentifiee - connecte-toi d abord" });

    const supaRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      },
    });

    if (!supaRes.ok) return res.status(401).json({ error: "Session invalide" });
    const user = await supaRes.json();

    const { plan } = req.body || {};
    const price = plan === "vip" ? process.env.PRICE_VIP : plan === "member" ? process.env.PRICE_MEMBER : null;
    if (!price) return res.status(400).json({ error: "Plan invalide" });

    const origin = req.headers.origin || process.env.PUBLIC_ORIGIN || "https://muslimah-society-3.vercel.app";

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      customer_email: user.email,
      success_url: `${origin}/dashboard.html?success=1`,
      cancel_url: `${origin}/pricing.html?cancelled=1`,
      metadata: { supabase_user_id: user.id, plan },
    });

    return res.json({ url: session.url });

  } catch (e) {
    console.error("Checkout error:", e.message);
    return res.status(500).json({ error: e.message });
  }
};
