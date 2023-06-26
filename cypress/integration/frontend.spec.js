describe('Frontend Test Spec', () => {
  it('should visit index', () => {
    cy.visit('/');
  });

  it('should not allow the form to be submitted when the "Account ID" input is empty', () => {
    cy.visit('/');
    cy.get('input[name="amount"]').type('{Backspace}10');
    cy.get('button').click();
    cy.contains('div', 'Account ID is required').should('be.visible');
  });

  it('should not allow the form to be submitted when the "Amount" input is 0', () => {
    cy.visit('/');
    cy.get('input[name="amount"]').type('{Backspace}0');
    cy.get('input[name="accountId"]').type('testing');
    cy.get('button').click();
    cy.contains('div', 'Amount may not be 0').should('be.visible');
  });

  it('should allow negative amount values to be passed', () => {
    cy.visit('/');
    cy.get('input[name="amount"]').type('{Backspace}-10');
    cy.get('input[name="accountId"]').type('testing');
    cy.get('button').click();

    cy.contains('p', 'Transferred 10$ from account testing').should('be.visible');
  });
  it('should allow positive amount values to be passed', () => {
    cy.visit('/');
    cy.get('input[name="amount"]').type('{Backspace}10');
    cy.get('input[name="accountId"]').type('testing');
    cy.get('button').click();

    cy.contains('p', 'Transferred 10$ to account testing').should('be.visible');
  });
});
