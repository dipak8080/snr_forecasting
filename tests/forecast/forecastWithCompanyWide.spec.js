const { test, expect } = require('@playwright/test')
const Login = require('../../pages/Login/Login')
const loginCredentials = require('../../fixture/loginCredentials.json')
const skuDetails = require('../../pages/ItemSetup/Sku');
const sidebarContent = require('../../pages/SideBar/SideBar');
const skuItemDetails = require('../../fixture/skuDetails.json');
const { waitForApiResponse } = require('../../helper/apiHelper');
const skuData = require('../../fixture/skuids');
const forecastContent = require('../../pages/Forecast/Forecast');
const storeDetails = require('../../fixture/storeDetails.json');


let loginPage;
let skuPage;
let sidebarPage;
let forecastPage;
test.beforeEach(async ({ page }) => {
    test.setTimeout(60 * 60 * 1000)
    loginPage = new Login(page);
    skuPage = new skuDetails(page);
    sidebarPage = new sidebarContent(page);
    forecastPage = new forecastContent(page);

    await loginPage.loginToApp(loginCredentials.email, loginCredentials.password);
    await sidebarPage.clickForecastMenu();
    await forecastPage.clickOrderFormCompanyWideTab();

})

test('Forecast Visibility Test', async ({ page }) => {

    await expect(forecastPage.orderFormWithStoreTab).toBeVisible();
    await expect(forecastPage.skuInputField).toBeVisible();
    await expect(forecastPage.startDateInputField).toBeVisible();
    await expect(forecastPage.numOfWeeksInputField).toBeVisible();
    await expect(forecastPage.predictButton).toBeVisible();
})

test.only('Auto-Predict Forecast with Company Wide', async ({ page }) => {
    test.setTimeout(60 * 60 * 1000);
    const skuItem = skuData;
    const storeInfo = storeDetails;

    for (const item of skuItem.skuIds) {
        await forecastPage.skuInputField.fill('');
        await Promise.all([
            waitForApiResponse(page, '/api/v1/templates-data/modify'),
            forecastPage.skuInputField.fill(String(item), { delay: 50 })
        ])
        await page.waitForTimeout(2000);



        const suggestionNotFound = page.getByText('SKU does not exist');
        if (await suggestionNotFound.isVisible({ timeout: 800 }).catch(() => false)) {
            console.log(`SKU ${item}: SKIPPED - Not found`);
            continue;
        }


        await forecastPage.skuInputField.press('ArrowDown');
        await forecastPage.skuInputField.press('Enter');


        await forecastPage.enterNoOfWeeks(String(storeInfo.noOfWeeks));

        await Promise.all([
            waitForApiResponse(page, '/api/v1/forecasting/forecast/predict/').catch(e => {
                console.log(`API did not respond for ${item}, continuing...`);
            }),
            forecastPage.clickPredictButton()
        ]);


        const noInternetMessage = page.getByText('No internet connection. Please check your network and try again.', { exact: false });

        if (await noInternetMessage.isVisible({ timeout: 10000 }).catch(() => false)) {
            console.log(`No Internet Connection Shown For ${item} SKU`)
            continue;
        }

        const result = page.getByText('Forecast Results');
        if (await result.isVisible()) {
            console.log(`SKU Predicted Successfully for ${item} SKU`);
        }


    }

})