export default function menuMobile () {
  const buttonMobile = document.getElementById('menu-mobile');
  const menu = document.querySelector('.menu');
  const links = document.querySelectorAll('.menu a');
  
  /* Evento que será realizado quando o icone mobile for ativado */
  buttonMobile.addEventListener('click', handleMenu);
  
  /* Torna itens do menu animados */
  function animationLinks () {
    links.forEach((link, index) => {
      link.style.animation 
      ? (link.style.animation = '') 
      : (link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`)
    })
  }
  
  /* Exibe menu mobile e seus itens */
  function handleMenu () {
    buttonMobile.classList.toggle('fa-times');
    menu.classList.toggle('active');
    animationLinks();
  }
}

