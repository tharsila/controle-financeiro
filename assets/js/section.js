export default function section() {
  /* recebe os produtos adicionados atraves do push */
  let elements = [];
  /* captura os elementos do html */
  const inputPrice = document.getElementById('price');
  const clean = document.querySelector('.clean');
  const form = document.getElementById('form');

  /* recebe os dados que o usuário cadastroue armazena no localStorage */
  const elementsRaw = localStorage.getItem('elements');
  if (elementsRaw !== null) {
    elements = JSON.parse(elementsRaw);
  } else {
    elements = [];
  }

  /* formata o valor para Real "R$" */
  function formatterCurrency(value) {
    const valueFormat = value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
    return valueFormat;
  }

  /* desenha a tabela com os produtos atualizados */
  function drawTable() {
    const currentLines = [...document.querySelectorAll('.dynamic-content')];
    const result = document.getElementById('result');

    currentLines.forEach((element) => element.remove());

    let total = 0;
    /* percorre pelos elementos cadastrados e mostra na tela */
    elements.forEach((element) => {
      result.innerHTML += `
        <tr class="flex dynamic-content">
          <td class="transaction">${element.choose === '-' ? '-' : '+'}</td>
          <td class="product ">${element.name}</td>
          <td class="price width">R$ ${formatterCurrency(element.price)}</td> 
        </tr>
      `;

      /* realiza calculo para saber se existe prejuízo ou lucro */
      const { price } = element;
      if (element.choose === '-') {
        total -= Number(price);
      } else if (element.choose === '+') {
        total += Number(price);
      }
    });

    /* formata o valor do produto para o real(moeda brasileira) */
    const priceBRL = total.toLocaleString('pt-br', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 2,
    });

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
       <td class="profit width">${total > 0 ? '[LUCRO]' : total < 0 ? '[PREJUÍZO]' : ''}</td> 
      <td></td>
     </tr>
    `;

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
      `;
    }
  }

  drawTable();

  /* Coloca o valor do produto digitado no formato BRL */
  function maskedValue(event) {
    const regexp = /[^0-9]/;
    if (regexp.test(event.key)) {
      event.preventDefault();
      return;
    }

    if (!event.target.value) return;
    let priceFormat = 0;
    priceFormat = event.target.value.toString();
    priceFormat = priceFormat.replace(/[\D]+/g, '');
    priceFormat = priceFormat.replace(/([0-9]{1})$/g, ',$1');

    if (priceFormat.length >= 6) {
      while (/([0-9]{4})[,|.]/g.test(priceFormat)) {
        priceFormat = priceFormat.replace(/([0-9]{1})$/g, ',$1');
        priceFormat = priceFormat.replace(/([0-9]{3})[,|.]/g, '.$1');
      }
    }
    event.target.value = priceFormat;
  }
  inputPrice.addEventListener('keypress', maskedValue);

  /* limpa o conteudo da tabela */
  function cleanTable() {
    document.querySelector('tbody').innerHTML = '';
    document.querySelector('tfoot').innerHTML = '';
  }

  /* limpa o conteudo da tabela ativado o evento de click */
  function cleanData() {
    if (confirm('Você tem certeza que deseja limpar os dados da tabela?')) {
      localStorage.clear();
      elements = [];
      cleanTable();
      drawTable();
    }
  }

  /* ativa a função submit e 'empurra' o objeto para o array elements */
  function handleSubmit(event) {
    event.preventDefault();
    elements.push(
      {
        choose: event.target.elements.choose.value,
        name: event.target.elements.name.value,
        price: event.target.elements.price.value.replaceAll('.', '').replaceAll(',', '.'),
      },
    );

    /* apaga dados preenchidos quando o formulario for submetido */
    document.getElementById('choose').value = '-';
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
    /* persiste os dados que o usuário cadastrou */

    localStorage.setItem('elements', JSON.stringify(elements));
    if (elements !== null) {
      cleanTable();
      drawTable();
    }
  }
  /* aciona o evento de submit e chama a função */
  form.addEventListener('submit', handleSubmit);
  clean.addEventListener('click', cleanData);
}
