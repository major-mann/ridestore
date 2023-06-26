import { useEffect, Suspense } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { ProgressSpinner } from 'primereact/progressspinner';

import log from '../log.js';
import { transactions as transactionsAtom, balance as balanceAtom } from '../state.js';
import { transactionList } from '../service/transaction-management.js';

export function TransactionHistoryContainer({ className }) {
  return <Suspense fallback={<Loading />}><History /></Suspense>

  function History() {
    const { transactions, balance } = useTransactionHistory();
    return <TransactionHistory
        className={className}
        transactions={transactions}
        balance={balance}
    />;
  }

  function Loading() {
    return <div className='grow'>
      <ProgressSpinner />
    </div>;
  }
}

export function TransactionHistory({ transactions, balance, className }) {
  return <div className={className}>
    <h1>Transaction History</h1>
    {transactions.map(
      (transaction, index, arr) => <Transaction
        key={transaction.transaction_id}
        transactionId={transaction.transaction_id}
        accountId={transaction.account_id}
        amount={transaction.amount}
        balance={index === 0 ? balance : null}
        createdAt={transaction.created_at}
      />
    )}
  </div>;
}

function Transaction({ transactionId, accountId, amount, createdAt, balance }) {
  if (amount > 0) {
    return <Deposit
      transactionId={transactionId}
      accountId={accountId}
      amount={amount}
      createdAt={createdAt}
      balance={balance}
    />;
  } else if (amount < 0) {
    return <Withdrawal
      transactionId={transactionId}
      accountId={accountId}
      amount={Math.abs(amount)}
      createdAt={createdAt}
      balance={balance}
    />;
  } else {
    log.debug(`Transaction "${transactionId}" has a 0 amount`);
    return null;
  }
}

function Deposit({ accountId, amount, balance }) {
  return <div
    data-type="transaction"
    data-account-id={accountId}
    data-amount={amount}
    data-balance={balance}
    className='margined outlined padded'
  >
    <p>
      Transferred {formatCurrency(amount)} to account {accountId}
    </p>
    <p>
      {balance === null ? null : <>The current account balance is {formatCurrency(balance)}</>}
    </p>
  </div>;
}

function Withdrawal({ accountId, amount, balance }) {
  return <div
    data-type="transaction"
    data-account-id={accountId}
    data-amount={amount}
    data-balance={balance}
    className='margined outlined padded'
  >
    <p>
      Transferred {formatCurrency(amount)} from account {accountId}
    </p>
    <p>
      {balance === null ? null : <>The current account balance is {formatCurrency(balance)}</>}
    </p>
  </div>;
}

function formatCurrency(amount) {
  return `${amount}$`;
}

function useTransactionHistory() {
  const [transactions, setTransactions] = useRecoilState(transactionsAtom);
  const balance = useRecoilValue(balanceAtom);

  useEffect(() => { loadHistory(); }, []);
  return { transactions, balance };

  async function loadHistory() {
    const transactions = await transactionList();
    setTransactions(transactions);
  }
}
