const {test,expect} = require('@playwright/test')
const {sideBarMenus} = require('../../fixture/sidebarMenus');
const Login = require('../../pages/Login/Login')
const loginCredentials = require('../../fixture/loginCredentials.json')


let loginPage;
test.beforeEach(async({page})=>{
    loginPage = new Login(page);
    await loginPage.loginToApp(loginCredentials.email,loginCredentials.password);

})



test('Sidebar Visibility Test',async({page})=>{
    const sidebar = sideBarMenus;
    for(const menuText of sidebar){
        await expect(page.getByText(menuText).nth(0)).toBeVisible();
    }
})