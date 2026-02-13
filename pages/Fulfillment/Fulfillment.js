class Fulfillment{
    constructor(page){
        this.page = page;
        this.fulfillmentSearchInput = page.locator('input[type="search"]').first();
        this.predictButton = page.getByRole('button', { name: 'Predict' }).first();
        this.approveButton = page.getByRole('button', { name: 'Approve' }).first();
        this.exportCsvButton = page.getByRole('button', { name: 'Export CSV' });
        

        //Earlier Day
        this.earlierDay = page
            .locator('.fulfillment-grid-row.past-row')
            .nth(46)
            .locator('.tb-td')
            .nth(2);

    }

    async enterFulfillmentSku(sku){
        await this.fulfillmentSearchInput.fill(sku);
    }

    async clickPredictButton(){
        await this.predictButton.click();
    }

    

}
module.exports = Fulfillment;