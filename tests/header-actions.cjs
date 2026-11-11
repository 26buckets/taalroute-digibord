// Exercise the approved hamburger path before operating a moved header control.
async function headerAction(page, selector, method, ...args) {
 await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
 const control=page.locator(selector);
 if(!await control.isVisible()&&!await page.locator('.hdr001-menu').evaluate(e=>e.open))await page.locator('.hdr001-menu-trigger').click();
 const group=control.locator('xpath=ancestor::details[contains(@class,"actief-menu-group")]');
 if(await group.count()&&!await control.isVisible())await group.locator(':scope > summary').click();
 await control[method](...args);
 if(await page.locator('.hdr001-menu[open]').count()&&!await page.locator('dialog[open],#settingsOverlay.open').count())await page.locator('.hdr001-menu-trigger').press('Escape');
}
module.exports=headerAction;
