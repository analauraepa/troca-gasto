import { ContaFixa } from "../models/ContaFixa.js";

// Lê as contas persistidas no navegador.
const dadosSalvos = JSON.parse(localStorage.getItem('contasFixas')) || [];

// Recria instâncias do modelo a partir dos dados persistidos.
export let contasFixas = dadosSalvos.map(conta => new ContaFixa(
    conta.descricao,
    conta.valor,
    conta.dataVencimento,
    conta.categoria,
    conta.banco,
    conta.cartao,
    conta.ativa,
    conta.mesesPagos || []
));

// Persiste a lista atualizada no localStorage.
export function salvarContasFixas() {
    localStorage.setItem('contasFixas', JSON.stringify(contasFixas));
}

// Cria a conta, insere no início da lista e salva.
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

// Atualiza os dados da conta selecionada e salva a lista.
export function editarContaFixa(
    index,
    descricao,
    valor,
    dataVencimento,
    categoria,
    banco,
    cartao,
    ativa
) {
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

// Remove a conta selecionada e salva a lista atualizada.
export function excluirContaFixa(index) {
    if (!contasFixas[index]) return false;

    contasFixas.splice(index, 1);
    salvarContasFixas();
    return true;
}

// Alterna o estado de pagamento da conta para o mês informado.
export function alternarPagamentoContaFixa(index, mes) {
    const conta = contasFixas[index];
    if (!conta) return false;

    if (conta.mesesPagos.includes(mes)) {
        conta.mesesPagos = conta.mesesPagos.filter(mesPago => mesPago !== mes);
    } else {
        conta.mesesPagos.push(mes);
    }

    salvarContasFixas();
    return true;
}