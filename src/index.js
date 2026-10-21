import './style.css';
import './bootstrap.scss';
import 'bootstrap/js/dist/dropdown';

import { iniciarResumoController } from './controllers/index.controller.js';
import * as resumoService from './services/index.service.js';
import {
    exibirTotalFaturasCartoes,
    exibirMesFaturasCartoes
} from './components/index.components.js';

//unico local que irá acessar os elementos html, a pagina de components serve para criar e exibir após algum atualização
iniciarResumoController({
    saldoTotal: document.querySelector('#card-saldo-total'),
    receitas: document.querySelector('.receitas'),
    despesas: document.querySelector('.saidas'),
    resultado: document.querySelector('.total'),
    totalContasPendentes: document.querySelector('#total-contas-pendentes'),
    proximasContas: document.querySelector('#proximas-contas'),
    ultimasMovimentacoes: document.querySelector('#ultimas-movimentacoes')
});

// exibe no resumo o total das parcelas de cartão previstas para o mês atual
const mesAtualFaturas = resumoService.obterMesAtual();
exibirTotalFaturasCartoes(
    document.querySelector('#total-faturas-cartoes'),
    resumoService.calcularTotalFaturasCartoes(mesAtualFaturas)
);
exibirMesFaturasCartoes(
    document.querySelector('#mes-total-faturas-cartoes'),
    mesAtualFaturas
);