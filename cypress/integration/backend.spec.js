const apiUrl = `${Cypress.env('apiUrl')}`;

describe('Backend Test Spec', () => {

  it('should call ping', () => {
    request('/ping', undefined, false)
      .then((response) => {
        expect(response.status).to.eq(200);
      });
  });

  it('should add transactions', () => {
    request('/transactions', { account_id: 'testing', amount: 10 })
      .then((response) => {
        const body = JSON.parse(response.body);
        expect(body.account_id).to.eq('testing');
        expect(body.amount).to.eq(10);
      });
  });

  it('should list added transactions', () => {
    request('/transactions', { account_id: 'testing', amount: 10 })
      .then((response) => {
        return JSON.parse(response.body);
      })
      .then(({ transaction_id }) => {
        request('/transactions')
          .then((response) => {
            expect(
              JSON.parse(response.body).find(
                (transaction) => transaction.transaction_id === transaction_id
              )
            ).not.to.be.undefined;
          });
      });
  });

  it('should retrieve a single transaction', () => {
    request('/transactions', { account_id: 'testing', amount: 10 })
      .then((response) => {
        const body = JSON.parse(response.body);
        return request(`/transactions/${body.transaction_id}`)
          .then((response) => {
            const transaction = JSON.parse(response.body);
            expect(body.transaction_id).to.eq(transaction.transaction_id);
          });
      });
  });

  it('should retrieve the account balance transaction', () => {
    request('/transactions', { account_id: 'testing', amount: 10 })
      .then(() => {
        return request('/transactions')
          .then((response) => {
            const transactions = JSON.parse(response.body);
            const balance = transactions
              .filter((transaction) => transaction.account_id === 'testing')
              .reduce(
                (result, transaction) => result + transaction.amount,
                0,
              );

            return request('/accounts/testing')
              .then((response) => {
                const { balance: accountBalance } = JSON.parse(response.body);
                expect(balance).to.eq(accountBalance);
              });
          });
      });
  });
});

function request(path, body, failOnStatusCode = true) {
  return cy.request({
    method: body ? 'POST' : 'GET',
    failOnStatusCode,
    url: `${apiUrl}${path}`,
    headers: body && {
      'Content-Type': 'application/json'
    },
    body: body && JSON.stringify(body)
  });
}
