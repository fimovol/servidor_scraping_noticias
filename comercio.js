const puppeteer=require('puppeteer');
(async()=>{
    const goto = 'https://elcomercio.pe/ultimas-noticias/';
    const browser = await puppeteer.launch(/*{headless:false}*/);
    const page = await browser.newPage();
    await page.goto(goto);
    await page.waitForTimeout(2000)
    const enlaces = await page.evaluate(() => {
        const elements = document.querySelectorAll('[role="main"] div [itemprop="name"] a');
        const elements2 = document.querySelectorAll('[role="main"] div [class="story-item__top flex items-center md:flex-col md:items-start"] p');
        const elements3 = document.querySelectorAll('[role="main"] div div div figure a picture img');

        const links = []

        elements.forEach( (e,p) => {
            const objeto = {
                nombre: e.textContent,
                hora: elements2[p].textContent,
                img: elements3[p].getAttribute('src')
            }
            links.push(objeto)
        })
        return links;
    })
    console.log(enlaces)
    
    await browser.close();
})();