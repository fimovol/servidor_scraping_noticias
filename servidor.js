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
    animeflash: [Anime]
    noticias: [Noticia]
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
    animeflash: async()=>{
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
      return enlaces
  },
  noticias: async()=>{
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
    return enlaces
  },
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