# Muslimah Society — by Institut Al Muta'allim

Site officiel de Muslimah Society, cercle féminin islamique premium.

## Structure du projet

```
muslimah-society/
│
├── index.html                  ← Site principal
├── charte.html                 ← Charte officielle (FR / EN / AR)
├── login.html                  ← Connexion membre
├── register.html               ← Inscription + acceptation charte
├── dashboard.html              ← Espace personnel membre
├── pricing.html                ← Page abonnements Member / VIP
├── manage-subscription.html    ← Gérer son abonnement
├── upgrade.html                ← Page upgrade (redirection paywall)
├── audio.html                  ← Audios exclusifs membres
├── vip-events.html             ← Soirées & replays VIP
│
├── la-plume/
│   ├── index.html              ← Bibliothèque 30 chroniques
│   ├── read_01.html → read_30.html  ← Pages lecture abonnées
│
├── production/                 ← Usage interne uniquement
│   ├── episode_01.html → episode_30.html  ← Fiches éditoriales
│
├── js/
│   ├── supabaseClient.js       ← Connexion Supabase
│   ├── auth.js                 ← login / register / logout / getProfile
│   ├── gate.js                 ← requireAuth / requireMember / requireVIP
│   └── billing.js              ← checkout() Stripe
│
├── api/
│   ├── create-checkout-session.js  ← Serverless : création session Stripe
│   └── stripe-webhook.js           ← Webhook : activation abonnement Supabase
│
└── images/
    └── logo.png                ← À ajouter
```

## Variables d'environnement (Vercel)

| Variable | Description |
|----------|-------------|
| `STRIPE_SECRET_KEY` | Clé secrète Stripe |
| `STRIPE_WEBHOOK_SECRET` | Secret webhook Stripe |
| `PRICE_MEMBER` | Price ID Stripe formule Member |
| `PRICE_VIP` | Price ID Stripe formule VIP |
| `SUPABASE_URL` | URL du projet Supabase |
| `SUPABASE_SERVICE_ROLE_KEY` | Clé service role Supabase |
| `PUBLIC_ORIGIN` | URL publique du site (ex: https://muslimah-society.vercel.app) |

## Abonnements

| Formule | DZD | EUR | SAR |
|---------|-----|-----|-----|
| Member mensuel | 2 500 DZD | 17 € | 65 ر.س |
| VIP mensuel | 9 000 DZD | 60 € | 225 ر.س |
| Annuel | 90 000 DZD | 600 € | 2 250 ر.س |

## Stack technique

- **Frontend** : HTML / CSS / JS vanilla
- **Hébergement** : Vercel
- **Auth & BDD** : Supabase
- **Paiement** : Stripe

## Déploiement

1. Push sur `main` → déploiement automatique Vercel
2. Configurer les variables d'environnement dans Vercel Dashboard
3. Configurer le webhook Stripe → `https://[votre-domaine]/api/stripe-webhook`

---
© 2026 Institut Al Muta'allim — Tous droits réservés.
