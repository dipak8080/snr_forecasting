const { test, expect } = require('@playwright/test')
const Login = require('../../pages/Login/Login')
const loginCredentials = require('../../fixture/loginCredentials.json')
const skuDetails = require('../../pages/ItemSetup/Sku');
const sidebarContent = require('../../pages/SideBar/SideBar');
const skuItemDetails = require('../../fixture/skuDetails.json');
const { waitForApiResponse } = require('../../helper/apiHelper');
const skuDate = require('../../fixture/skuids');

let loginPage;
let skuPage;
let sidebarPage;
test.beforeEach(async ({ page }) => {
    test.setTimeout(60000)
    loginPage = new Login(page);
    skuPage = new skuDetails(page);
    sidebarPage = new sidebarContent(page);
    await loginPage.loginToApp(loginCredentials.email, loginCredentials.password);
    await sidebarPage.clickItemSetupMenu();


})

test('Auto Saving all Sku ids', async ({ page }) => {
    const fulfillmentTab = page.getByRole('tab', { name: 'Fulfillment' });
    const saveChangesButton = page.getByRole('button', { name: 'Save Changes' }).first();
    const skuDataItem = skuDate.skuIds;
    for (const item of skuDataItem) {

        await skuPage.clickSearchInput()
        await skuPage.searchInput.fill('')
        await Promise.all([
            waitForApiResponse(page, '/api/v1/templates-data/modify'),
            skuPage.searchInput.type(String(item), { delay: 50 }),
        ]);

        const suggestionNotFound = page.getByText('SKU not found');
        if (await suggestionNotFound.isVisible({ timeout: 800 }).catch(() => false)) {
            console.log(`SKU not found, skipping: ${item}`);
            continue;
        }


        await Promise.all([
            waitForApiResponse(page, '/api/v1/templates-data/mapping?'),
            skuPage.selectSku1Number(),

        ]);

        await expect(fulfillmentTab).toBeVisible();
        await fulfillmentTab.click()

        await Promise.all([
            waitForApiResponse(page, '/api/v1/item-setup/upsert/'),
            saveChangesButton.click()
        ]);



    }

})
