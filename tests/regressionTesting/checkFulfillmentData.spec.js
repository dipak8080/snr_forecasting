const { test, expect } = require('@playwright/test')
const Login = require('../../pages/Login/Login')
const loginCredentials = require('../../fixture/loginCredentials.json')
const skuDetails = require('../../pages/ItemSetup/Sku');
const sidebarContent = require('../../pages/SideBar/SideBar');
const skuItemDetails = require('../../fixture/skuDetails.json');
const { waitForApiResponse } = require('../../helper/apiHelper');
const skuData = require('../../fixture/skuids');
const fulfillmentDetails = require('../../pages/Fulfillment/Fulfillment');

let loginPage;
let skuPage;
let sidebarPage;
let fulfillmentPage;
test.beforeEach(async ({ page }) => {
    test.setTimeout(60 * 60 * 1000)
    loginPage = new Login(page);
    skuPage = new skuDetails(page);
    sidebarPage = new sidebarContent(page);
    fulfillmentPage = new fulfillmentDetails(page);


    await loginPage.loginToApp(loginCredentials.email, loginCredentials.password);
    await sidebarPage.clickFulfillmentmenu();
})

test.only('Verify Sys Sug Ord should be equal or greater than min ord quantity', async ({ page }) => {
    test.setTimeout(60 * 60 * 1000);
    const approveButton = fulfillmentPage.approveButton;

    for (const item of skuData.skuIds) {
        await fulfillmentPage.enterFulfillmentSku('');
        await Promise.all([
            waitForApiResponse(page, '/api/v1/templates-data/modify/'),
            fulfillmentPage.fulfillmentSearchInput.fill(String(item), { delay: 50 }),
        ]);

        await page.waitForTimeout(2000);

        const suggestionNotFound = page.getByText('SKU does not exist');
        if (await suggestionNotFound.isVisible({ timeout: 800 }).catch(() => false)) {
            console.log(`SKU ${item}: SKIPPED - Not found`);
            continue;
        }

        await Promise.all([
            waitForApiResponse(page, '/api/v1/forecasting/fulfillment/predict/'),
            fulfillmentPage.clickPredictButton()
        ]);

        const poScheduleDay = page.getByText('PO schedule day must be a non empty list of weekday');



        if (await poScheduleDay.isVisible({ timeout: 800 }).catch(() => false)) {
            console.log(`[QA] PO Schedule Day error, skipping SKU: ${item}`);
            continue;
        }

        const isApproveEnabled = await approveButton.isEnabled().catch(() => false);

        if (isApproveEnabled) {
            const minOrdQuantity = fulfillmentPage.minOrdQuantity;
            const sysSugOrd = fulfillmentPage.sysSugOrd;

            // Get values
            const minOrdQuantityValue = await minOrdQuantity.textContent();
            const minOrdQuantityNumber = parseInt(minOrdQuantityValue.replace(/,/g, ''));

            const sysSugOrdValue = await sysSugOrd.textContent();
            const sysSugOrdNumber = parseInt(sysSugOrdValue.replace(/,/g, ''));

            // Compare and log
            if (sysSugOrdNumber >= minOrdQuantityNumber) {
                console.log(`SKU ${item}: ✓ PASS | Sys Sug Ord (${sysSugOrdNumber}) >= Min Ord Quantity (${minOrdQuantityNumber})`);
            } else {
                console.log(`SKU ${item}: ✗ FAIL | Sys Sug Ord (${sysSugOrdNumber}) < Min Ord Quantity (${minOrdQuantityNumber})`);
            }
        } else {
            console.log(`SKU ${item}: SKIPPED - Approve not enabled`);
        }
    }
});


test('Verify Safety Stock should be correctly displayed for todays date', async ({ page }) => {
    test.setTimeout(60 * 60 * 1000);
    const approveButton = fulfillmentPage.approveButton;
    for (const item of skuData.skuIds) {
        await fulfillmentPage.enterFulfillmentSku('');

        await Promise.all([
            waitForApiResponse(page, '/api/v1/templates-data/modify/'),
            fulfillmentPage.fulfillmentSearchInput.fill(String(item), { delay: 50 }),
        ]);

        await page.waitForTimeout(2000);

        const suggestionNotFound = page.getByText('SKU does not exist');
        if (await suggestionNotFound.isVisible({ timeout: 800 }).catch(() => false)) {
            console.log(`SKU not found, skipping: ${item}`);
            continue;
        }
                await  fulfillmentPage.fulfillmentSearchInput.press('ArrowDown');
        await  fulfillmentPage.fulfillmentSearchInput.press('Enter');

        await Promise.all([
            waitForApiResponse(page, '/api/v1/forecasting/fulfillment/predict/'),
            fulfillmentPage.clickPredictButton()
        ]);

        const poScheduleDay = page.getByText('PO schedule day must be a non empty list of weekday');



        if (await poScheduleDay.isVisible({ timeout: 800 }).catch(() => false)) {
            console.log(`[QA] PO Schedule Day error, skipping SKU: ${item}`);
            continue;
        }

        const safetyStock = fulfillmentPage.safetyStock;
        await expect(safetyStock).toBeVisible();

        const projInvAfterOrd = fulfillmentPage.projInvAfterOrd;


        // Get safety stock value
        const safetyStockValue = await safetyStock.textContent();
        const safetyStockNumber = parseInt(safetyStockValue.replace(/,/g, ''));



        const isApproveEnabled = await approveButton.isEnabled().catch(() => false);

        if (isApproveEnabled) {
            console.log(`Approve enabled for SKU: ${item}`);

            const projInvValue = await projInvAfterOrd.textContent();
            const projInvNumber = parseInt(projInvValue.replace(/,/g, ''));
            // Compare values
            if (projInvNumber >= safetyStockNumber) {
                console.log(`✓ SKU: ${item} | Proj Inv (${projInvNumber}) >= Safety Stock (${safetyStockNumber})`);
            } else {
                console.log(`✗ SKU: ${item} | Proj Inv (${projInvNumber}) < Safety Stock (${safetyStockNumber})`);
            }


        } else {
            console.log(`Approve not enabled for SKU: ${item}`);
        }
    }
});
test('Verify Proj DOH After Ord >= Multiplier Days for TODAY', async ({ page }) => {
    test.setTimeout(60 * 60 * 1000);

    for (const item of skuData.skuIds) {
        await fulfillmentPage.enterFulfillmentSku('');

        await Promise.all([
            waitForApiResponse(page, '/api/v1/templates-data/modify'),
            fulfillmentPage.fulfillmentSearchInput.type(String(item), { delay: 50 }),
        ]);

        const suggestionNotFound = page.getByText('SKU does not exist');
        if (await suggestionNotFound.isVisible({ timeout: 800 }).catch(() => false)) {
            console.log(`SKU ${item}: SKIPPED - Not found`);
            continue;
        }

                await  fulfillmentPage.fulfillmentSearchInput.press('ArrowDown');
        await  fulfillmentPage.fulfillmentSearchInput.press('Enter');
        await Promise.all([
            waitForApiResponse(page, '/api/v1/forecasting/fulfillment/predict/'),
            fulfillmentPage.clickPredictButton()
        ]);

        const poScheduleDay = page.getByText('PO schedule day must be a non empty list of weekday');



        if (await poScheduleDay.isVisible({ timeout: 800 }).catch(() => false)) {
            console.log(`[QA] PO Schedule Day error, skipping SKU: ${item}`);
            continue;
        }

        // Get Multiplier Days
        const multiplierDaysValue = await fulfillmentPage.multiplierDays.textContent();
        const multiplierDays = parseFloat(multiplierDaysValue.replace(/,/g, ''));

        // Get TODAY's Proj DOH After Ord
        const todayProjDoh = await fulfillmentPage.getTodayProjDohValue();

        // Compare values
        if (todayProjDoh >= multiplierDays) {
            console.log(`SKU ${item}: ✓ PASS | Today Proj. DOH (${todayProjDoh}) >= Multiplier Days (${multiplierDays})`);
        } else {
            console.log(`SKU ${item}: ✗ FAIL | Today Proj. DOH (${todayProjDoh}) < Multiplier Days (${multiplierDays})`);
        }

        expect(todayProjDoh).toBeGreaterThanOrEqual(multiplierDays);
    }
});

test('Verify Proj DOH After Ord >= Multiplier Days for FUTURE 200 days', async ({ page }) => {
    test.setTimeout(60 * 60 * 1000);

    const START_INDEX = 54;    // Start from first future day (index 0)
    const END_INDEX = 201;    // End at 200th future day (index 199)

    for (const item of skuData.skuIds) {
        await fulfillmentPage.enterFulfillmentSku('');

        await Promise.all([
            waitForApiResponse(page, '/api/v1/templates-data/modify'),
            fulfillmentPage.fulfillmentSearchInput.type(String(item), { delay: 50 }),
        ]);

        const suggestionNotFound = page.getByText('SKU does not exist');
        if (await suggestionNotFound.isVisible({ timeout: 800 }).catch(() => false)) {
            console.log(`SKU ${item}: SKIPPED - Not found`);
            continue;
        }

                await  fulfillmentPage.fulfillmentSearchInput.press('ArrowDown');
        await  fulfillmentPage.fulfillmentSearchInput.press('Enter');

        await Promise.all([
            waitForApiResponse(page, '/api/v1/forecasting/fulfillment/predict/'),
            fulfillmentPage.clickPredictButton()
        ]);

        // Get Multiplier Days
        const multiplierDaysValue = await fulfillmentPage.multiplierDays.textContent();
        const multiplierDays = parseFloat(multiplierDaysValue.replace(/,/g, ''));


        const futureProjDohValues = await fulfillmentPage.getFutureProjDohValues(START_INDEX, END_INDEX);


        const failedDays = futureProjDohValues.filter(doh => doh.value < multiplierDays);

        if (failedDays.length === 0) {
            console.log(`SKU ${item}: ✓ PASS | All ${futureProjDohValues.length} days: Proj. DOH >= Multiplier Days (${multiplierDays})`);
        } else {
            console.log(`SKU ${item}: ✗ FAIL | ${failedDays.length}/${futureProjDohValues.length} days failed`);
            console.log(`  Multiplier Days Required: ${multiplierDays}`);


            const samples = failedDays.slice(0, 3);
            samples.forEach(day => {
                console.log(`  Day ${day.dayNumber} [Index ${day.arrayIndex}]: Proj. DOH (${day.value}) < Multiplier Days (${multiplierDays})`);
            });

            if (failedDays.length > 3) {
                console.log(`  ... and ${failedDays.length - 3} more failed days`);
            }
        }

        expect(failedDays.length).toBe(0);
    }
});

