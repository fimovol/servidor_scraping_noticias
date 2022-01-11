const puppeteer=require('puppeteer');

//animeflash
(async()=>{
    const goto = 'https://animeflash.xyz/'
    const browser = await puppeteer.launch(/*{headless:false}*/);
    const page = await browser.newPage();
    await page.goto(goto);
    await page.waitForTimeout(2000)
    const enlaces = await page.evaluate(() => {
        const elements = document.querySelectorAll('[class="items"] a');
        const elements2 = document.querySelectorAll('[class="items"] img');
        const links = [];

        elements.forEach( (elemento,index) => {
            const objeto = {
                titulo: elemento.getAttribute('title'),
                imagen: elements2[index].getAttribute('src'),
                ruta: 'https://animeflash.xyz'+elemento.getAttribute('href')
            }
            links.push(objeto)
        })
        return links;
    })

    await browser.close();
    console.log(goto,enlaces,enlaces.length)
})();

//jkanime
(async()=>{
    const goto = 'https://jkanime.net/'
    const browser = await puppeteer.launch(/*{headless:false}*/);
    const page = await browser.newPage();
    await page.goto(goto);
    await page.waitForTimeout(2000)
    const enlaces = await page.evaluate(() => {
        const elements = document.querySelectorAll('[class="listadoanime-home"] [class="maximoaltura"] a [class="anime__sidebar__comment__item__text"] h5');
        const elements2 = document.querySelectorAll('[class="listadoanime-home"] [class="maximoaltura"] a [class="anime__sidebar__comment__item__pic listadohome"] img');

        const links = [];

        elements.forEach( (elemento,index) => {
            const objeto = {
                titulo: elemento.textContent,
                imegen: elements2[index].getAttribute('src')
            }
            links.push(objeto)
        })
        return links;
    })

    console.log(goto,enlaces,enlaces.length)
    await browser.close();
})();

//animeflv
(async()=>{
    const goto = 'https://www3.animeflv.net'
    const browser = await puppeteer.launch({headless:false});
    const page = await browser.newPage();
    await page.goto(goto);
    await page.waitForTimeout(2000)
    const enlaces = await page.evaluate(() => {
        const elements = document.querySelectorAll('[class="ListEpisodios AX Rows A06 C04 D03"] li strong');
        const elements2 = document.querySelectorAll('[class="ListEpisodios AX Rows A06 C04 D03"] li [class="Image"] img');
        const elements3 = document.querySelectorAll('[class="ListEpisodios AX Rows A06 C04 D03"] li a');
        const links = [];

        elements.forEach( (elemento,index) => {
            const objeto = {
                titulo: elemento.textContent,
                imegen: 'https://www3.animeflv.net'+elements2[index].getAttribute('src'),
                ruta: 'https://www3.animeflv.net'+elements3[index].getAttribute('href'),
            }
            links.push(objeto)
        })
        return links;
    })

    console.log(goto,enlaces,enlaces.length)
    await browser.close();
})();