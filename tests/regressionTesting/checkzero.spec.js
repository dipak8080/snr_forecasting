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

test.only('Auto Check Zero', async ({ page }) => {
  test.setTimeout(60 * 60 * 1000);

  const fulfillmentSearchInput = fulfillmentPage.fulfillmentSearchInput;
  const predictButton = fulfillmentPage.predictButton;
  const earlierDay = fulfillmentPage.earlierDay;

  await expect(fulfillmentSearchInput).toBeVisible();
  await expect(predictButton).toBeVisible();

  for (const item of skuData.skuIds) {
    await fulfillmentSearchInput.fill('');

    await Promise.all([
      waitForApiResponse(page, '/api/v1/templates-data/modify'),
      fulfillmentSearchInput.type(String(item), { delay: 50 }),
    ]);

    const suggestionNotFound = page.getByText('SKU does not exist');
    if (await suggestionNotFound.isVisible({ timeout: 800 }).catch(() => false)) {
      console.log(`[QA] SKU not found, skipping: ${item}`);
      continue;
    }

    await Promise.all([
      waitForApiResponse(page, '/api/v1/forecasting/fulfillment/predict/'),
      predictButton.click(),
    ]);

    await expect(earlierDay).toBeVisible();

    const value = (await earlierDay.innerText()).trim();

    if (value === '0') {
      console.log(`[QA] Found ZERO sales for SKU: ${item}`);
      break; 
    } else {
      console.log(`[QA] Sales not zero (${value}) for SKU: ${item}`);
    }
  }
});

