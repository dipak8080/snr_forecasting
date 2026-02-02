const {test, expect} = require('@playwright/test')
const Login = require('../../pages/Login/Login')
const loginCredentials = require('../../fixture/loginCredentials.json')


let loginPage;
test.beforeEach(async({page})=>{
    loginPage = new Login(page);
    await loginPage.loginToApp(loginCredentials.email,loginCredentials.password);

})

test('SKU Visibility Test',async({page})=>{
    console.log('Success');
})