import { Banco } from "../models/Banco.js"

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

//Edita o nome de uma conta existente no array contas e salva no localStorage
export function editarBanco(nome,index) {
    bancos[index].nome = nome;
    salvarBancos();
}

//Remove uma conta existente no array contas e salva no localStorage
export function removerBanco(index) {
    bancos.splice(index,1)
    salvarBancos();
}

export function nomeRepetido(nome) {
    return bancos.some(banco => banco.nome === nome);
}