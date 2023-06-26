import { atom, selector } from 'recoil';
import { accountFind } from './service/transaction-management.js';

export const transactions = atom({
    key: 'transactions',
    default: [],
});

export const balance = selector({
    key: 'balance',
    default: null,
    get: async ({ get }) => {
        const trans = get(transactions);
        if (trans.length === 0) {
            return null;
        }
        const { balance } = await accountFind({
            accountId: trans[0].account_id
        });
        return balance;
    },
});
