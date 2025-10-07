describe('Material addition', () => {

    // przed KAŻDYM testem poniżej:
    beforeEach(() => {
        // 1. wejdź na stronę
        cy.visit('http://127.0.0.1:8080');

        // 2. Poczekaj, aż apka sięzaładuje
        cy.get('.department-section', { timeout: 10000 }).should('be.visible');
    });

    // Test 1: happy path - dodawania stocku
    it('should allow a user to add a new material to the stock', () => {
        cy.get('#addMaterialBtn').click();

        cy.get('.modal-box').should('be.visible');
        cy.get('.modal-box h3').should('contain', 'Add New Material to Inventory');

        cy.get('#materialDepartment').select('Carpentry'); // wybierz poprawny departament
        cy.get('#materialName').type('Test MDF'); //
        cy.get('#materialThicknessSlider').invoke('val', 18).trigger('input');
        cy.get('#materialSize').type('10x5');
        cy.get('#initialStockSlider').invoke('val', 50).trigger('input');
        cy.get('#minStockSlider').invoke('val', 10).trigger('input');

        cy.get('#confirmAddMaterial').click();
        cy.get('.modal-box').should('not.exist');

        // asercja
        cy.contains('.department-title', 'Carpentry')
            .parents('.department-section')
            .find('table tbody')
            .should('contain', 'Test MDF');
    });

    // Test 2 Unhappy Path
    it('should show an error message when submitting with an empty material name', () => {
        cy.get('#addMaterialBtn').click();

        // brak nazwy materiału
        cy.get('#materialDepartment').select('Carpentry');
        cy.get('#materialSize').type('10x5');

        cy.get('#confirmAddMaterial').click();

        // Sprawdza czy pojawił się modal z komunikatem błędu
        cy.get('.modal-box').should('be.visible');
        cy.get('#cancelAddMaterial').click();
        cy.get('.modal-box').should('contain', 'Please fill in Department, Material Name');

        // Po kliknięciu ok w komunikacie, zamykamy go
        cy.get('#okModalMessage').click();
        cy.get('.modal-box').should('not.exist');

        // asercja sprawdzamy czu Test MDF NIE został dodany do tabeli.
        cy.contains('.department-title', 'Carpentry')
            .parents('.department-section')
            .find('table tbody')
            .should('not.contain', 'Test MDF');
    });

});