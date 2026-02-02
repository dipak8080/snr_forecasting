const {test, expect} = require('@playwright/test')
const Login = require('../../pages/Login/Login')
const loginCredentials = require('../../fixture/loginCredentials.json')


let loginPage;
test.beforeEach(async({page})=>{
    loginPage = new Login(page);
})

test('Visibility Test',async({page})=>{
    await loginPage.gotoHomePage();
    await expect(loginPage.emailInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
})