const {test, expect} = require('@playwright/test')
const Login = require('../../pages/Login/Login')
const loginCredentials = require('../../fixture/loginCredentials.json')
const skuDetails = require('../../pages/ItemSetup/Sku');
const sidebarContent = require('../../pages/SideBar/SideBar');
const skuItemDetails = require('../../fixture/skuDetails.json');
const {waitForApiResponse} = require('../../helper/apiHelper');
const skuDate = require('../../fixture/skuids');

let loginPage;
let skuPage;
let sidebarPage;
let skuNumber = String(skuItemDetails.skuNumber)
test.beforeEach(async({page})=>{
    test.setTimeout(60000)
    loginPage = new Login(page);
    skuPage = new skuDetails(page);
    sidebarPage = new sidebarContent(page);
    await loginPage.loginToApp(loginCredentials.email,loginCredentials.password);
    await sidebarPage.clickItemSetupMenu();
    await skuPage.clickSearchInput()
    await skuPage.searchInput.fill('')

    await Promise.all([
    waitForApiResponse(page, '/api/v1/templates-data/modify'),
    skuPage.searchInput.type(skuNumber, { delay: 50 }),
    ]);
    await skuPage.selectSku1Number();

   
})





test('SKU Visibility Test',async({page})=>{
    await expect(skuPage.searchInput).toBeVisible();
    await expect(skuPage.editButton).toBeVisible();
    await expect(skuPage.skuDescriptionHeading).toBeVisible();
    await expect(skuPage.caseBarCodeToggle).toBeVisible();
    await expect(skuPage.upcNumber).toBeVisible();
    await expect(skuPage.dcOrigin).toBeVisible();
    await expect(skuPage.countryOfOrigin).toBeVisible();
    await expect(skuPage.vendorCode).toBeVisible();
    await expect(skuPage.vendorName).toBeVisible();

})

test.only('SKU Visibility Test Edit Section', async({page})=>{
    test.setTimeout(60000)
    await skuPage.clickEditSkuButotn();
    await expect(skuPage.skuNumberReadOnlyField).toBeDisabled();
    await expect(skuPage.addUpcPlusButton ).toBeVisible();

    await skuPage.clickAddUpcPlusButton();
    await expect(skuPage.skuNumberUpcSection ).toBeVisible();

})



