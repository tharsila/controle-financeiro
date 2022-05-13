export default function section () {

}

/* recebe os produtos adicionados atraves do push */
let elements = [];
/* const elementsRaw = localStorage.getItem('elements');
  if (elementsRaw !== null) {
    elements = JSON.parse(elementsRaw);
  } else {
    elements = [];
  } */

/* Desenha a tabela */
function drawTable () {
  const currentLines = [...document.querySelectorAll('.dynamic-content')];
  const result = document.getElementById('result');

  currentLines.forEach((element) => {
    element.remove();
  })

  /* faz um loop pelos elementos cadastrados e mostra na tela */
  let total = 0;
  elements.forEach((element) => { 
    result.innerHTML += `
      <tr class="flex dynamic-content">
        <td class="transaction">${element.choose === '-' ? "-" : "+"}</td>
        <td class="product ">${element.name}</td>
        <td class="price width">R$ ${element.price}</td> 
      </tr>
    `
    /* realiza calculo para saber se existe prejuízo ou lucro */
    let price = parseFloat(element.price)
    console.log(price)
    if (element.choose === '-') {
      total -= price
    } else if (element.choose === '+') {
      total += price 
    }
  })
  
  /* formata o valor do produto para o real(moeda brasileira) */
  const priceBRL = total.toLocaleString('pt-br',{style: 'currency', currency: 'BRL'});

  /* adicionar linha da tabela mostrando o valor total dos produtos */
  const foot = document.getElementById('total');
  foot.innerHTML = `
    <tr class="flex">
      <td class="left">Total</td>
      <td class="right">
        ${priceBRL}
      </td>
      <td></td>
    </tr>
  <tr class="flex">
    <td></td>
    <td></td>
    <td class="profit width">${total > 0 ? '[LUCRO]' : '[PREJUÍZO]'}</td>
    <td></td>
  </tr>
  `
}

/* captura form no html */
const form = document.getElementById('form');
/* aciona o evento de submit e chama a função */
form.addEventListener('submit', handleSubmit);

/* ativa a função submit e 'empurra' o objeto para o array elements*/
function handleSubmit(event) {
  event.preventDefault();
  elements.push(
    {
      "choose": event.target.elements["choose"].value,
      "name": event.target.elements["name"].value,
      "price": +event.target.elements["price"].value,
    },
  )
  /* desenha a tabela com os produtos atualizados */
  drawTable()
}
