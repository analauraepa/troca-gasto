// Serviços e componente usados para editar e redesenhar as contas fixas.
import { contasFixas, editarContaFixa, excluirContaFixa } from '../services/contaFixa.services.js';
import { carregarContasFixas } from '../components/contaFixa.components.js';

// Registra os eventos relacionados à edição de contas fixas.
export function iniciarContaFixaController({
    lista, // Lista das contas fixas.
    formularioEditar, // Formulário do modal de edição.
    datepickerEditar, // Datepicker do dia de vencimento.
    selectBancoEditar, // Seletor de banco do formulário.
    modalEditarContaFixa, // Modal de editar contas.
    modalExcluirContaFixa, // Modal para excluir contas.
    btnExcluirContaFixa  // ação do botão para excluir.
}) {
    
    // Identifica a conta selecionada e preenche o formulário de edição.
    lista.addEventListener('click', event => {
        const botaoEditar = event.target.closest('[data-bs-target="#modal-editar-conta-fixa"]');

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

        // Preenche os campos com os dados atuais da conta, para visualizar os dados que existiam antes da modificação.
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

        // Envia os novos valores para o services.
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

        // Mostra os dados atualizados, limpa o formulário e fecha o modal.
        carregarContasFixas(lista, contasFixas);
        formularioEditar.reset();
        modalEditarContaFixa.hide();
    });

    // Pega qual conta foi escolhida para exclusão.
    lista.addEventListener('click', event => {
        const botaoExcluir = event.target.closest('[data-bs-target="#modal-excluir-conta-fixa"]');

        if (!botaoExcluir) return;
        const linha = botaoExcluir.closest('.item-conta-fixa');
        if (!linha) return;

        btnExcluirContaFixa.dataset.index = linha.dataset.index;
    });

    // Exclui a conta confirmada e atualiza a lista de contas existentes.
    btnExcluirContaFixa.addEventListener('click', () => {
        const index = Number(btnExcluirContaFixa.dataset.index);
        const excluiu = excluirContaFixa(index);
        if (!excluiu) return;

        carregarContasFixas(lista, contasFixas);
        modalExcluirContaFixa.hide();
    });
}
