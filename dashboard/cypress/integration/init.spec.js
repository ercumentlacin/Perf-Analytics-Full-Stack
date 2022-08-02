describe('Cypress', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('is working', () => {
    expect(true).to.equal(true);
  });

  it('visits the app', () => {
    cy.visit('/');
  });

  it('display ant-picker', () => {
    cy.get('.ant-picker-input').should('be.visible');
  });

  it('displays analytics', () => {
    cy.request('http://localhost:9000/api/v1/perf-analytics').should(
      (response) => {
        expect(response.status).to.eq(200);
        // expect(response.body).to.have.length(10)
        expect(response).to.have.property('headers');
        expect(response).to.have.property('duration');
      }
    );
  });
});
