const menu = document.querySelector(".menu-mobile");
const menuHidden = document.querySelector(".nav-list");

let carrinho = JSON.parse(localStorage.getItem("carrinho")) || [];

let outsideListenerActive = false;

function handleOutsideClick(event) {
  if (!menuHidden.contains(event.target) && !menu.contains(event.target)) {
    menuHidden.classList.remove("js");
    document.documentElement.removeEventListener("click", handleOutsideClick);
    outsideListenerActive = false;
  }
}

function abrirMenu() {
  menuHidden.classList.toggle("js");

  if (menuHidden.classList.contains("js") && !outsideListenerActive) {
    setTimeout(() => {
      document.documentElement.addEventListener("click", handleOutsideClick);
      outsideListenerActive = true;
    });
  }
}

menu.addEventListener("click", abrirMenu);

function Adicionar_ao_carrinho(id, nome, preco) {
  let item = carrinho.find((item) => item.id === id);

  if (item) {
    item.quantidade += 1;
  } else {
    carrinho.push({ id: id, nome: nome, preco: preco, quantidade: 1 });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  Notificar_adicao_carrinho();
}
function Notificar_adicao_carrinho() {
  console.log("notificando ...");

  let notificacao = document.getElementById("notificacao");
  notificacao.className = "show";
  setTimeout(function(){ notificacao.className = notificacao.className.replace("show", ""); }, 3000);

  atualizar_icon_notification();
}

function atualizar_icon_notification() {
  let icon_notification = document.getElementById("icon-notification");

  if (carrinho.length > 0) {
    icon_notification.innerText = carrinho.length;
    icon_notification.classList.remove("hidden");
  } else {
    icon_notification.classList.add("hidden");
  }
}
atualizar_icon_notification();
