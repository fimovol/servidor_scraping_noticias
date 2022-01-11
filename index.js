const puppeteer=require('puppeteer');
const PALABRA_CLAVE = 'ssd mvme';
(async()=>{
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto('https://www.amazon.com/');
    await page.type('#twotabsearchtextbox',PALABRA_CLAVE);
    await page.click('#nav-search-submit-button');
    await page.waitForTimeout(2000)
    const enlaces = await page.evaluate(() => {
        const elements = document.querySelectorAll('[class="s-result-item s-asin sg-col-0-of-12 sg-col-16-of-20 sg-col s-widget-spacing-small sg-col-12-of-16"] span a');

        const links = [];

        for (let element of elements){
            links.push(element.href)
        }
        return links;
    })

    console.log(enlaces)
    console.log(enlaces.length)
    await browser.close();
})();

