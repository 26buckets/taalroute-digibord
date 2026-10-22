// Exercise the approved hamburger path before operating a moved header control.
async function headerAction(page, selector, method, ...args) {
 const control=page.locator(selector);
 if(!await control.isVisible())await page.locator('.hdr001-menu-trigger').click();
 await control[method](...args);
 if(await page.locator('.hdr001-menu[open]').count()&&!await page.locator('dialog[open],#settingsOverlay.open').count())await page.locator('.hdr001-menu-trigger').press('Escape');
}
module.exports=headerAction;
