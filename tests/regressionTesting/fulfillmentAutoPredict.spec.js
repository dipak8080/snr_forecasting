const { test, expect } = require('@playwright/test')
const Login = require('../../pages/Login/Login')
const loginCredentials = require('../../fixture/loginCredentials.json')
const skuDetails = require('../../pages/ItemSetup/Sku');
const sidebarContent = require('../../pages/SideBar/SideBar');
const skuItemDetails = require('../../fixture/skuDetails.json');
const { waitForApiResponse } = require('../../helper/apiHelper');
const skuData = require('../../fixture/skuids');

let loginPage;
let skuPage;
let sidebarPage;
test.beforeEach(async ({ page }) => {
    test.setTimeout(60 * 60 * 1000)
    loginPage = new Login(page);
    skuPage = new skuDetails(page);
    sidebarPage = new sidebarContent(page);
    await loginPage.loginToApp(loginCredentials.email, loginCredentials.password);
    await sidebarPage.clickFulfillmentmenu();
})

test.only('Auto-Predict of selected SKU IDs', async ({ page }) => {
    test.setTimeout(60 * 60 * 1000);
    const fulfillmentSearchInput = page.locator('input[type="search"]').first();
    const predictButton = page.getByRole('button', { name: 'Predict' }).first();

    await expect(fulfillmentSearchInput).toBeVisible();
    await expect(predictButton).toBeVisible();
    await page.pause();
    for (const item of skuData.skuIds) {
        await fulfillmentSearchInput.fill('');
        await Promise.all([
            waitForApiResponse(page, '/api/v1/templates-data/modify'),
            fulfillmentSearchInput.type(String(item), { delay: 50 })
        ]);

        const suggestionNotFound = page.getByText('SKU does not exist');
        if (await suggestionNotFound.isVisible({ timeout: 800 }).catch(() => false)) {
            console.log(`SKU not found, skipping: ${item}`);
            continue;
        }

        await predictButton.press('ArrowDown');
        await predictButton.press('Enter');
        await Promise.all([
            waitForApiResponse(page, '/api/v1/forecasting/fulfillment/predict/'),
            predictButton.click(),
        ]);

        expect(page.getByRole('button', { name: 'Export CSV' })).toBeVisible({ timeout: 5 * 60 * 1000 })

    }

})