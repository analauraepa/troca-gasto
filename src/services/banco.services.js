import { Banco } from "../models/Banco.js"
import * as movimentacaoService from "./movimentacao.services.js"

//Cria um array de objetos apartir dos dados salvos no localStorage, caso não haja dados, cria um array vazio
const dados = JSON.parse(localStorage.getItem("bancos")) || [];

//Cria um array de instâncias de Banco.js a partir do array dados
export let bancos = dados.map(banco => new Banco(banco.nome, Number(banco.saldo)));

//Transforma o array bancos em texto e salva no localStorage
export function salvarBancos() {
    localStorage.setItem("bancos", JSON.stringify(bancos));
}

//Adiciona um novo banco ao array bancos e salva no localStorage
export function adicionarBanco(nome,saldo = 0) {
    bancos.push(new Banco(nome, Number(saldo)));
    salvarBancos();
}

//Edita o nome de um banco existente no array bancos e salva no localStorage
export function editarBanco(nome,index) {
    const bancoAntigo = bancos[index].nome
    movimentacaoService.atualizarMovimentacoesEdicao(bancoAntigo,nome);
    bancos[index].nome = nome;
    salvarBancos();
}

//Remove um banco existente no array bancos (bem como suas movimentções) e salva no localStorage
export function removerBanco(index) {
    const banco = bancos[index].nome;
    movimentacaoService.atualizarMovimentacoesExclusao(banco);
    bancos.splice(index,1)
    salvarBancos();
}

export function nomeRepetido(nome) {
    return bancos.some(banco => banco.nome === nome);
}