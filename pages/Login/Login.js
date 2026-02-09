const { expect } = require("@playwright/test");
const {waitForApiResponse} = require('../../helper/apiHelper');

class Login{
    constructor(page){
        //Login Page Locators
        this.page = page;
        this.emailInput = page.locator('input[type="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.locator('button[type="submit"]');

        //System UI Locators
        this.orderManagementProjectCard = page.getByText('Order Management System').nth(0);

        //MainDashboard Locators
        this.dashboardHeader = page.getByText('Project Dashboard');

    }

    async gotoHomePage(){
        await this.page.goto('/');
    }

    async loginToApp(email, password){
        await this.page.goto('/');
        await this.emailInput.fill(email);
        await this.passwordInput.fill(password);
        await this.loginButton.click();
        
        Promise.all([
            waitForApiResponse(this.page,'/api/v1/user/profile/'),
            this.page.waitForURL('**/system', { timeout: 60000 }),    
        ])
        await this.orderManagementProjectCard.click();
        await Promise.all([
        
        waitForApiResponse(this.page,'/api/v1/dashboards/'),  
        expect(this.dashboardHeader).toBeVisible(),
        ])

        
    }

}
module.exports = Login;