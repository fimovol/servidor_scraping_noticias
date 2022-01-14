const puppeteer=require('puppeteer');
(async()=>{
    const goto = 'https://larepublica.pe/ultimas-noticias/';
    const browser = await puppeteer.launch(/*{headless:false}*/);
    const page = await browser.newPage();
    await page.goto(goto);
    for(let i = 0; i < 3; i++){
        await page.evaluate(() => {
            window.scrollBy(0, window.innerHeight);
        })
        await page.waitForTimeout(500)
    } 
    const enlaces = await page.evaluate(() => {
        const elements = document.querySelectorAll('ul li:nth-child(2) [class="PostSectionListH3"] [class="PostSectionListA"] ')
        const elements2 = document.querySelectorAll('ul li:nth-child(1) [class="PostSectionListSPAN"] ')
        const elements3 = document.querySelectorAll('div div:nth-child(1) a span img')

        const links = []

        elements3.forEach( (e,p) => {
            const objeto = {
                nombre: elements[p].textContent,
                hora: elements2[p].textContent,
                img: e.getAttribute('src'),
                href: 'https://larepublica.pe'+elements[p].getAttribute('href')
            }
            links.push(objeto)
        })
        return links;
    })
    console.log(enlaces,enlaces.length)
    
    await browser.close();
})();