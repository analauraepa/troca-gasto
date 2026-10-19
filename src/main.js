import './style.css';
import './bootstrap.scss';

import 'bootstrap/js/dist/dropdown';
import Modal from 'bootstrap/js/dist/modal';

import Datepicker from 'vanillajs-datepicker/Datepicker';
import ptBR from 'vanillajs-datepicker/locales/pt-BR';
import 'vanillajs-datepicker/css/datepicker-bs5.css';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';

import { iniciarBancoController } from './controllers/banco.controller.js';
import { iniciarMovimentacaoController } from './controllers/movimentacao.controller.js';


import * as bancoService from './services/banco.services.js';
import * as movimentacaoServices from './services/movimentacao.services.js'
import * as indexService from './services/index.service.js';

import { carregarBancos, carregarBancosOptions } from './components/banco.components.js';
import { carregarMovimentacoes } from './components/movimentacao.components.js';
import { exibirTotalFaturasCartoes } from './components/index.components.js';
import { iniciarResumoController } from './controllers/index.controller.js';


library.add(faTrash, faPencil);
dom.watch();

Object.assign(Datepicker.locales, ptBR);

exibirTotalFaturasCartoes(
    document.querySelector('#total-faturas-cartoes'),
    indexService.calcularTotalFaturasCartoes()
);

// ELEMENTOS COMPARTILHADOS
const divBancos = document.querySelector('#banks');
const cardSaldoTotal = document.querySelector('#card-saldo-total');
const atualizarResumo = iniciarResumoController({
    saldoTotal: cardSaldoTotal,
    totalContasPendentes: document.querySelector('#total-contas-pendentes')
});
const selectBancosEntrada = document.querySelector('#add-banco-entrada');
const selectBancosSaida = document.querySelector('#add-banco-saida');
const listaMovimentacoes = document.querySelector('#lista-movimentacoes');

// MODAIS
const modalAdicionarBanco = new Modal(document.querySelector('#modal-adicionar-banco'));
const modalEditarBanco = new Modal(document.querySelector('#modal-editar-banco'));
const modalExcluirBanco = new Modal(document.querySelector('#modal-excluir-banco'));
const modalAdicionarEntrada = new Modal(document.querySelector('#modal-adicionar-entrada'));
const modalAdicionarSaida = new Modal(document.querySelector('#modal-adicionar-saida'));
const modalEditMovimentacao = new Modal(document.querySelector('#modal-editar-movimentacao'));
const modalExcluirMovimentacao = new Modal(document.querySelector('#modal-excluir-movimentacao'));

// DATEPICKER
const opcoesData = {
    language: 'pt-BR',
    format: 'dd/mm/yyyy',
    autohide: true,
    minDate: new Date(2000, 0, 1),
    maxDate: new Date()
};


new Datepicker(
    document.querySelector('#add-data-entrada'),
    { ...opcoesData }
);

new Datepicker(
    document.querySelector('#add-data-saida'),
    { ...opcoesData }
);

new Datepicker(
    document.querySelector('#edit-data-movimentacao'),
    { ...opcoesData }
);


// RENDERIZAÇÃO INICIAL
carregarBancos(divBancos, bancoService.bancos);
carregarBancosOptions(selectBancosEntrada,bancoService.bancos);
carregarBancosOptions(selectBancosSaida,bancoService.bancos);
carregarMovimentacoes(listaMovimentacoes,movimentacaoServices.movimentacoes);


// CONTROLLERS
iniciarBancoController({
    divBancos,
    selectBancosEntrada,
    selectBancosSaida,
    listaMovimentacoes,
    formAddBanco: document.querySelector('#form-adicionar-banco'),
    formEditBanco: document.querySelector('#form-editar-banco'),
    modalAdicionarBanco,
    modalEditarBanco,
    modalExcluirBanco,
    btnExcluirBanco: document.querySelector('#btn-excluir-banco'),
    atualizarResumo
});

iniciarMovimentacaoController({
    listaMovimentacoes,
    divBancos,
    formAddEntrada: document.querySelector('#form-adicionar-entrada'),
    formAddSaida: document.querySelector('#form-adicionar-saida'),
    formEditMovimentacao: document.querySelector('#form-editar-movimentacao'),
    modalAdicionarEntrada,
    modalAdicionarSaida,
    modalEditMovimentacao,
    modalExcluirMovimentacao,
    btnExcluirMovimentacao: document.querySelector('#btn-excluir-movimentacao'),
    atualizarResumo
});

// abre o formulário solicitado pelo dropdown de ações rápidas do resumo

// new URLSearchParams é um objeto nativo do js para ler e manipular url
// o parâmetro "window.location.search" procura tudo que vier depois do ? e guarda o valor 
// de nova, variável atribuida no html

const movimentacaoSolicitada = new URLSearchParams(window.location.search).get('nova');

if (movimentacaoSolicitada === 'entrada') {
    // abre a janela/modal de entrada sobre a página
    modalAdicionarEntrada.show();

} else if (movimentacaoSolicitada === 'saida') {
    modalAdicionarSaida.show();
}


