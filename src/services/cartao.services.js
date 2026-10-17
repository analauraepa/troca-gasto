import { Cartao } from "../models/cartao.js"
import { listar_parcelas} from "./faturas.services.js"

//Cria um array de objetos a partir dos dados salvos no localStorage, caso não haja dados, cria um array vazio
const dados = JSON.parse(localStorage.getItem("cartoes")) || [];

//Cria um array de instâncias de cartao.js a partir do array dados
export let cartoes = dados.map(cartao => new Cartao(cartao.nome, Number(cartao.valor_fatura), Number(cartao.limite_total), cartao.data_vencimento));

//Retorna o limite total de todos os cartões cadastrados
export function calcular_limite_total() {
    const total_em_centavos = cartoes.reduce((total, cartao) => {
        const limite = Number(cartao.limite_total) || 0;
        return total + Math.round(limite * 100);
    }, 0);
    return total_em_centavos / 100;
}
//Retorna o limite disponível de cada cartão cadastrado
export function calcular_limite_disponivel(cartao) {
    const limite_total_centavos = Math.round((Number(cartao.limite_total) || 0) * 100); 
    const parcelas_em_aberto_centavos = listar_parcelas().filter(parcela =>
         parcela.cartao === cartao.nome && !parcela.paga).reduce((total, parcela) => {
            return total + Math.round((Number(parcela.valor) || 0) * 100);
        }, 0);
        return (limite_total_centavos - parcelas_em_aberto_centavos) / 100;
}

//Retorna o limite disponível total de todos os cartões cadastrados
export function calcular_limite_disponivel_total() {
    const total_centavos = cartoes.reduce((total, cartao) => {
        const limite_disponivel = calcular_limite_disponivel(cartao);
        return total + Math.round(limite_disponivel * 100);
    }, 0);
    return total_centavos / 100;
}

//Transforma o array cartoes em texto e salva no localStorage
export function salvar_cartoes() {
    localStorage.setItem("cartoes", JSON.stringify(cartoes));
}

//Adiciona um novo cartao ao array cartoes e salva no localStorage
export function adicionar_cartao(nome, valor_fatura, limite_total, data_vencimento) {
    cartoes.push(new Cartao(nome, Number(valor_fatura), Number(limite_total), data_vencimento));
    salvar_cartoes();
}

//Edita o nome de um cartao existente no array cartoes e salva no localStorage
export function editar_cartao(nome, valor_fatura, data_vencimento, limite_total, index) {
    cartoes[index].nome = nome;
    cartoes[index].valor_fatura = Number(valor_fatura);
    cartoes[index].data_vencimento = data_vencimento;
    cartoes[index].limite_total = Number(limite_total);
    salvar_cartoes();
}

//Remove um cartao existente no array cartoes (bem como suas movimentções) e salva no localStorage
export function remover_cartao(index) {
    cartoes.splice(index, 1);
    salvar_cartoes();
}

export function cartao_repetido(nome) {
    return cartoes.some(cartao => cartao.nome === nome);
}