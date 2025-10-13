describe('Stock Checkout Functionality', () => {

    beforeEach(() => {
        cy.visit('http://127.0.0.1:8080');
        cy.get('.department-section', { timeout: 10000 }).should('be.visible');
    });

    it('should decrease stock when a material is checked out for a job order', () => {
        // 1. setup unikalne dane testowe
        const uniqueId = Date.now(); // unikalny identyfikator
        const materialName = `Test Plywood for Checkout ${uniqueId}`; // Dodajemy go do nazwy
        const initialStock = 50;
        const stockToCheckout = 5;
        const expectedStockAfter = initialStock - stockToCheckout;

        cy.get('#addMaterialBtn').click();
        cy.get('#materialDepartment').select('Carpentry');
        cy.get('#materialName').type(materialName); //nowa unikalna nazwa
        cy.get('#materialThicknessSlider').invoke('val', 12).trigger('input');
        cy.get('#materialSize').type('8x4');
        cy.get('#initialStockSlider').invoke('val', initialStock).trigger('input');
        cy.get('#minStockSlider').invoke('val', 10).trigger('input');
        cy.get('#confirmAddMaterial').click();

        cy.contains('.modal-box', 'Material added successfully!').find('button').click();

        cy.contains(materialName)
            .parents('tr')
            .find('.progress-bar-text')
            .should('contain', initialStock);

        // 2. akcja - wydanie materialu ze stoku
        cy.get('#checkOutStockBtn').click();

        cy.get('#salespersonPrefixCheckout').select('PM');
        cy.get('#jobOrderNumberInputCheckout').type('99999');
        cy.get('#confirmJobOrderCheckout').click();

        cy.get('.modal-box').should('be.visible');
        // Wybieramy opcję z listy, używając naszej unikalnej nazwy
        cy.get('.material-select').select(`${materialName} 12mm 8x4`);

        // Poprawny selektor suwaka
        cy.contains('.form-group', 'Quantity to Use').find('input[type="range"]').invoke('val', stockToCheckout).trigger('input');
        cy.get('#confirmAllMaterialUsage').click();

        // 3.asercja
        cy.log(`Checking if stock changed from ${initialStock} to ${expectedStockAfter}`);

        cy.contains('.modal-box', 'Stock successfully checked out').find('button').click();

        cy.contains(materialName)
            .parents('tr')
            .find('.progress-bar-text')
            .should('contain', expectedStockAfter);
    });

});
