import { RecoilRoot } from 'recoil';
import { TransactionCreateContainer } from './transaction/TransactionCreate.js';
import { TransactionHistoryContainer } from './transaction/TransactionHistory.js';

export function App() {
  return <RecoilRoot>
    <div className='flex row fill width'>
      <TransactionCreateContainer className='margined outlined padded grow' />
      <TransactionHistoryContainer className='margined outlined padded grow' />
    </div>
  </RecoilRoot>;
}
