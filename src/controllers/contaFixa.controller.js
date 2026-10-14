// Operações sobre as contas fixas.
import {
    contasFixas,
    editarContaFixa,
    excluirContaFixa,
    alternarPagamentoContaFixa
} from '../services/contaFixa.services.js';

// Registra os eventos da lista e dos formulários de contas fixas.
export function iniciarContaFixaController({
    lista, // Lista das contas fixas.
    formularioEditar, // Formulário do modal de edição.
    datepickerEditar, // Datepicker do dia de vencimento.
    selectBancoEditar, // Seletor de banco do formulário.
    modalEditarContaFixa, // Modal de editar contas.
    modalExcluirContaFixa, // Modal para excluir contas.
    btnExcluirContaFixa, // Botão de confirmação da exclusão.
    atualizarPainel // Atualiza a lista e o resumo.
}) {
    // Identifica a conta selecionada e preenche o formulário de edição.
    lista.addEventListener('click', event => {
        const botaoEditar = event.target.closest(
            '[data-bs-target="#modal-editar-conta-fixa"]'
        );

        // Ignora os cliques que não foram do botão de editar.
        if (!botaoEditar) return;

        // Encontra a linha e pega o seu índice no array de contas existentes.
        const linha = botaoEditar.closest('.item-conta-fixa');
        if (!linha) return;

        const index = Number(linha.dataset.index);
        const conta = contasFixas[index];
        if (!conta) return;

        // Guarda o índice para usá-lo quando o formulário for enviado.
        formularioEditar.dataset.index = index;

        // Preenche os campos com os dados atuais da conta.
        document.querySelector('#editar-conta-descricao').value = conta.descricao;
        document.querySelector('#editar-conta-valor').value = conta.valor;
        datepickerEditar.setDate(conta.dataVencimento);
        document.querySelector('#editar-conta-categoria').value = conta.categoria;
        selectBancoEditar.value = conta.banco;
        document.querySelector('#editar-conta-cartao').value = conta.cartao;
        document.querySelector('#editar-conta-ativa').value = String(conta.ativa);
    });

    // Valida os dados modificados, salva e atualiza a visualização da página.
    formularioEditar.addEventListener('submit', event => {
        // Evita que a página recarregue quando for enviado.
        event.preventDefault();

        // Interrompe o salvamento se algum campo obrigatório for inválido.
        if (!formularioEditar.reportValidity()) return;

        // Recupera o índice guardado ao abrir o formulário.
        const index = Number(formularioEditar.dataset.index);

        // Envia os novos valores ao serviço.
        const editou = editarContaFixa(
            index,
            document.querySelector('#editar-conta-descricao').value.trim(),
            document.querySelector('#editar-conta-valor').value,
            document.querySelector('#editar-conta-vencimento').value,
            document.querySelector('#editar-conta-categoria').value.trim(),
            selectBancoEditar.value,
            document.querySelector('#editar-conta-cartao').value,
            document.querySelector('#editar-conta-ativa').value === 'true'
        );

        // Não atualiza a interface da página se não encontrou a conta.
        if (!editou) return;

        // Atualiza lista e resumo, limpa o formulário e fecha o modal.
        atualizarPainel();
        formularioEditar.reset();
        modalEditarContaFixa.hide();
    });

    // Pega qual conta foi escolhida para exclusão.
    lista.addEventListener('click', event => {
        const botaoExcluir = event.target.closest(
            '[data-bs-target="#modal-excluir-conta-fixa"]'
        );

        if (!botaoExcluir) return;
        const linha = botaoExcluir.closest('.item-conta-fixa');
        if (!linha) return;

        btnExcluirContaFixa.dataset.index = linha.dataset.index;
    });

    // Exclui a conta confirmada e atualiza a lista e o resumo.
    btnExcluirContaFixa.addEventListener('click', () => {
        const index = Number(btnExcluirContaFixa.dataset.index);
        const excluiu = excluirContaFixa(index);
        if (!excluiu) return;

        atualizarPainel();
        modalExcluirContaFixa.hide();
    });

    // Marca ou desmarca a conta como paga no mês atual.
    lista.addEventListener('click', event => {
        // Encontra o botão mesmo quando o clique acontece num elemento dentro dele.
        const botaoPagamento = event.target.closest(
            '[data-action="alternar-pagamento"]'
        );
        if (!botaoPagamento) return;

        // Localiza a conta e pega seu índice na lista de contas.
        const linha = botaoPagamento.closest('.item-conta-fixa');
        if (!linha) return;
        const index = Number(linha.dataset.index);

        // Monta o mês atual no formato AAAA-MM usado pelo serviço.
        const dataAtual = new Date();
        const mesAtual = `${dataAtual.getFullYear()}-${String(
            dataAtual.getMonth() + 1
        ).padStart(2, '0')}`;

        // Alterna o estado de pagamento e atualiza a lista e o painel se a conta existir.
        const alterou = alternarPagamentoContaFixa(index, mesAtual);
        if (!alterou) return;

        atualizarPainel();
    });
}
