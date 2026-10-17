//imports para css e bibliotecas da página.
import './style.css';
import './bootstrap.scss';
import Modal from 'bootstrap/js/dist/modal';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';
import Datepicker from 'vanillajs-datepicker/Datepicker';
import ptBR from 'vanillajs-datepicker/locales/pt-BR';
import 'vanillajs-datepicker/css/datepicker-bs5.css';

//imports para serviços, componentes e controller da página.
import { iniciarContaFixaController } from './controllers/contaFixa.controller.js';
import { bancos } from './services/banco.services.js';
import { adicionarContaFixa, contasFixas } from './services/contaFixa.services.js';
import { carregarBancosOptions } from './components/banco.components.js';
import { carregarContasFixas, atualizarResumoContasFixas } from './components/contaFixa.components.js';
import { cartoes } from './services/cartao.services.js';
import { carregar_cartoes_options } from './components/cartao.components.js';

// Ativa os ícones usados nas ações da lista.
library.add(faTrash, faPencil);
dom.watch();

// Elementos principais da página.
const lista = document.querySelector('#lista-contas-fixas');
const selectBanco = document.querySelector('#conta-fixa-banco');
const formulario = document.querySelector('#form-conta-fixa');
const formularioEditar = document.querySelector('#form-editar-conta-fixa');
const vencimentoEditar = document.querySelector('#editar-conta-vencimento');
const selectBancoEditar = document.querySelector('#editar-conta-banco');
const elementoTotal = document.querySelector('#total-mensal-contas-fixas');
const elementoAtivas = document.querySelector('#quantidade-contas-ativas');
const elementoPagas = document.querySelector('#quantidade-contas-pagas');
const selectCartao = document.querySelector('#conta-fixa-cartao');
const selectCartaoEditar = document.querySelector('#editar-conta-cartao');


// Atualiza a lista e os indicadores do painel com os dados atuais.
function atualizarPainel() {
    carregarContasFixas(lista, contasFixas);
    atualizarResumoContasFixas(
        elementoTotal,
        elementoAtivas,
        elementoPagas,
        contasFixas
    );
}

// Exibe os dados iniciais e preenche os seletores de banco.
atualizarPainel();
carregarBancosOptions(selectBanco, bancos);
carregarBancosOptions(selectBancoEditar, bancos);
carregar_cartoes_options(selectCartao, cartoes);
carregar_cartoes_options(selectCartaoEditar, cartoes);

// Configura os campos de vencimento no formato DD/MM/AAAA.
Object.assign(Datepicker.locales, ptBR);
const opcoesDatepicker = {
    language: 'pt-BR',
    format: 'dd/mm/yyyy',
    autohide: true
};

new Datepicker(document.querySelector('#conta-fixa-vencimento'), opcoesDatepicker);
const datepickerEditar = new Datepicker(vencimentoEditar, opcoesDatepicker);

// Prepara o modal de cadastro.
const modalContaFixa = new Modal(document.querySelector('#modal-conta-fixa'));

// necessário para o resumo - verifica se a url tem atributo de nova
// (atribuido no link do html) com valor de conta-fixa
if (new URLSearchParams(window.location.search).get('nova') === 'conta-fixa') {
    // mostra o modal
    modalContaFixa.show();
}

// Prepara os modais da página.
const modalEditarContaFixa = new Modal(document.querySelector('#modal-editar-conta-fixa'));
const modalExcluirContaFixa = new Modal(document.querySelector('#modal-excluir-conta-fixa'));
const btnExcluirContaFixa = document.querySelector('#btn-excluir-conta-fixa');

// Cadastra uma conta fixa e atualiza a interface.
formulario.addEventListener('submit', event => {
    event.preventDefault();

    if (!formulario.reportValidity()) return;

    adicionarContaFixa(
        document.querySelector('#conta-fixa-descricao').value.trim(),
        document.querySelector('#conta-fixa-valor').value,
        document.querySelector('#conta-fixa-vencimento').value,
        document.querySelector('#conta-fixa-categoria').value.trim(),
        document.querySelector('#conta-fixa-banco').value,
        document.querySelector('#conta-fixa-cartao').value
    );

    atualizarPainel();
    formulario.reset();
    modalContaFixa.hide();
});

// Inicia os eventos de edição, exclusão e pagamento.
iniciarContaFixaController({
    lista,
    formularioEditar,
    datepickerEditar,
    selectBancoEditar,
    modalEditarContaFixa,
    modalExcluirContaFixa,
    btnExcluirContaFixa,
    atualizarPainel
});