import { Address, CepAPI } from "./cep.model.js";

class State {
  constructor() {
    /** @type {boolean} */
    this.carregando = false;
    /** @type {Address} */
    this.address = null;
  }

  startLoading() {
    this.carregando = true;
  }

  /**
   * @param {Address} address
   */
  applyAddress(address) {
    this.carregando = false;
    this.address = address;
  }
}

let cep;
let endereco;
let numero;
let complemento;
let cidade;
let estado;

const cepAPI = new CepAPI();
const state = new State();

/**
 * @param {String} cepStr
 * @param {function(Address): void} callback
 */
async function onFillCep(cepStr) {
  try {
    let address;
    state.startLoading();
    render(state);

    address = await cepAPI.fetchAddress(cepStr);

    state.applyAddress(address);
    render(state);
  } catch (e) {
    console.error(`[View] Ocorreu um erro ao enviar o CEP ${cepStr}`);
    console.error(e);
  }
}

function onLoad() {
  // Fields declaration
  cep = document.getElementById("cep");
  endereco = document.getElementById("endereco");
  numero = document.getElementById("numero");
  cidade = document.getElementById("cidade");
  estado = document.getElementById("estado");
  complemento = document.getElementById("complemento");

  email = document.getElementById("email");
  telefone = document.getElementById("telefone");

  // Máscara do CEP
  const cepMask = IMask(cep, {
    mask: "00000-000",
  });
  // Máscara do Email
  IMask(email, {
    mask: /^\S+@?\S*$/,
  });
  // Máscara do telefone
  IMask(telefone, {
    mask: "(00) 00000-0000",
  });

  cepMask.on("complete", async () => {
    const cepDigitado = cepMask.unmaskedValue;
    await onFillCep(cepDigitado);
  });

  render(state);
}

/**
 *
 * @param {State} state
 */
function render(state) {
  endereco.disabled = state.carregando;
  cidade.disabled = state.carregando;
  estado.disabled = state.carregando;

  if (state.address != null) {
    endereco.value = state.address.street ?? endereco.value;
    numero.value = state.address.numero ?? numero.value;
    cidade.value = state.address.city ?? cidade.value;
    estado.value = state.address.state ?? estado.value;
    complemento.value = state.address.complement ?? complemento.value;
  }
}

document.addEventListener("DOMContentLoaded", onLoad);
