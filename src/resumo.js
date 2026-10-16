import './style.css';
import './bootstrap.scss';
import 'bootstrap/js/dist/dropdown';

import { iniciarResumoController } from './controllers/resumo.controller.js';

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