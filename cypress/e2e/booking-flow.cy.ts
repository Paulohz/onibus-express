describe('Fluxo de compra de passagem', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  it('deve completar o fluxo completo de compra', () => {
    cy.contains('Selecione a origem').click()
    cy.contains('São Paulo').click()

    cy.contains('Selecione o destino').click()
    cy.contains('Rio de Janeiro').click()

    cy.get('[data-testid="date-picker"]').should('not.exist')
    cy.contains('Selecione uma data').click()
    cy.get('[role="gridcell"]').contains('17').click()

    cy.contains('Buscar passagens').click()

    cy.contains('São Paulo - Rio de Janeiro').should('be.visible')
    cy.contains('Selecionar').first().click()

    cy.contains('Selecione seu assento').should('be.visible')
    cy.get('[aria-label="Assento 1"]').click()
    cy.contains('Continuar').click()

    cy.contains('Dados do passageiro').should('be.visible')
    cy.get('#name').type('João Silva')
    cy.get('#cpf').type('529.982.247-25')
    cy.get('#email').type('joao@email.com')
    cy.contains('Confirmar reserva').click()

    cy.contains('Reserva confirmada!').should('be.visible')
    cy.contains('ABC-12345').should('be.visible')
  })
})
