class Forecast{
    constructor(page){
        this.orderFormCompanyWideTab = page.getByText('Order Form (Company Wide)');
        this.orderFormWithStoreTab = page.getByText('Order Form ( With Store )', { exact: true })
        this.skuInputField = page.locator('input[type="search"]').first();

        //With Store
        this.storeIdInputField = page.locator('input[type="search"]').nth(1);
        this.startDateInputField = page.locator('input[placeholder="Select date"]');
        this.numOfWeeksInputField = page.locator('input[placeholder="1-52"]')
        this.predictButton = page.getByText('Predict').first();


    }

    async clickOrderFormCompanyWideTab (){
        await this.orderFormCompanyWideTab.click();
    }

        async clickOrderWithStoreTab (){
        await this.orderFormWithStoreTab.click();
    }



    async enterStoreId(storeId){
        await this.storeIdInputField.fill(storeId)
    }
    async enterNoOfWeeks(week){
        await this.numOfWeeksInputField.fill(week);
    }

    async clickPredictButton(){
        await this.predictButton.click();
    }
}
module.exports = Forecast;