const express = require('express');
const router = express.Router();

const transactions = [];

router.get('/ping', (req, res) => {
  res.send('pong');
});

router.get('/transactions', (req, res) => {
  res.status(200).end(JSON.stringify(transactions));
});

router.post('/transactions', (req, res) => {
  const { account_id, amount } = req.body;

  if (!account_id) {
    res.status(400).end(JSON.stringify({ error: 'Missing account_id in body' }));
    return;
  }

  if (!Number.isInteger(amount) || amount === 0) {
    res.status(400).end(JSON.stringify({ error: 'Amount MUST be a valid integer that is not 0' }));
    return;
  }

  const transaction = {
    transaction_id: Math.random().toString(36).substring(2),
    account_id,
    amount,
    created_at: new Date().toISOString(),
  };

  transactions.unshift(transaction);

  res.status(200).end(JSON.stringify(transaction));
});

router.get('/transactions/:transactionId', (req, res) => {
  const transaction = transactions.find(
    (transaction) => transaction.transaction_id === req.params.transactionId
  );
  if (transaction) {
    res.status(200).end(JSON.stringify(transaction));
  } else {
    res.status(404).end();
  }
});

router.get('/accounts/:accountId', (req, res) => {
  const balance = transactions
    .filter((transaction) => transaction.account_id === req.params.accountId)
    .reduce((result, transaction) => result + transaction.amount, 0);

  res.status(200).end(JSON.stringify({ account_id: req.params.accountId, balance }));
});

module.exports = router;
