import { CarrinhoRepository } from "./carrinho.model.js";
import { CheckoutFormData } from "./checkout-form.model.js";
import {
  AddressMailInfo,
  MailInfo,
  MockMailService,
  MailService,
  ProductMailInfo,
} from "./email.model.js";

const USE_FAKE_MAILER = true;

class State {
  constructor() {
    /**@type {Boolean} */
    this.loading = false;
    /**@type {Boolean} */
    this.redirect = false;
  }
}

let form;
let loadingOverlay;

let mailService;
if (USE_FAKE_MAILER) {
  mailService = new MockMailService();
} else {
  mailService = new MailService();
}
const carrinhoRepository = new CarrinhoRepository();
const state = new State();

/**
 * @param {State} state
 */
function render(state) {
  if (state.redirect) {
    window.location.href = "index.html?message=1";
    return;
  }

  loadingOverlay.style.display = state.loading ? "grid" : "none";
}

/**
 *
 * @param {String} method
 */
function formatPaymentMethod(method) {
  const lower = method.toLowerCase();
  if (lower === "cartao") {
    return "Cartão de Crédito";
  } else if (lower === "boleto") {
    return "Boleto Bancário";
  } else {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

/**
 * @param {CheckoutFormData} checkoutForm
 */
async function handleSubmit(checkoutForm) {
  // Collect cart data
  const produtos = carrinhoRepository
    .findAll()
    .map(
      (p) => new ProductMailInfo(p.nome, p.quantidade, p.preco * p.quantidade),
    );

  // Calculate total
  const productsTotal = carrinhoRepository.getValorTotal();
  const total = productsTotal + checkoutForm.deliveryFee;

  // Construct e-mail object
  const mailInfo = new MailInfo({
    address: new AddressMailInfo({
      cep: checkoutForm.cep,
      state: checkoutForm.state,
      city: checkoutForm.city,
      street: checkoutForm.address,
      number: checkoutForm.number,
      complement: checkoutForm.complement,
    }),

    email: checkoutForm.email,
    firstName: checkoutForm.firstName,
    paymentMethod: formatPaymentMethod(checkoutForm.paymentMethod),
    phone: checkoutForm.phone,

    total: total.toFixed(2),
    productsTotal: productsTotal.toFixed(2),
    deliveryFee: checkoutForm.deliveryFee.toFixed(2),
    products: produtos,

    observations: checkoutForm.observations,
  });

  try {
    state.loading = true;
    render(state);

    // Send email with data
    await mailService.send(mailInfo);

    carrinhoRepository.clear();
    state.redirect = true;
  } finally {
    state.loading = false;
    render(state);
  }
}

function onLoad() {
  // init bindings
  form = document.querySelector(".container-formulario");
  loadingOverlay = document.querySelector(".loading-overlay");

  form.addEventListener("submit", (e) => {
    // Intelissense helper
    if (!(e instanceof SubmitEvent)) {
      return;
    }

    if (e.currentTarget.checkValidity()) {
      e.preventDefault();

      const formData = new FormData(e.currentTarget);
      const checkoutForm = CheckoutFormData.fromFormData(formData);

      handleSubmit(checkoutForm);
    }
  });

  render(state);
}

document.addEventListener("DOMContentLoaded", onLoad);
