import { render, screen, act, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TransactionCreate } from './TransactionCreate.js';
import '../env.js';

jest.mock(`../env.js`);

test('render the form', async () => {
  render(<TransactionCreate />);

  const accountIdElement = await screen.findByTestId(`new-transaction-input-account-id`);
  const amountElement = await screen.findByTestId(`new-transaction-input-amount`);
  const submitElement = await screen.findByText(`Submit`);

  expect(accountIdElement).toBeInTheDocument();
  expect(amountElement).toBeInTheDocument();
  expect(submitElement).toBeInTheDocument();
});

test('accept valid input', async () => {
  const accountId = randomString();
  const amount = randomInt();

  const user = userEvent.setup()
  const onTransactionCreate = jest.fn();

  render(<TransactionCreate onTransactionCreate={onTransactionCreate} />);

  await enterTestData(user, accountId, amount);

  expect(onTransactionCreate.mock.calls.length).toBe(1);
  expect(onTransactionCreate.mock.calls[0][0]?.accountId).toBe(accountId);
  expect(onTransactionCreate.mock.calls[0][0]?.amount).toBe(amount);
});

test('accept negative amount', async () => {
  const accountId = randomString();
  const amount = randomInt() * -1;

  const user = userEvent.setup()
  const onTransactionCreate = jest.fn();

  render(<TransactionCreate onTransactionCreate={onTransactionCreate} />);

  await enterTestData(user, accountId, amount);

  expect(onTransactionCreate.mock.calls.length).toBe(1);
  expect(onTransactionCreate.mock.calls[0][0]?.accountId).toBe(accountId);
  expect(onTransactionCreate.mock.calls[0][0]?.amount).toBe(amount);
});

test('reject empty accountId', async () => {
  const amount = randomInt();

  const user = userEvent.setup()
  const onTransactionCreate = jest.fn();

  render(<TransactionCreate onTransactionCreate={onTransactionCreate} />);

  await enterTestData(user, undefined, amount);

  expect(onTransactionCreate.mock.calls.length).toBe(0);
  
  const errorElement = await screen.findByText(`Account ID is required`);
  expect(errorElement).toBeInTheDocument();
});

test('reject amount 0', async () => {
  const accountId = randomString();

  const user = userEvent.setup()
  const onTransactionCreate = jest.fn();

  render(<TransactionCreate onTransactionCreate={onTransactionCreate} />);

  await enterTestData(user, accountId, 0);

  expect(onTransactionCreate.mock.calls.length).toBe(0);
  const errorElement = await screen.findByText(`Amount may not be 0`);
  expect(errorElement).toBeInTheDocument();
});

async function enterTestData(user, accountId, amount) {
  if (accountId !== undefined) {
    await user.click(screen.getByTestId(`new-transaction-input-account-id`))
    await user.keyboard(accountId);
  }
  if (amount !== undefined) {
    await user.click(screen.getByTestId(`new-transaction-input-amount`))
    await user.keyboard(`{BackSpace}${amount}`);
  }
  await waitFor(() => user.click(screen.getByText(`Submit`)));
}

function randomString() {
  return Math.random().toString(36).substring(2);
}

function randomInt() {
  return Math.floor(Math.random() * 100);
}
