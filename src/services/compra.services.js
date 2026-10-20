import {Compra} from '../models/compra.js';

// Recupera as compras que já foram salvas.
const dados = JSON.parse(
    localStorage.getItem('compras_cartao')
) || [];

// Transforma os dados recuperados em objetos Compra.
export let compras = dados.map(compra => {
    const cartaoCompra = compra.cartao ?? compra['cartão'];

    const novaCompra = new Compra(
        compra.descricao,
        compra.valor,
        compra.data,
        cartaoCompra,
        compra.quantidade_de_parcelas ?? compra.quantidade_parcelas
    );

    // Preserva o ID da compra utilizado pelo sistema de parcelas.
    novaCompra.id = compra.id ?? novaCompra.id;

    return novaCompra;
});


// Salva as compras no navegador.
export function salvar_compras() {
    localStorage.setItem('compras_cartao', JSON.stringify(compras));
}

// Registra uma nova compra
export function adicionar_compra(
    descricao,
    valor,
    data,
    cartao,
    quantidade_de_parcelas
){
    if (!descricao.trim()) {
        throw new Error('Informe a descrição da compra.');
    }

    if (!Number(valor) || Number(valor) <= 0) {
        throw new Error('Informe um valor válido para a compra.');
    }

    if (!data || !cartao) {
        throw new Error('Informe a data e o cartão da compra.');
    }

    const quantidade = Number(quantidade_de_parcelas);

    if (!Number.isInteger(quantidade) || quantidade < 1) {
        throw new Error('Informe uma quantidade de parcelas válida.');
    }

    const compra = new Compra(
        descricao,
        valor,
        data,
        cartao,
        quantidade
    );

    compras.push(compra);
    salvar_compras();

    return compra;
}