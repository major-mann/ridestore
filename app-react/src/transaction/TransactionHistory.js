module.exports = { TransactionHistory };

const log = require(`../log.js`);

function TransactionHistory({ transactions }) {
    const balance = transactions.reduce(
        (result, transaction) => {
            return result + transaction.amount;
        },
        0,
    );

    return <div>
        <h1>Transaction History</h1>
        { transactions.slice().reverse().map(
            (transaction, index, arr) => <Transaction
                transactionId={transaction.transaction_id}
                accountId={transaction.account_id}
                amount={transaction.amount}
                balance={index === arr.length - 1 ? balance : null}
                createdAt={transaction.created_at}
            />
        ) }
    </div>;
}

function Transaction({ transactionId, accountId, amount, createdAt }) {
    if (amount > 0) {
        return <Deposit
            transactionId={transactionId}
            accountId={accountId}
            amount={amount}
            createdAt={createdAt}
        />;
    } else if (amount < 0) {
        return <Withdrawal
            transactionId={transactionId}
            accountId={accountId}
            amount={Math.abs(amount)}
            createdAt={createdAt}
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
    >
        <div className='header'>Transaction amount (deposit)</div>
        Transferred {formatCurrency(amount)} to account {accountId}
        { balance && <div>The current account balance is {formatCurrency(balance)}</div> }
    </div>
}

function Withdrawal({ accountId, amount, balance }) {
    return <div
        data-type="transaction"
        data-account-id={accountId}
        data-amount={amount}
        data-balance={balance}
    >
        <div className='header'>Transaction amount (withdrawal)</div>
        Transferred {formatCurrency(amount)} from account {accountId}
        { balance && <div>The current account balance is {formatCurrency(balance)}</div> }
    </div>
}

function formatCurrency(amount) {
    return `${amount}$`;
}
