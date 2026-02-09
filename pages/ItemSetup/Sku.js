class Sku {
    constructor(page) {
        //Main Search Section
        this.searchInput = page.locator('input[type="search"]').first();

        //Edit Button
        this.editButton = page.getByRole('button', { name: 'Edit' });

        //SKU Details Section
        this.skuDescriptionHeading = page.locator('.SkuInformation__ProductTitle-sc-3a19f28f-16.jpUFLi');

        this.caseBarCodeToggle = page.locator('input[type="checkbox"]');
        this.upcNumber = page.locator('.info-content', { hasText: 'UPC' })
            .locator('.value span')
        this.dcOrigin = page.locator('.info-content', { hasText: 'DC Origin' })
            .locator('span.value');
        this.countryOfOrigin = page.locator('.info-content', { hasText: 'Country of Origin' })
            .locator('span.value');
        this.vendorCode = page.locator('.info-content', { hasText: 'Vendor Code' })
            .locator('span.value');
        this.vendorName = page.locator('.info-content', { hasText: 'Vendor Name' })
            .locator('span.value');
        

        //Edit Sesction
        this.skuNumberReadOnlyField = page.locator('input[type="search"]').nth(1);
        this.upcNumberEditFied = page.locator();

        this.addUpcPlusButton = page.locator('div.add');

        //UPC ADD Button Section
        this.skuNumberUpcSection = page.locator('input[type="search"]').nth(2);
        this.upcNumberInputField = page.locator();
        this.upcSubmitButton = page.locator();




    }

    async clickSearchInput() {
        await this.searchInput.click();
    }

    async selectSku1Number() {
        await this.searchInput.press('ArrowDown');
        // await this.searchInput.press('ArrowDown');
        await this.searchInput.press('Enter');
    }

    async clickEditSkuButotn() {
        await this.editButton.click();
    }

    async clickAddUpcPlusButton() {
        await this.addUpcPlusButton.click();
    }


}
module.exports = Sku;