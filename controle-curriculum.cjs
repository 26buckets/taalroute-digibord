const assert = require('node:assert/strict');
const fs = require('node:fs');
const {chromium} = require(process.env.PLAYWRIGHT_MODULE || 'playwright');
(async () => {
  const browser = await chromium.launch({channel:'chrome',headless:true});
  try {
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror',error=>errors.push(error.message));
    const url = process.env.DIGIBORD_URL || 'http://127.0.0.1:8773';
    const output = process.env.SCREENSHOT_DIR || 'test-results';
    fs.mkdirSync(output,{recursive:true});
    const open = async () => {
      await page.locator('#curriculumContext').click();
      await page.waitForFunction(()=>document.querySelector('#curriculumContext').getAttribute('aria-expanded')==='true');
    };
    const closed = async () => {
      await page.waitForFunction(()=>document.querySelector('#curriculumContext').getAttribute('aria-expanded')==='false');
      assert.equal(await page.locator('#curriculumPanel').isVisible(),false);
    };
    for (const width of [1920,1366,1051,1050,1024,1000,901,900,800,721,720,651,650,601,600,541,390,320]) {
      await page.setViewportSize({width,height:width===1920?1080:width>=1366?900:700});
      await page.goto(url);
      await open();
      const layout = await page.evaluate(()=>{
        const rect = selector=>document.querySelector(selector).getBoundingClientRect().toJSON();
        return {header:rect('#app>header'),brand:rect('.brand'),nav:rect('.mainnav'),actions:rect('.header-actions'),panel:rect('#curriculumPanel'),overflow:document.querySelector('#curriculumPanel').scrollWidth>document.querySelector('#curriculumPanel').clientWidth,scroll:document.documentElement.scrollWidth,height:innerHeight};
      });
      assert.equal(layout.header.height,62);
      assert.ok(layout.actions.right<=width,JSON.stringify(layout));
      assert.ok(layout.brand.right<=layout.actions.left+1,'brand overlap '+width);
      if(width>720||width<=650) assert.ok(layout.nav.right<=layout.actions.left+1,'nav overlap '+width);
      assert.ok(layout.panel.left>=0&&layout.panel.right<=width&&layout.panel.bottom<=layout.height,'panel outside viewport '+width);
      assert.ok(!layout.overflow&&layout.scroll<=width,'horizontal overflow '+width);
      assert.equal(await page.locator('#curriculumThemes li').count(),8);
      await page.locator('#curriculumBook').selectOption('alfa-a');
      assert.equal(await page.locator('#curriculumThemes li').count(),16);
      if([1920,1366,800,390,320].includes(width)) await page.screenshot({path:`${output}/curriculum-menu-${width}.png`});
      await page.keyboard.press('Escape');
      await closed();
      assert.equal(await page.evaluate(()=>document.activeElement.id),'curriculumContext');
      console.log('PASS responsive menu',width);
    }
    await page.setViewportSize({width:1366,height:900});
    await page.goto(url);
    const before = await page.evaluate(()=>JSON.stringify({app:APP,storage:{...localStorage},screen:document.querySelector('.screen.active').id}));
    await open();
    const counts = {fundament:8,startpunt:8,'op-verkenning':8,groei:8,zelfverzekerd:8,vaardig:8,meesterschap:8,'alfa-a':16,'alfa-b':16,'alfa-c':16};
    assert.equal(await page.locator('#curriculumBook option').count(),10);
    for(const [book,count] of Object.entries(counts)) {
      await page.locator('#curriculumBook').selectOption(book);
      assert.equal(await page.locator('#curriculumThemes li').count(),count,book);
      assert.equal(await page.locator('#curriculumThemes button,#curriculumThemes a,[data-curriculum-open]').count(),0);
      if(book.startsWith('alfa')) assert.equal(await page.locator('#curriculumStatus').textContent(),'Voorlopige thema-indeling');
      if(book==='meesterschap') assert.match(await page.locator('#curriculumNote').textContent(),/niet geactiveerd/);
    }
    await page.locator('#curriculumThemes li').first().click();
    assert.equal(await page.evaluate(()=>JSON.stringify({app:APP,storage:{...localStorage},screen:document.querySelector('.screen.active').id})),before);
    assert.match(await page.locator('#curriculumThemes li').first().textContent(),/Kennismaken, persoonsgegevens/);
    await page.evaluate(()=>{curriculumBook.value='unknown';renderCurriculumBook();});
    assert.equal(await page.locator('#curriculumStatus').textContent(),'Nog niet beschikbaar');
    assert.equal(await page.locator('#curriculumThemes li').count(),0);
    await page.locator('#curriculumBook').selectOption('zelfverzekerd');
    await page.locator('.curriculum-close').click();await closed();
    await open();await page.locator('.hero h1').click();await closed();
    await open();await page.locator('#curriculumContext').click();await closed();
    // Keyboard use over a running game must never trigger the global Space action.
    await page.locator('[data-category="boards"]').click();
    await page.locator('[data-board="rotterdam"]').first().click();
    const game = await page.evaluate(()=>JSON.stringify({app:APP,undo:undoHistory}));
    await page.locator('#curriculumContext').focus();await page.keyboard.press('Space');
    await page.waitForFunction(()=>document.querySelector('#curriculumPanel').matches(':popover-open'));
    await page.locator('.curriculum-close').focus();await page.keyboard.press('Space');await closed();
    assert.equal(await page.evaluate(()=>JSON.stringify({app:APP,undo:undoHistory})),game);
    await page.locator('#curriculumContext').focus();await page.keyboard.press('Enter');
    await page.waitForFunction(()=>document.querySelector('#curriculumPanel').matches(':popover-open'));
    await page.locator('#curriculumBook').selectOption('alfa-b');
    assert.match(await page.locator('#curriculumThemes li').first().textContent(),/Kennismaken, persoonsgegevens/);
    await page.keyboard.press('Escape');await closed();
    await page.locator('[data-main="play"]').click();
    await page.locator('#levelSelect').selectOption('B1');
    await page.locator('[data-category="cards"]').click();
    await page.locator('#levelSelect').selectOption('R4');
    await open();await page.locator('#curriculumBook').selectOption('startpunt');
    await page.keyboard.press('Escape');await closed();
    assert.equal(await page.locator('#levelSelect').inputValue(),'R4');
    await page.locator('[data-main="play"]').click();
    assert.equal(await page.locator('#levelSelect').inputValue(),'B1');
    await page.locator('#settingsBtn').click();
    assert.ok(await page.locator('#settingsOverlay').evaluate(el=>el.classList.contains('open')));
    // Native touch controls, short landscape window and offline file opening.
    const touch = await browser.newPage({viewport:{width:390,height:500},hasTouch:true});
    await touch.goto(url);await touch.locator('#curriculumContext').tap();
    await touch.locator('#curriculumBook').selectOption('alfa-c');
    await touch.locator('#curriculumThemes li').last().scrollIntoViewIfNeeded();
    assert.ok(await touch.locator('#curriculumThemes li').last().isVisible());
    await touch.locator('.curriculum-close').scrollIntoViewIfNeeded();await touch.locator('.curriculum-close').tap();
    assert.equal(await touch.locator('#curriculumPanel').isVisible(),false);await touch.close();
    await page.goto(require('node:url').pathToFileURL(require('node:path').join(__dirname,'index.html')).href);
    await open();assert.equal(await page.locator('#curriculumBook option').count(),10);
    assert.deepEqual(errors,[]);
    console.log('PASS: all books, provisional Alfa, missing list, no game/storage changes, keyboard/Space, close/outside/Escape, existing route filters, touch, offline, no runtime errors.');
  } finally {await browser.close();}
})().catch(error=>{console.error(error);process.exitCode=1;});
