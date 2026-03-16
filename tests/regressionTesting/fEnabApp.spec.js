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

test.only('Auto-Find Enabled Approve Button', async ({ page }) => {
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
      waitForApiResponse(page, '/api/v1/forecasting/fulfillment/predict/').catch(e => {
                console.log(`API did not respond for ${item}, continuing...`);
            }),
      fulfillmentPage.clickPredictButton()
    ]);

            const noInternetMessage = page.getByText('We’re unable to process your request right now. Please try again shortly.', { exact: false });

        if (await noInternetMessage.isVisible({ timeout: 10000 }).catch(() => false)) {
            console.log(`We’re unable to process your request right now. Please try again shortly for. ${item} SKU`)
            continue;
        }



    const poScheduleDay = page.getByText('PO schedule day must be a non empty list of weekday');

    if (await poScheduleDay.isVisible({ timeout: 800 }).catch(() => false)) {
      console.log(`[QA] PO Schedule Day error, skipping SKU: ${item}`);
      continue;
    }

    const isApproveEnabled = await approveButton.isEnabled().catch(() => false);

    if (isApproveEnabled) {
      console.log(`Approve enabled for SKU: ${item}`);
      
    } else {
      console.log(`Approve not enabled for SKU: ${item}`);
    }
  }
});
