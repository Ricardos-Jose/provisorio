const container = document.getElementsByClassName('carrinho-container')[0];

let carrinho = JSON.parse(localStorage.getItem('carrinho')) || [];

const preco_entrega =12.99;

function Adicionar_ao_carrinho(id,nome,preco){
    let item = carrinho.find(item=> item.id === id)
    
    if(item){
        item.quantidade+=1;
    }else{
        carrinho.push({'id':id, 'nome':nome, 'preco':preco, 'quantidade':1});
    }

  if (item) {
    item.quantidade += 1;
  } else {
    carrinho.push({ id: id, nome: nome, preco: preco, quantidade: 1 });
  }

  atualizar_tela();
}

function alterar_quantidade(id, quantidade) {
  let item = carrinho.find((item) => item.id === id);

  if (item) {
    item.quantidade += quantidade;
  } else {
    console.log('Erro no alterar quantidade de id', id);
  }

  if (item.quantidade <= 0) {
    carrinho = carrinho.filter((item) => item.id !== id);
  }

  atualizar_tela();
}

function remover_item(id) {
  carrinho = carrinho.filter((item) => item.id !== id);

  atualizar_tela();
}

function atualizar_tela() {
  localStorage.setItem('carrinho', JSON.stringify(carrinho));

    let subtotal = 0;


    container.innerHTML = "";
    if (carrinho.length === 0) {
        container.innerHTML = '<h1>O carrinho está vazio.</h1>';
    }else{
        carrinho.forEach(item => {

            subtotal += item.preco * item.quantidade;

            container.innerHTML += 
            `
            <div class="carrinho-item">
                <div class="left-carrinho-item">

                    <div>
                    <h2>${item.nome}</h2>
                    <p>R$ ${item.preco.toFixed(2)}</p>
                    </div>

                    <div class="quantidade">
                    <button class="alterar" onclick="alterar_quantidade(${item.id},-1)"><img src="images/menos.svg" alt=""></button>
                    <p>${item.quantidade}</p>
                    <button class="alterar" onclick="alterar_quantidade(${item.id},1)"><img src="images/mais.png" alt=""></button>
                    </div>

                </div>

                <button class="lixo_button" onclick="remover_item(${item.id})">

                    <img class="lixo" src="images/lixo_preto.svg" alt="">
                    <img class="lixo_hover" src="images/lixo_vermelho.svg" alt="">
                
                </button>
            </div>
            `
        });

        container.innerHTML += 
        `
            <div class="checkout">

                <div class="linha"></div>

                <div class="preco-checkout"><p>Subtotal:</p> <p>R$${subtotal.toFixed(2)}</p></div>
                <div class="preco-checkout"><p>Entrega:</p>  <p>R$${preco_entrega}</p></div>
                
                <div class="preco-checkout preco-total-checkout"><p>Total:</p> <p>R$${(subtotal+preco_entrega).toFixed(2)}</p> </div>



                <a href="checkout.html">
                <button id="finalizar">
                    <p>Finalizar compra</p>
                </button>
                </a>
            </div>
        `


    }

}

atualizar_tela();
