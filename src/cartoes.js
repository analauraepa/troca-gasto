import './style.css';
import './bootstrap.scss';

import Modal from 'bootstrap/js/dist/modal';
import Datepicker from 'vanillajs-datepicker/Datepicker';
import ptBR from 'vanillajs-datepicker/locales/pt-BR';
import 'vanillajs-datepicker/css/datepicker-bs5.css';

import { library, dom } from '@fortawesome/fontawesome-svg-core';
import { faTrash, faPencil } from '@fortawesome/free-solid-svg-icons';

import { iniciar_cartao_controller } from './controllers/cartao.controller.js';
import * as cartaoService from './services/cartao.services.js';
import * as resumoService from './services/index.service.js';
import * as compraService from './services/compra.services.js';
import { listar_parcelas, consultar_fatura_mes, alterar_estado_parcela, } from './services/faturas.services.js';
import { carregar_cartoes, carregar_compras_cartao } from './components/cartao.components.js';
import {
    exibirTotalFaturasCartoes,
    exibirMesFaturasCartoes
} from './components/index.components.js';

library.add(faTrash, faPencil);
dom.watch();
Object.assign(Datepicker.locales, ptBR);

const opcoesDataVencimento = {
    language: 'pt-BR',
    format: 'dd/mm/yyyy',
    autohide: true,
};

const data_adicionar = document.querySelector('#adicionar-data-vencimento');
const data_editar = document.querySelector('#editar-data-vencimento');

if (data_adicionar) new Datepicker(data_adicionar, { ...opcoesDataVencimento });
if (data_editar) new Datepicker(data_editar, { ...opcoesDataVencimento });

const divCartoes = document.querySelector('#cartoes');
const modal_adicionar = new Modal(document.querySelector('#modal-adicionar-cartao'));
const modal_editar = new Modal(document.querySelector('#modal-editar-cartao'));
const modal_excluir = new Modal(document.querySelector('#modal-excluir-cartao'));

const valor_limite_total = document.querySelector('#limite-total-cartoes');
const valor_limite_disponivel = document.querySelector('#limite-disponivel-cartoes');
const valor_total_faturas = document.querySelector('#total-faturas-cartoes');

// atualiza o total conjunto dos cartões para o mês selecionado
function atualizar_total_faturas() {
    // usa o mês escolhido no campo de consulta das faturas
    const mesSelecionado = document.querySelector('#mes-fatura').value;

    // calcula a soma das parcelas e exibe também o mês correspondente
    exibirTotalFaturasCartoes(
        valor_total_faturas,
        resumoService.calcularTotalFaturasCartoes(mesSelecionado)
    );
    exibirMesFaturasCartoes(
        document.querySelector('#mes-total-faturas-cartoes'),
        mesSelecionado
    );
}

function atualizar_limite_total() {
    valor_limite_total.textContent = new Intl.NumberFormat('pt-BR', 
        { style: 'currency', currency: 'BRL',
         }).format(cartaoService.calcular_limite_total());
    }

function atualizar_limite_disponivel() {
    valor_limite_disponivel.textContent = new Intl.NumberFormat('pt-BR', 
        { style: 'currency', currency: 'BRL',
         }).format(cartaoService.calcular_limite_disponivel_total());
    }


//atualiza os cartoes sempre que uma compra ou pagamento mudar o limite
function atualizar_cartoes() {
    carregar_cartoes(divCartoes, cartaoService.cartoes, cartaoService.calcular_limite_disponivel);
    atualizar_limite_disponivel();
}

atualizar_cartoes();
atualizar_limite_total();
atualizar_limite_disponivel();

const listaComprasCartao = document.querySelector('#lista-compras-cartao');

function atualizar_lista_compras_cartao() {
    if (!listaComprasCartao) return;

    carregar_compras_cartao(
        listaComprasCartao,
        compraService.compras,
        listar_parcelas,
        (idParcela, mesReferencia) => {
            const campoMes = document.querySelector('#mes-fatura');

            if (!campoMes || !mesReferencia) return;

            // Seleciona o mês da parcela clicada.
            campoMes.value = mesReferencia;

            // Atualiza a fatura e as próximas parcelas.
            atualizar_fatura_mes();
            atualizar_parcela_futuras();

            // Leva o usuário até a seção da fatura.
            campoMes.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });
        }
    );
}

atualizar_lista_compras_cartao();
atualizar_limite_total();
atualizar_limite_disponivel();


iniciar_cartao_controller({
    atualizar_limite_total,
    atualizar_limite_disponivel,
    divCartoes,
    form_adicionar_cartao: document.querySelector('#form-adicionar-cartao'),
    form_editar_cartao: document.querySelector('#form-editar-cartao'),
    modal_adicionar_cartao: modal_adicionar,
    modal_editar_cartao: modal_editar,
    modal_excluir_cartao: modal_excluir,
    btn_excluir_cartao: document.querySelector('#btn-excluir-cartao'),

});

// Localiza o formulário de compras no HTML
const form_compra = document.querySelector(
    '#form-adicionar-compra'
);

// Localiza o campo que mostra as mensagens.
const mensagem_compras = document.querySelector(
    '#mensagem-compras'
);


// Localiza a lista de cartões do fómulario.
const select_cartao_compra = document.querySelector(
    '#cartao-compra'
);

function carregar_cartoes_no_select(){
    if (!select_cartao_compra) return;

    // Remove as opções anteriores, mantendo a opção inicial.
    select_cartao_compra.innerHTML = '<option value="">Selecione um cartão</option>';

    cartaoService.cartoes.forEach((cartao, index) => {
        const opcao = document.createElement('option');
        opcao.value = index;
        opcao.textContent = cartao.nome;
        select_cartao_compra.appendChild(opcao);
    });
}

carregar_cartoes_no_select();

if (form_compra){
    form_compra.addEventListener('submit', function (evento){
        // Impede o recarregamento da página.
        evento.preventDefault();

        try {
            // Captura os dados didgitados no formulário.
            const descricao = document.querySelector('#descricao-compra').value.trim();
            const valor = Number(document.querySelector('#valor-compra').value);
            const data = document.querySelector('#data-compra').value;
            const indice_cartao = Number(select_cartao_compra.value);
            const quantidade_parcelas = Number(document.querySelector('#parcelas-compra').value);

            // Verifica se o usúario selecionou um cartão válido.
            if (
                select_cartao_compra.value === '' ||
                !cartaoService.cartoes[indice_cartao]
            ) {
                throw new Error('Selecione um cartão válido.');
            }

            // Recupera o cartão selecionado.
            const cartao = cartaoService.cartoes[indice_cartao];

            // Registra a compra usando o serviço.
            compraService.adicionar_compra(
                descricao,
                valor,
                data,
                cartao.nome,
                quantidade_parcelas
            );

            // exibe a confirmação.
            mensagem_compras.textContent = 'Compra registrada com sucesso!';
            mensagem_compras.className = 'alert alert-success';


            // Limpa  os campos após cadastro.
            form_compra.reset();

            // Atualiza a lista de compras de cartões disponiveis.
            carregar_cartoes_no_select();
            atualizar_fatura_mes();
            atualizar_total_faturas();
            atualizar_parcela_futuras();
            atualizar_lista_compras_cartao();
            atualizar_cartoes();

        
        } catch (error) {
            // Exibe o motivo caso o cadastro falhe.
            mensagem_compras.textContent = error.message;
            mensagem_compras.className = 'alert alert-danger';
        }
    });
}

function atualizar_fatura_mes() {
    const campoMes = document.querySelector('#mes-fatura');
    const totalFatura = document.querySelector('#total-fatura-mes');
    const quantidadeParcelas = document.querySelector('#quantidade-parcelas-mes');
    const listaParcelas = document.querySelector('#lista-parcelas-fatura');
    const totalPago = document.querySelector('#total-pago-mes');
    const totalPendente = document.querySelector('#total-pendente-mes');

    if (!campoMes || !totalFatura || !quantidadeParcelas || !listaParcelas || !totalPago || !totalPendente) {
        return;
    }

    try {
        
        const parcelas = consultar_fatura_mes(campoMes.value);

        // 1. Calcular primeiro os totais
        const total = parcelas.reduce(
            (soma, parcela) => soma + parcela.valor,
            0
        );

        const pago = parcelas
            .filter(parcela => parcela.paga)
            .reduce((soma, parcela) => soma + parcela.valor, 0);

        const pendente = total - pago;

        // 2. Depois, atualizar os valores na tela
        totalFatura.textContent = total.toLocaleString(
            'pt-BR',
            { style: 'currency', currency: 'BRL' }
        );

        totalPago.textContent = pago.toLocaleString(
            'pt-BR',
            { style: 'currency', currency: 'BRL' }
        );

        totalPendente.textContent = pendente.toLocaleString(
            'pt-BR',
            { style: 'currency', currency: 'BRL' }
        );

        quantidadeParcelas.textContent =
            `${parcelas.length} parcela(s) encontrada(s)`;


        if (parcelas.length === 0) {
            listaParcelas.textContent = 'Nenhuma parcela encontrada para o mês selecionado.';
            return;
        }

        listaParcelas.replaceChildren();

        parcelas.forEach(parcela => {
            const item = document.createElement('div');
            item.className = 'linha-parcela-fatura';
            item.style.padding = '10px 0';
            item.style.gap = '10px';

            const descricao = document.createElement('span');
            descricao.className = 'descricao-parcela';
            descricao.textContent = `${parcela.descricao} - parcela ${parcela.numero}/${parcela.total_parcelas} · ${parcela.cartao}`;

            const valor = document.createElement('strong');
            valor.className = 'valor-parcela';
            valor.textContent = parcela.valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

            const botao = document.createElement('button');

            botao.className = 'botao-pagamento';
            botao.textContent = parcela.paga 
                ? 'Paga ✓' 
                : 'Marcar como paga';

            botao.addEventListener('click', () => {
                alterar_estado_parcela(parcela.id);
                atualizar_cartoes();
                atualizar_limite_disponivel();
                atualizar_fatura_mes();
                atualizar_parcela_futuras();
                atualizar_lista_compras_cartao();
            });

            item.append(descricao, valor, botao);
            listaParcelas.appendChild(item);
        });
    } catch (erro) {
        console.error('Erro ao atualizar fatura do mês:', erro);
        totalFatura.textContent = 'R$ 0,00';
        quantidadeParcelas.textContent = 'Não foi possível consultar a fatura.';
        listaParcelas.textContent = 'Verifique os dados das compras cadastradas.';
    }
}

const campoMesFatura = document.querySelector('#mes-fatura');


if (campoMesFatura) {
    campoMesFatura.addEventListener('change', () => {
        atualizar_fatura_mes();
        atualizar_total_faturas();
        atualizar_parcela_futuras();
    });

    atualizar_fatura_mes();
    atualizar_total_faturas();
    atualizar_parcela_futuras();
}

function atualizar_parcela_futuras() {
    const campoMes = document.querySelector('#mes-fatura');
    const listaFuturas = document.querySelector('#lista-parcelas-futuras');

    if (!campoMes || !listaFuturas || !campoMes.value) {
        return;
    }

    try {
        const mesSelecionado = campoMes.value;

        const parcelasFuturas = listar_parcelas()
            .filter(parcela => parcela.mes_referencia > mesSelecionado)
            .sort((a, b) => {
                if (a.mes_referencia !== b.mes_referencia) {
                    return a.mes_referencia.localeCompare(b.mes_referencia);
                }

                return a.numero - b.numero;
            });

        listaFuturas.replaceChildren();

        if (parcelasFuturas.length === 0) {
            listaFuturas.textContent =
                'Não existem parcelas para os meses seguintes.';
            return;
        }

        let mesAtual = '';

        parcelasFuturas.forEach(parcela => {
            if (parcela.mes_referencia !== mesAtual) {
                mesAtual = parcela.mes_referencia;

                const tituloMes = document.createElement('h4');
                const [ano, mes] = mesAtual.split('-');

                const nomeMes = new Date(
                    Number(ano),
                    Number(mes) - 1,
                    1
                ).toLocaleDateString('pt-BR', {
                    month: 'long',
                    year: 'numeric'
                });

                tituloMes.textContent =
                    nomeMes.charAt(0).toUpperCase() + nomeMes.slice(1);

                listaFuturas.appendChild(tituloMes);
            }

            const item = document.createElement('div');
            item.className = 'linha-parcela-fatura';

            
            const descricao = document.createElement('span');
            descricao.className = 'descricao-parcela';
            descricao.textContent =
                `${parcela.descricao} - parcela ${parcela.numero}/${parcela.total_parcelas} · ${parcela.cartao}`;

            const valor = document.createElement('strong');
            valor.className = 'valor-parcela';
            valor.textContent = parcela.valor.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

            const estado = document.createElement('span');
            estado.className = parcela.paga
                ? 'status-parcela paga'
                : 'status-parcela pendente';
            estado.textContent = parcela.paga ? 'Paga ✓' : 'Pendente';

            const botao = document.createElement('button');
            botao.type = 'button';
            botao.className = parcela.paga
                ? 'botao-pagamento paga'
                : 'botao-pagamento';

            botao.textContent = parcela.paga
                ? 'Paga ✓'
                : 'Marcar como paga';

            botao.addEventListener('click', () => {
                alterar_estado_parcela(parcela.id);
                atualizar_cartoes();
                atualizar_limite_disponivel();
                atualizar_fatura_mes();
                atualizar_parcela_futuras();
                atualizar_lista_compras_cartao();
            });

            item.append(descricao, valor, estado);
            listaFuturas.appendChild(item);
        });
    } catch (erro) {
        console.error('Erro ao listar parcelas futuras:', erro);
        listaFuturas.textContent =
            'Não foi possível carregar as parcelas futuras.';
    }
}