const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { Transaction, Operation, User } = require('../models');
const frontend_url = process.env.FRONTEND_URL;


exports.createCheckoutSession = async (req, res) => {
  const {items} = req.body;
  try {

    const session = await stripe.checkout.sessions.create({
      line_items: items.map((item) => ({
        price_data: {
          currency: item.currency,
          product_data: { name: item.name },
          unit_amount: item.amount * 100,
        },
        quantity: item.quantity,
      })),
      mode: 'payment',
      success_url: `${frontend_url}/stripe/success`,
      cancel_url: `${frontend_url}/stripe/cancel`,
    });

    res.json({ url: session.url });

  } catch (error) {
    console.error('Erreur session Stripe :', error);
    res.status(500).json({ error: 'Erreur de session Stripe' });
  }
};

exports.refundPayment = async (req, res) => {
  try {
    const { transactionId, refundAmount } = req.body;

    const transaction = await Transaction.findByPk(transactionId);
    if (!transaction) return res.status(404).json({ error: 'Transaction introuvable' });

    const refund = await stripe.refunds.create({
      payment_intent: transaction.stripePaymentIntentId,
      amount: refundAmount * 100,
    });

    await Operation.create({
      transactionId,
      type: 'refund',
      amount: refundAmount,
      status: 'success',
    });

    res.json({ message: 'Remboursement effectué', refund });
  } catch (error) {
    console.error('Erreur refund :', error);
    res.status(500).json({ error: 'Erreur de remboursement' });
  }
};
