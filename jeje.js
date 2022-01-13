const elemento =document.querySelectorAll("div a p")
const elemento2 =document.querySelectorAll("div a h1")

const elemento3 =document.querySelectorAll("div a")


const bb= []
//console.log(elemento)
//console.log(bb[0].titulo)
elemento.forEach( (elemento,index) => {
 // console.log(e.textContent)
  const objeto ={
    titulo: elemento.textContent,
    h1: elemento2[index] == undefined ? "nada" : elemento2[index].textContent
    
  };
 // console.log(elemento2[p])
  bb.push(objeto)
})
console.log(bb.slice(0,2))


