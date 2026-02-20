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

        this.multiplierDays = page
            .locator('.summary-item', { hasText: 'Multiplier Days' })
            .locator('.body-sm-500');

        this.safetyStock = page
            .locator('.summary-item', { hasText: 'Safety Stock (Units)' })
            .locator('.body-sm-500');
            
        this.leadTimeDays = page
            .locator('.summary-item', { hasText: 'Lead Time Days' })
            .locator('.body-sm-500');

        this.projInvAfterOrd = page
            .locator('.fulfillment-grid-row.today-row')
            .first()
            .locator('.tb-td')
            .nth(7);

        this.sysSugOrd = page
            .locator('.fulfillment-grid-row.today-row')
            .first()
            .locator('.tb-td')
            .nth(5);

        // TODAY's Proj DOH After Ord 
        this.todayProjDohAfterOrd = page
            .locator('.fulfillment-grid-row.today-row')
            .first()
            .locator('.tb-td')
            .nth(6);

        this.minOrdQuantity = page.locator('.summary-item',{hasText:'Min Ord. Quantity'})
                                .locator('.body-sm-500');

        // All future rows
        this.todayAndFutureRows = page.locator('.fulfillment-grid-row.today-row, .fulfillment-grid-row.future-row');
    }

    async enterFulfillmentSku(sku){
        await this.fulfillmentSearchInput.fill(sku);
    }

    async clickPredictButton(){
        await this.predictButton.click();
    }

    // Get TODAY's Proj DOH After Ord value
    async getTodayProjDohValue() {
        const text = await this.todayProjDohAfterOrd.textContent();
        return parseFloat(text.replace(/,/g, '').trim());
    }


    async getFutureProjDohValues(startIndex = 0, endIndex = 199) {
        const projDohValues = [];
        
        
        const futureRows = await this.page
            .locator('.fulfillment-grid-row.future-row')
            .all();
        
        
        const actualEndIndex = Math.min(endIndex, futureRows.length - 1);
        
        // Loop from startIndex to endIndex
        for (let i = startIndex; i <= actualEndIndex; i++) {
            try {
                const row = futureRows[i];  
                const cell = row.locator('.tb-td').nth(6); 
                
                if (await cell.isVisible({ timeout: 500 }).catch(() => false)) {
                    const text = await cell.textContent();
                    const value = parseFloat(text.replace(/,/g, '').trim());
                    
                    if (!isNaN(value)) {
                        projDohValues.push({
                            dayNumber: i + 1,  
                            arrayIndex: i,    
                            value: value
                        });
                    }
                }
            } catch (error) {
                
            }
        }
        
        return projDohValues;
    }
}

module.exports = Fulfillment;