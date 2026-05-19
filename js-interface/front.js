const menu = document.querySelector('.menu-mobile');
const menuHidden = document.querySelector('.nav-list');

let outsideListenerActive = false;

function handleOutsideClick(event) {
  if (!menuHidden.contains(event.target) && !menu.contains(event.target)) {
    menuHidden.classList.remove('js');
    document.documentElement.removeEventListener('click', handleOutsideClick);
    outsideListenerActive = false;
  }
}

function abrirMenu() {
  menuHidden.classList.toggle('js');

  if (menuHidden.classList.contains('js') && !outsideListenerActive) {
    setTimeout(() => {
      document.documentElement.addEventListener('click', handleOutsideClick);
      outsideListenerActive = true;
    });
  }
}

menu.addEventListener('click', abrirMenu);
