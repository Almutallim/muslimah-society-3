import Stripe from "stripe";

export const config = { api: { bodyParser: false } };

async function buffer(readable) {
  const chunks = [];
  for await (const chunk of readable) {
    chunks.push(typeof chunk === "string" ? Buffer.from(chunk) : chunk);
  }
  return Buffer.concat(chunks);
}

export default async function handler(req, res){
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = req.headers["stripe-signature"];
  const buf = await buffer(req);

  let event;
  try{
    event = stripe.webhooks.constructEvent(buf, sig, process.env.STRIPE_WEBHOOK_SECRET);
  }catch(err){
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if(event.type === "checkout.session.completed"){
    const session = event.data.object;
    const userId = session.metadata?.supabase_user_id;
    const plan = session.metadata?.plan; // member | vip
    const customerId = session.customer;

    if(userId){
      await fetch(`${process.env.SUPABASE_URL}/rest/v1/profiles?id=eq.${userId}`, {
        method:"PATCH",
        headers:{
          "Content-Type":"application/json",
          "apikey": process.env.SUPABASE_SERVICE_ROLE_KEY,
          "Authorization": `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
          "Prefer":"return=minimal"
        },
        body: JSON.stringify({
          subscription_status: "active",
          subscription_tier: plan === "vip" ? "vip" : "member",
          stripe_customer_id: customerId
        })
      });
    }
  }

  res.json({ received: true });
}
