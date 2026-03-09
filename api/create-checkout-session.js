import Stripe from "stripe";

export default async function handler(req, res){
  try{
    if(req.method !== "POST") return res.status(405).json({error:"Method not allowed"});
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

    const auth = req.headers.authorization || "";
    const token = auth.replace("Bearer ","").trim();
    if(!token) return res.status(401).json({error:"No auth token"});

    const supaRes = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      headers: {
        "Authorization": `Bearer ${token}`,
        "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY
      }
    });

    if(!supaRes.ok) return res.status(401).json({error:"Invalid session"});
    const user = await supaRes.json();

    const { plan } = req.body || {};
    const price =
      plan === "vip" ? process.env.PRICE_VIP :
      plan === "member" ? process.env.PRICE_MEMBER : null;

    if(!price) return res.status(400).json({error:"Invalid plan"});

    const origin = req.headers.origin || process.env.PUBLIC_ORIGIN || "";
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [{ price, quantity: 1 }],
      customer_email: user.email,
      success_url: `${origin}/dashboard.html`,
      cancel_url: `${origin}/pricing.html`,
      metadata: { supabase_user_id: user.id, plan }
    });

    res.json({ url: session.url });
  }catch(e){
    res.status(500).json({error: e.message});
  }
}
