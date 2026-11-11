module.exports=async page=>{
 const group=page.locator('.practice-resources');
 if(await group.count()&&!await group.evaluate(e=>e.open))await group.locator(':scope>summary').click();
};
