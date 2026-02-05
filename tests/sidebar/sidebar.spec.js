const {test,expect} = require('@playwright/test')
const {sideBarMenus} = require('../../fixture/sidebarMenus');
const Login = require('../../pages/Login/Login')
const loginCredentials = require('../../fixture/loginCredentials.json')
const sidebarContent = require('../../pages/SideBar/SideBar');

let loginPage;
let sidebar;
test.beforeEach(async({page})=>{
    loginPage = new Login(page);
    sidebar = new sidebarContent(page);
    await loginPage.loginToApp(loginCredentials.email,loginCredentials.password);


})


test('Sidebar Visibility Test',async({page})=>{
    const sidebar = sideBarMenus;
    for(const menuText of sidebar){
        await expect(page.getByText(menuText).nth(0)).toBeVisible();
    }
})

test('Manual Visibility Test of sidebar content', async({page})=>{
    await expect(sidebar.itemSetupMenu).toBeVisible();
    await expect(sidebar.forecastMenu).toBeVisible();
    await expect(sidebar.fulfillmentMenu).toBeVisible();
    await expect(sidebar.purchaseOrderMenu).toBeVisible();
    await expect(sidebar.autoPOMenu).toBeVisible();
    await expect(sidebar.allocationMenu).toBeVisible();
    await expect(sidebar.pickListMenu).toBeVisible();
    await expect(sidebar.vendorProjection).toBeVisible();
    await expect(sidebar.inventoryTracker).toBeVisible();
    await expect(sidebar.salesTracker).toBeVisible();
})