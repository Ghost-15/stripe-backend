const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { sequelize, Transaction, Operation, User } = require('../models');

function generateTransactionCode(length = 10) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < length; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}


exports.webhook = async (req, res) => {
  const sig = req.headers['stripe-signature'];
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
  } catch (err) {
    console.error('Webhook signature error:', err.message);
    return res.status(400).send(`Webhook Error: ${err.message}`);
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object;

    try {
      const amount = session.amount_total / 100;
      const currency = session.currency;
      const stripeSessionId = session.id;
      const stripePaymentIntentId = session.payment_intent;
      const email = session.customer_details?.email;

      const randomUser = await User.findOne({ order: [sequelize.fn('RANDOM')] });

      if (!randomUser) {
        console.error("Aucun utilisateur trouvé pour associer la transaction.");
        return res.status(500).send("Aucun utilisateur disponible.");
      }

      const transaction = await Transaction.create({
        userId: randomUser.id,
        email,
        description: `Paiement Stripe #${stripePaymentIntentId}`,
        amount,
        currency,
        code: generateTransactionCode(),
        status: 'captured',
        stripeSessionId,
        stripePaymentIntentId,
      });

      await Operation.create({
        transactionId: transaction.id,
        type: 'capture',
        amount,
        status: 'success',
      });

      console.log("✅ Transaction et opération créées avec succès.");
    } catch (err) {
      console.error("❌ Erreur lors de la création de la transaction ou de l’opération :", err);
      return res.status(500).send("Erreur interne.");
    }
  }

  res.status(200).json({ received: true });
};
