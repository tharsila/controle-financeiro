export default function section () {
  /* recebe os produtos adicionados atraves do push */
  let elements = [];
  
  /* recebe os dados que o usuário cadastrou */
  const elementsRaw = localStorage.getItem('elements');
    if (elementsRaw !== null) {
      elements = JSON.parse(elementsRaw);
    } else {
      elements = [];
    }
    
  drawTable();
  
  /* Coloca o valor do produto digitado no formato BRL */
  const regexp = /[^0-9]/;
  let inputPrice = document.getElementById('price');
  inputPrice.addEventListener('keypress', maskedValue);
  
  function maskedValue(event) {
    if (regexp.test(event.key)) {
      event.preventDefault();
    }
  
    if(!event.target.value) return;
    let priceFormat = 0;
    priceFormat = event.target.value.toString();
    priceFormat = priceFormat.replace(/[\D]+/g, '');
    priceFormat = priceFormat.replace(/([0-9]{1})$/g, ",$1");
  
    if(priceFormat.length >= 6){
      while(/([0-9]{4})[,|\.]/g.test(priceFormat)){
        priceFormat = priceFormat.replace(/([0-9]{1})$/g, ",$1");
        priceFormat = priceFormat.replace(/([0-9]{3})[,|\.]/g, ".$1");
      }
    }
  
    event.target.value = priceFormat;
  }
  
  /* desenha a tabela com os produtos atualizados */
  function drawTable () {
    const currentLines = [...document.querySelectorAll('.dynamic-content')];
    const result = document.getElementById('result');
  
    currentLines.forEach((element) => {
      element.remove();
    })
  
    /* percorre pelos elementos cadastrados e mostra na tela */
    let total = 0;
    elements.forEach((element) => { 
      result.innerHTML += `
        <tr class="flex dynamic-content">
          <td class="transaction">${element.choose === '-' ? '-' : '+'}</td>
          <td class="product ">${element.name}</td>
          <td class="price width">R$ ${element.price}</td> 
        </tr>
      `

      /* realiza calculo para saber se existe prejuízo ou lucro */
      let price = parseFloat(element.price.replace(/[^0-9]/g, "").replace(",", "."))
   
      if (element.choose === '-') {
        total -= price / 100
        console.log(total)
      } else if (element.choose === '+') {
        total += price / 100
        console.log(total)
      }
    })
    
    /* formata o valor do produto para o real(moeda brasileira) */
    const priceBRL = total.toLocaleString('pt-BR',{style: 'currency', currency: 'BRL'});
   
    /* adiciona linha da tabela mostrando o valor total dos produtos */
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
       <td class="profit width">${total > 0 ? '[LUCRO]' : total < 0 ? '[PREJUÍZO]' : ""}</td> 
      <td></td>
     </tr>
    `
    /* verifica se existe produtos cadastrados */
    if (localStorage.length === 0) {
      result.innerHTML = `
       <tr class="flex dynamic-content">
          <td class="transaction"></td>
          <td class="product" style="text-align:center; width: 100%">Nenhuma Transação cadastrada</td>
        </tr>
        <tr class="flex">
          <td class="line-one width"></td>
          <td class="line-two width" colspan="2"></td>
        </tr>
      `
    }
  }
  
  /* limpa o conteudo da tabela */
  function cleanTable () {
    document.querySelector('tbody').innerHTML = "";
    document.querySelector('tfoot').innerHTML = "";
  }
  
  const clean = document.querySelector('.clean');
  clean.addEventListener("click", cleanData);
  
  /* limpa o conteudo da tabela ativado o evento de click */
  function cleanData () {
    if (confirm('Você tem certeza que deseja limpar os dados da tabela?')) {
      localStorage.clear();
      elements = [];
      cleanTable();
      drawTable();
    }
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
        choose: event.target.elements['choose'].value,
        name: event.target.elements['name'].value,
        price: event.target.elements['price'].value,
      },
    )
  
    /* apaga dados preenchidos quando o formulario for submetido */
    document.getElementById('choose').value = '-';
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
  
   
    /* persiste os dados que o usuário cadastrou */
    localStorage.setItem('elements', JSON.stringify(elements));
    if (elements !== null) {
      cleanTable()
      drawTable()
    }
  }
}

