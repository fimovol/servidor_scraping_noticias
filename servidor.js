require('dotenv').config()
var { buildSchema } = require('graphql');
var express = require('express');
var { graphqlHTTP } = require('express-graphql');
const cors = require('cors')
const puppeteer=require('puppeteer');

var schema = buildSchema(`
  type Anime{
    titulo: String
    imagen: String
    ruta: String
  }
  type Noticia{
    nombre: String
    hora: String
    img: String
    href:String
  }
  type Mutation {
    updateMessage(numDice: Int!): Int
  }
  type Query {
    rollDice(numDice: Int!, numSides: Int): [Int]
    scraping: [Anime]
    noticias(limit: Int): [Noticia]
    peru21noticias(limit: Int): [Noticia]
    larepublica(limit: Int): [Noticia]
  }
`);

var root = {
    updateMessage: ({numDice}) => {
        return numDice;
    },
    rollDice: ({numDice, numSides}) => {
        var output = [];
        for (var i = 0; i < numDice; i++) {
          output.push(1 + Math.floor(Math.random() * (numSides || 6)));
        }
        return output;
    },
    scraping: async () => {
        const goto = 'https://jkanime.net/'
        const browser = await puppeteer.launch(/*{headless:false}*/);
        const page = await browser.newPage();
        await page.goto(goto);
        await page.waitForTimeout(2000)
        const enlaces = await page.evaluate(() => {
          const elements = document.querySelectorAll('[class="listadoanime-home"] [class="maximoaltura"] a [class="anime__sidebar__comment__item__text"] h5');
          const elements2 = document.querySelectorAll('[class="listadoanime-home"] [class="maximoaltura"] a [class="anime__sidebar__comment__item__pic listadohome"] img');
          const elements3 = document.querySelectorAll('[class="listadoanime-home"] [class="maximoaltura"] a');

          const links = [];
  
          elements.forEach( (elemento,index) => {
              const objeto = {
                  titulo: elemento.textContent,
                  imagen: elements2[index].getAttribute('src'),
                  ruta: elements3[index].getAttribute('href')
              }
              links.push(objeto)
          })
            return links;
        })

        await browser.close();
        return enlaces
    },
    
    noticias: async({limit})=>{
      const goto = 'https://elcomercio.pe/ultimas-noticias/';
      const browser = await puppeteer.launch(/*{headless:false}*/);
      const page = await browser.newPage();
      await page.goto(goto);
      await page.waitForTimeout(2000)
      const enlaces = await page.evaluate(() => {
        const elements = document.querySelectorAll('[role="main"] div [itemprop="name"] a');
        const elements2 = document.querySelectorAll('[role="main"] div [class="story-item__top flex items-center md:flex-col md:items-start"] p');
        const elements3 = document.querySelectorAll('[role="main"] div div div figure a picture img');
        const elements4 = document.querySelectorAll('[role="main"] div div div div div h2 a');

        const links = []

        elements.forEach( (e,p) => {
            const objeto = {
                nombre: e.textContent,
                hora: elements2[p].textContent,
                img: elements3[p].getAttribute('src'),
                href: 'https://elcomercio.pe'+elements4[p].getAttribute('href')
            }
            links.push(objeto)
        })
        return links;
    })
    await browser.close();
    return enlaces.slice(0,limit)
  },
  peru21noticias: async({limit})=>{
    const goto = 'https://peru21.pe/archivo/';
    const browser = await puppeteer.launch(/*{headless:false}*/);
    const page = await browser.newPage();
    await page.goto(goto);
    await page.waitForTimeout(2000)
    const enlaces = await page.evaluate(() => {
        const elements = document.querySelectorAll('[role="main"] div div div [itemprop="name"] [itemprop="url"]');
        const elements2 = document.querySelectorAll('[role="main"] div div figure [itemprop="url"] picture img');
        const elements3 = document.querySelectorAll('[role="main"] div div div [class="story-item__date font-thin ml-5 text-xs text-gray-300 md:mt-5 md:ml-0"]');

        const links = []

        elements.forEach( (e,p) => {
            const objeto = {
                nombre: e.textContent,
                hora: elements3[p].textContent,
                img: elements2[p].getAttribute('src'),
                href: 'https://peru21.pe'+e.getAttribute('href')
            }
            links.push(objeto)
        })
        return links;
    })
    await browser.close();
    return enlaces.slice(0,limit)
  },
  larepublica: async({limit}) => {
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
    await browser.close();
    return enlaces.slice(0,limit)
  }
}

var app = express();
app.use(cors())
app.use('/graphql', graphqlHTTP({
    schema: schema,
    rootValue: root,
    graphiql: true,
}));
app.listen(process.env.PORT_GQL);
console.log(`Running a GraphQL API server at http://localhost:${process.env.PORT_GQL}/graphql`);