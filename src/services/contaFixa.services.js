import { ContaFixa } from "../models/ContaFixa.js";

// Carrega as contas salvas no navegador, caso não tenha nenhuma retorna um array vazio.
const dadosSalvos = JSON.parse(localStorage.getItem('contasFixas')) || [];

// Recria cada conta salva do navegador como uma instância do modelo ContaFixa.
export let contasFixas = dadosSalvos.map(conta => new ContaFixa(
    conta.descricao,
    conta.valor,
    conta.dataVencimento,
    conta.categoria,
    conta.banco,
    conta.cartao,
    conta.ativa
));

// Aqui vai salvar a lista atualizada no localStorage como texto JSON(JSON.stringify).
export function salvarContasFixas() {
    localStorage.setItem('contasFixas', JSON.stringify(contasFixas));
}

// Aqui cria uma conta fixa, adiciona no inicio usando unshift e salva.
export function adicionarContaFixa(
    descricao,
    valor,
    dataVencimento,
    categoria,
    banco,
    cartao,
    ativa = true
) {
    contasFixas.unshift(
        new ContaFixa(
            descricao,
            valor,
            dataVencimento,
            categoria,
            banco,
            cartao,
            ativa
        )
    );
    salvarContasFixas();
}

// Atualiza os dados da conta no índice que foi pego e salva a lista.
export function editarContaFixa(index, descricao, valor, dataVencimento, categoria, banco, cartao, ativa) {
    const conta = contasFixas[index];
    if (!conta) return false;

    conta.descricao = descricao;
    conta.valor = Number(valor);
    conta.dataVencimento = dataVencimento;
    conta.categoria = categoria;
    conta.banco = banco;
    conta.cartao = cartao;
    conta.ativa = ativa;

    salvarContasFixas();
    return true;
}

// Remove a conta no índice pego e salva a lista atualizada de contas.
export function excluirContaFixa(index) {
    if (!contasFixas[index]) return false;

    contasFixas.splice(index, 1);
    salvarContasFixas();
    return true;
}