describe('todo e2e', () => {
  it('add todo items', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy=icon-ToDo]').dblclick();
    cy.get('[data-cy=window-ToDo] input').type('cypress {enter}');
    cy.get('[data-cy=todo-item]').should('have.length', 1);
    cy.get('[data-cy=window-ToDo] input').type('cypress2 {enter}');
    cy.get('[data-cy=todo-item]').should('have.length', 2);
    cy.get('[data-cy=window-ToDo] input').type('cypress3 {enter}');
    cy.get('[data-cy=todo-item]').should('have.length', 3);
  });

  it('add and delete all items', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy=icon-ToDo]').dblclick();
    cy.get('[data-cy=window-ToDo] input').type('cypress{enter}');
    cy.get('[data-cy=window-ToDo] input').type('cypress2{enter}');
    cy.get('[data-cy=window-ToDo] input').type('cypress3{enter}');
    cy.get('[data-cy=window-ToDo] .fa-trash-alt').eq(2).click();
    cy.get('[data-cy=todo-item]').should('have.length', 2);
    cy.get('[data-cy=window-ToDo] .fa-trash-alt').eq(1).click();
    cy.get('[data-cy=todo-item]').should('have.length', 1);
    cy.get('[data-cy=window-ToDo] .fa-trash-alt').eq(0).click();
    cy.get('[data-cy=todo-item]').should('have.length', 0);
  });

  it('add and check/unckeck items', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy=icon-ToDo]').dblclick();
    cy.get('[data-cy=window-ToDo] input').type('cypress{enter}');
    cy.get('[data-cy=window-ToDo] input').type('cypress2{enter}');
    cy.get('[data-cy=window-ToDo] input').type('cypress3{enter}');
    cy.get('[data-cy=window-ToDo] .fa-check').eq(2).click();
    cy.get('[data-cy=todo-item]').eq(2).find('p')
      .should('have.css', 'text-decoration')
      .and('match', /line-through/);
    cy.get('[data-cy=window-ToDo] .fa-check').eq(2).click();
    cy.get('[data-cy=todo-item]').eq(2).find('p').not.should('have.css', 'text-decoration');
  });

  it('saved items when close or minimize window', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy=icon-ToDo]').dblclick();
    cy.get('[data-cy=window-ToDo] input').type('cypress{enter}');
    cy.get('[data-cy=window-ToDo] input').type('cypress2{enter}');
    cy.get('[data-cy=window-ToDo] input').type('cypress3{enter}');
    cy.get('[data-cy=window-ToDo] .fa-check').eq(2).click();
    cy.get('[data-cy=todo-item]').eq(2).find('p')
      .should('have.css', 'text-decoration')
      .and('match', /line-through/);
    cy.get('[data-cy=window-ToDo] .fa-window-minimize').click();
    cy.get('[data-cy=bottom-tab] .fa-clipboard-list').click();
    cy.get('[data-cy=todo-item]').should('have.length', 3);
    cy.get('[data-cy=todo-item]').eq(2).find('p')
      .should('have.css', 'text-decoration')
      .and('match', /line-through/);
    cy.get('[data-cy=window-ToDo] .fa-times').click();
    cy.get('[data-cy=bottom-tab] .fa-clipboard-list').click();
    cy.get('[data-cy=todo-item]').should('have.length', 3);
    cy.get('[data-cy=todo-item]').eq(2).find('p')
      .should('have.css', 'text-decoration')
      .and('match', /line-through/);
  })
});

export {};
