describe('dragNDrop hook e2e', () => {
  it('should dragNDrop icon', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy=icon-ToDo]')
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', { which: 1, pageX: 300, pageY: 200 })
      .trigger('mouseup')
    cy.get('[data-cy=icon-ToDo]').then($el => $el[0].getBoundingClientRect().x).should('equal', 271.3999938964844);
    cy.get('[data-cy=icon-ToDo]').then($el => $el[0].getBoundingClientRect().y).should('equal', 178.1999969482422);
  });

  it('should dragNDrop window', () => {
    cy.visit('http://localhost:3000');
    cy.get('[data-cy=icon-ToDo]').dblclick()
    cy.wait(1000);
    cy.get('[data-cy=window-ToDo] div').eq(2)
      .trigger('mousedown', { which: 1 })
      .trigger('mousemove', { which: 1, pageX: 500, pageY: 100 })
      .trigger('mouseup')
    cy.get('[data-cy=window-ToDo] div').eq(2).then($el => $el[0].getBoundingClientRect().x).should('equal', 194.1999969482422);
    cy.get('[data-cy=window-ToDo] div').eq(2).then($el => $el[0].getBoundingClientRect().y).should('equal', 94);
  });
});

export {};
