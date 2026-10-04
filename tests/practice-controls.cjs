// Drive the same visible, sequential controls as a teacher.
async function openStep(page,id){const step=page.locator(`[data-practice-step="${id}"]`);if(await step.count()&&!await step.evaluate(e=>e.open))await step.locator(':scope > summary').click()}
async function topic(page,id){
 await openStep(page,'topic');
 const selector=`[data-choose-topic="${id}"]`;
 if(!await page.locator(selector).count()){
  const route=await page.evaluate(id=>DIGIBORD_CONTENT_CATALOG.families.flatMap(f=>f.topics).find(t=>t.id===id)?.levels[0],id);
  if(route){await level(page,route);await openStep(page,'topic')}
 }
 const button=page.locator(selector).first(),group=button.locator('..');if(!await group.evaluate(e=>e.open))await group.locator(':scope > summary').click();await button.click();
}
async function level(page,value){value=require('../route-architecture.js').resolve(value);await openStep(page,'level');await page.locator(`label.practice-choice:has(input[name=level][value="${value}"])`).click()}
async function game(page,selector){await openStep(page,'game');await page.locator(selector).click()}
module.exports={openStep,topic,level,game};
