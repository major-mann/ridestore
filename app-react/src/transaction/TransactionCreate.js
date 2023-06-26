import { useState, useRef } from 'react';
import { useRecoilState } from 'recoil';

import * as Yup from 'yup';
import { useFormik } from 'formik';
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';

import { transactions } from '../state.js';
import { transactionCreate } from '../service/transaction-management.js'

export function TransactionCreateContainer({ className }) {
  const { create } = useTransactionCreate();
  return <TransactionCreate
    className={className}
    onTransactionCreate={create}
  />;
}

export function TransactionCreate({ onTransactionCreate, className }) {
  const [isLoading, setIsLoading] = useState(false);
  const form = useFormik({
    onSubmit,
    initialValues: {
      accountId: ``,
      amount: 0,
    },
    validationSchema: Yup.object({
      accountId: Yup.string().required(`Account ID is required`),
      amount: Yup.number()
        .integer()
        .required(`Amount MUST be a valid integer`)
        .test({
          test: (value) => parseInt(value, 10) !== 0,
          message: `Amount may not be 0`
        }),
    })
  });
  const [accountIdInput, focusAccountIdInput] = useFocus();

  return <div className={className}>
    <h1>Submit new transaction</h1>
    <form onSubmit={form.handleSubmit}>
      <div className='flex col'>
        <label className='flex col margined'>
          Account ID
          <InputText
            data-testid='new-transaction-input-account-id'
            ref={accountIdInput}
            className='grow'
            data-type='account-id'
            name='accountId'
            value={form.values.accountId}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
          { error(`accountId`) }
        </label>
        <label className='flex col margined'>
          Amount
          <br />
          <InputText
            data-testid='new-transaction-input-amount'
            className='grow'
            data-type='amount'
            name='amount'
            value={form.values.amount}
            onChange={form.handleChange}
            onBlur={form.handleBlur}
          />
          { error(`amount`) }
        </label>
        {/* TODO: Check that is is OK to swap the input for a button */}
        <Button
          data-testid='new-transaction-submit'
          data-type='transaction-submit'
          label='Submit'
          type='submit'
          className='margined'
          loading={isLoading}
        />
      </div>
    </form>
  </div>;

  async function onSubmit(data) {
    try {
      setIsLoading(true);
      if (typeof onTransactionCreate === `function`) {
        await onTransactionCreate({
          accountId: data.accountId,
          amount: parseInt(data.amount, 10),
        });
      }
      form.resetForm();
      focusAccountIdInput();
    } finally {
      setIsLoading(false);
    }
  }

  function error(name) {
    if (!form.touched[name]) {
      return null;
    }
    return <div className='error'>{form.errors[name]}</div>;
  }
}

function useFocus() {
  const ref = useRef(null);
  return [ref, setFocus];

  function setFocus() {
    if (ref.current) {
      ref.current.focus();
    }
  }
}

function useTransactionCreate() {
  const [,setHistory] = useRecoilState(transactions);
  return { create };

  async function create({ accountId, amount }) {
    const transaction = await transactionCreate({
      accountId,
      amount,
    });
    setHistory(
      (existing) => [transaction, ...existing]
    );
  }
}
