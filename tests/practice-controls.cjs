// Drive the same visible, sequential controls as a teacher.
async function openStep(page,id){const step=page.locator(`[data-practice-step="${id}"]`);if(await step.count()&&!await step.evaluate(e=>e.open))await step.locator(':scope > summary').click()}
async function topic(page,id){await openStep(page,'topic');const button=page.locator(`[data-choose-topic="${id}"]`).first(),group=button.locator('..');if(!await group.evaluate(e=>e.open))await group.locator(':scope > summary').click();await button.click()}
async function level(page,value){await openStep(page,'level');await page.locator(`label.practice-choice:has(input[name=level][value="${value}"])`).click()}
async function game(page,selector){await openStep(page,'game');await page.locator(selector).click()}
module.exports={openStep,topic,level,game};
