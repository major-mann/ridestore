import { API_TRANSACTION_MANAGEMENT } from '../env.js';
import log from '../log.js';
import assert from '../assert.js';

export {
    ping,

    transactionCreate,
    transactionList,
    transactionFind,

    accountFind,
};

async function ping() {
    try {
        await api(`/ping`);
    } catch (error) {
        return false;
    }
}

async function transactionCreate({ accountId, amount }) {
    assert(accountId, `transactionCreate missing accountId`);
    assert(Number.isInteger(amount), `transactionCreate amount is not a valid integer`);

    const { data: transaction } = await api(`/transactions`, {
        method: `POST`,
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            account_id: accountId,
            amount,
        })
    });
    return transaction;
}

async function transactionList() {
    const { data: transactions } = await api(`/transactions`);
    return transactions;
}

async function transactionFind({ transactionId }) {
    assert(transactionId, `transactionFind missing transactionId`);
    const { data: transaction } = await api(`/transaction/${encodeURIComponent(transactionId)}`);
    return transaction;
}

async function accountFind({ accountId }) {
    assert(accountId, `accountFind missing accountId`);
    const { data: account } = await api(`/accounts/${encodeURIComponent(accountId)}`);
    return account;
}

async function api(path, options) {
    const url = new URL(path, API_TRANSACTION_MANAGEMENT);

    let response;
    try {
        response = await fetch(url, options);
    } catch (error) {
        log.error(`Unable to call "${url}"`, error);
        throw new Error(
            `A network error occurred calling the transaction management ` +
            `"${path}" endpoint`
        );
    }

    if (response.status === 204) {
        return undefined;
    }

    if (response.ok) {
        if (!response.body) {
            return undefined;
        }

        const text = await response.text();
        try {
            const json = JSON.parse(text);
            return {
                status: response.status,
                data: json,
            };
        } catch (error) {
            log.error(
                `An error occurred parsing content received from the ` +
                `transaction management "${path}" endpoint`,
                text,
                error,
            );
            throw new Error(
                `The response from the transaction management ` +
                `"${path}" endpoint contained invalid JSON`
            );
        }
    }

    if (response.status === 404) {
        return undefined;
    }

    if (response.status >= 400 && response.status < 500) {
        throw buildError(
            response.status,
            `A request to the transaction management "${path}" endpoint ` +
            `was malformed`
        );
    }

    const info = response.body ?
        await response.text() :
        `Transaction management server error: ${response.status}`;

    log.error(
        `An error occurred calling transaction management ` +
            `"${path}" endpoint (status code: ${response.status})`,
        response.status,
        info,
    );

    throw buildError(
        response.status,
        `An server error occurred calling the transaction management ` +
            `"${path}" endpoint`
    );
}

function buildError(status, message) {
    const error = new Error(message);
    error.status = status;
    return error;
}
