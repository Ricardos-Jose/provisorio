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
    carrinho.push({ id, nome, preco, quantidade: 1 });
  }

  localStorage.setItem("carrinho", JSON.stringify(carrinho));

  mostrarNotificacao("Produto adicionado ao carrinho.");
  atualizar_icon_notification();
}

function mostrarNotificacao(mensagem) {
  let notificacao = document.getElementById("notificacao");

  notificacao.textContent = mensagem;
  notificacao.className = "show";

  setTimeout(() => {
    notificacao.className = notificacao.className.replace("show", "");
  }, 3000);
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

function verificarMensagemURL() {
  const params = new URLSearchParams(window.location.search);

  if (params.get("message") === "1") {
    mostrarNotificacao("Compra efetuada com êxito.");

    // Remove o parâmetro da URL sem recarregar
    params.delete("message");

    const novaQuery = params.toString();
    const novaURL =
      window.location.pathname +
      (novaQuery ? `?${novaQuery}` : "") +
      window.location.hash;

    history.replaceState({}, "", novaURL);
  }
}

atualizar_icon_notification();
verificarMensagemURL();
