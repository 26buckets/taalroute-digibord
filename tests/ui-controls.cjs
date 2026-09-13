/* Follow the actual drawer UI before using a control, then return to the map. */
async function reveal(page){const toggle=page.locator('#db-controls-toggle');if(await toggle.isVisible()&&await toggle.getAttribute('aria-expanded')!=='true')await toggle.click();}
async function conceal(page){const toggle=page.locator('#db-controls-toggle');if(await toggle.isVisible()&&await toggle.getAttribute('aria-expanded')==='true'&&!await page.locator('dialog[open]').count())await toggle.click();}
async function control(page,selector,action,arg){const locator=page.locator(selector);const inDrawer=await locator.evaluate(e=>!!e.closest('#db-play-controls'));if(inDrawer)await reveal(page);const result=await locator[action](arg);if(inDrawer)await conceal(page);return result;}
module.exports={control,reveal,conceal};
