const puppeteer=require('puppeteer');
const PALABRA_CLAVE = 'peru';
(async()=>{
    const goto = 'https://www.google.com/';
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto(goto);
    await page.type('[jscontroller="vZr2rb"] [class="gLFyf gsfi"]',PALABRA_CLAVE);
    await page.click('[class="FPdoLc lJ9FBc"] [class="gNO89b"]');
    await page.waitForTimeout(2000)
    await page.click('[class="hdtb-mitem"] [data-hveid="CAIQBQ"]')

    await page.waitForTimeout(2000)
    const enlaces = await page.evaluate(() => {
        const elements = document.querySelectorAll('[class="fhQnRd"] div div [class="mCBkyc y355M nDgy9d"]');

        const links = []

        elements.forEach( (e,p) => {
            const objeto = {
                nombre: e.textContent
            }
            links.push(objeto)
        })
        return links;
    })
    console.log(enlaces)
    
    await browser.close();
})();