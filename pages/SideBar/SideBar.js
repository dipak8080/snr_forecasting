class SideBar{
    constructor(page){
        this.page = page;
        this.itemSetupMenu = page.getByText('Item Setup').nth(0);
        this.forecastMenu = page.getByText('Forecast').nth(0);
        this.fulfillmentMenu = page.getByText('Fulfillment').nth(0);
        this.purchaseOrderMenu = page.getByText('Purchase Orders').nth(0);
        this.autoPOMenu = page.getByText('Auto PO').nth(0);
        this.allocationMenu = page.getByText('Allocation').nth(0);
        this.pickListMenu = page.getByText('Picklist').nth(0);
        this.vendorProjection = page.getByText('Vendor Projection').nth(0);
        this.inventoryTracker = page.getByText('Inventory Tracker').nth(0);
        this.salesTracker = page.getByText('Sales Tracker').nth(0);

    }

    async clickItemSetupMenu(){
        await this.itemSetupMenu.click();
    }

    async clickForecastMenu(){
        await this.forecastMenu.click();
    }


    async clickFulfillmentmenu(){
        await this.fulfillmentMenu.click();
    }

    async clickPurchaseOrderMenu(){
        await this.purchaseOrderMenu.click();
    }

    async clickAutoPOMenu(){
        await this.autoPOMenu.click();
    }

    async clickAllocationMenu(){
        await this.allocationMenu.click();
    }

    async clickPickListMenu(){
        await this.pickListMenu.click();
    }

    async clickVendorProjectionMenu(){
        await this.vendorProjection.click();
    }

    async clickInventoryTrackerMenu(){
        await this.inventoryTracker.click();
    }

    async clickSalesTrackerMenu(){
        await this.salesTracker.click()
    }
}
module.exports = SideBar;