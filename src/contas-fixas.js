//imports para css e bibliotecas da página.
import './style.css';
import './bootstrap.scss';
import Modal from 'bootstrap/js/dist/modal';
import { library, dom } from '@fortawesome/fontawesome-svg-core';
import {
    faTrash,
    faPencil,
    faLandmark,
    faCreditCard
} from '@fortawesome/free-solid-svg-icons';
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
library.add(faTrash, faPencil, faLandmark, faCreditCard);
dom.watch();

// Elementos principais da página.
const lista = document.querySelector('#lista-contas-fixas');
const formulario = document.querySelector('#form-conta-fixa');
const formularioEditar = document.querySelector('#form-editar-conta-fixa');
const vencimentoEditar = document.querySelector('#editar-conta-vencimento');
const elementoTotal = document.querySelector('#total-mensal-contas-fixas');
const elementoAtivas = document.querySelector('#quantidade-contas-ativas');
const elementoPagas = document.querySelector('#quantidade-contas-pagas');

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

// Exibe as contas; os seletores de banco e cartão são carregados apenas para o modal de pagamento.
atualizarPainel();


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
    );

    atualizarPainel();
    formulario.reset();
    modalContaFixa.hide();
});

// Preenche os seletores usados no modal de pagamento, não no cadastro da conta fixa.
const selectBancoPagamento = document.querySelector('#banco-pagamento');
const selectCartaoPagamento = document.querySelector('#cartao-pagamento');

carregarBancosOptions(selectBancoPagamento, bancos);
selectBancoPagamento.insertBefore(
    new Option('Selecione um banco', ''),
    selectBancoPagamento.firstChild
);
carregar_cartoes_options(selectCartaoPagamento, cartoes);

const modalPagamentoContaFixa = new Modal(
    document.querySelector('#modal-pagamento-conta-fixa')
);

// Entrega ao controller o formulário, o modal e as opções de banco/cartão do pagamento.
iniciarContaFixaController({
    lista,
    formularioEditar,
    datepickerEditar,
    modalEditarContaFixa,
    modalExcluirContaFixa,
    btnExcluirContaFixa,
    atualizarPainel,

    formularioPagamento: document.querySelector('#form-pagamento-conta-fixa'),
    modalPagamentoContaFixa,
    selectBancoPagamento,
    selectCartaoPagamento
});