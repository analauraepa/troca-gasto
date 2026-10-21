import * as cartaoService from '../services/cartao.services.js';
import { carregar_cartoes } from '../components/cartao.components.js';


export function iniciar_cartao_controller({
    atualizar_limite_total,
    atualizar_limite_disponivel,
    divCartoes,
    form_adicionar_cartao,
    form_editar_cartao,
    modal_adicionar_cartao,
    modal_editar_cartao,
    modal_excluir_cartao,
    btn_excluir_cartao,
    carregar_cartoes_no_select
}) {
    const input_nome_cartao = form_adicionar_cartao.querySelector(('#adicionar-nome-cartao'))
    const input_editar_cartao = form_editar_cartao.querySelector(('#editar-nome-cartao'))
    const input_editar_valor_fatura = form_editar_cartao.querySelector('#editar-valor-fatura');
    const input_editar_data_vencimento = form_editar_cartao.querySelector('#editar-data-vencimento');
    const input_editar_limite_total = form_editar_cartao.querySelector('#editar-limite-total');

    //Recarrega os elementos dinâmicos da interface: cartoes
    function atualizar_cartao_interface() {
        carregar_cartoes(divCartoes, cartaoService.cartoes, cartaoService.calcular_limite_disponivel, cartaoService.calcular_limite_disponivel_total);
        atualizar_limite_total();
        atualizar_limite_disponivel();
    }

    divCartoes.addEventListener('click', (event) => {
        const card = event.target.closest('.card[data-index]');
        if (!card) return;
        const index = card.dataset.index;
    
        if (event.target.closest('.fa-pencil')) {
            document.querySelector('#modal-editar-cartao').dataset.index = index;
            const cartao = cartaoService.cartoes[Number(index)];
            if (!cartao) return;

            input_editar_cartao.value = cartao.nome;
            input_editar_valor_fatura.value = cartao.valor_fatura;
            input_editar_data_vencimento.value = cartao.data_vencimento || '';
            input_editar_limite_total.value = cartao.limite_total;
        }
    
        if (event.target.closest('.fa-trash')) {
            document.querySelector('#modal-excluir-cartao').dataset.index = index;
        }
    });

    //Valida o preenchimento do formulário, adiciona um cartao ao array de cartoes e atualiza a interface
    form_adicionar_cartao.addEventListener('submit', (event) => {
        event.preventDefault();
    
        if (!form_adicionar_cartao.checkValidity()) {
            input_nome_cartao.classList.add('red');
            input_nome_cartao.nextElementSibling.textContent ='Insira o nome do cartão.';
            input_nome_cartao.nextElementSibling.classList.remove('hide');
            return;
        }
    
        const nome = input_nome_cartao.value.trim();
        const valor_fatura = Number(document.querySelector('#adicionar-valor-fatura').value) || 0;
        const limite_total = Number(document.querySelector('#adicionar-limite-total').value) || 0;
        const data_vencimento = document.querySelector('#adicionar-data-vencimento').value || '';

        //Verifica se o nome escolhido já existe
        if (cartaoService.cartao_repetido(nome)) {
            input_nome_cartao.classList.add('red');
            input_nome_cartao.nextElementSibling.textContent ='O nome do cartão já existe.';
            input_nome_cartao.nextElementSibling.classList.remove('hide');
            return;
        }
    
        cartaoService.adicionar_cartao(nome, valor_fatura, limite_total, data_vencimento);

        
        atualizar_cartao_interface();
        carregar_cartoes_no_select();

        form_adicionar_cartao.reset();
        modal_adicionar_cartao.hide();
        });

    //Valida o preenchimento do formulário, edita um cartao já existente e atualiza a interface
    form_editar_cartao.addEventListener('submit', (event) => {
        event.preventDefault();
    
        if (!form_editar_cartao.checkValidity()) {
            input_editar_cartao.classList.add('red');
            input_editar_cartao.nextElementSibling.textContent ='Insira o nome do cartão.';
            input_editar_cartao.nextElementSibling.classList.remove('hide');
            return;
        }
    
        const nome = input_editar_cartao.value.trim();
        const valor_fatura = Number(input_editar_valor_fatura.value) || 0;
        const data_vencimento = input_editar_data_vencimento.value || '';
        const limite_total = Number(input_editar_limite_total.value) || 0;
        const index = Number(document.querySelector('#modal-editar-cartao').dataset.index);
        const nome_atual = cartaoService.cartoes[index]?.nome;
    
        //Verifica se o nome escolhido já existe
        if (nome !== nome_atual && cartaoService.cartao_repetido(nome)) {
            input_editar_cartao.classList.add('red');
            input_editar_cartao.nextElementSibling.textContent = 'O nome do cartão já existe.';
            input_editar_cartao.nextElementSibling.classList.remove('hide');
            return;
        }
    
        cartaoService.editar_cartao(nome, valor_fatura, data_vencimento, limite_total, index);
    
        atualizar_cartao_interface();
        form_editar_cartao.reset();
        modal_editar_cartao.hide();
    });
    
    //Exclui o cartao selecionado e atualiza a interface
    btn_excluir_cartao.addEventListener('click', () => {
        const index = Number(document.querySelector('#modal-excluir-cartao').dataset.index);
        cartaoService.remover_cartao(index);
        atualizar_cartao_interface();
        modal_excluir_cartao.hide();
    });
    
    //Valida o formulário antes do usuário clicar o botão submit
    input_nome_cartao.addEventListener('input', () => {
            if (input_nome_cartao.value === '') {
                input_nome_cartao.classList.add('red');
                input_nome_cartao.nextElementSibling.textContent = 'Insira o nome do cartão.';
                input_nome_cartao.nextElementSibling.classList.remove('hide');
            } else {
                input_nome_cartao.classList.remove('red');
                input_nome_cartao.nextElementSibling.classList.add('hide');
            }
        });
    
    //Valida o formulário antes do usuário clicar o botão submit
    input_editar_cartao.addEventListener('input', () => {
            if (input_editar_cartao.value === '') {
                input_editar_cartao.classList.add('red');
                input_editar_cartao.nextElementSibling.textContent = 'Insira o nome do cartão.';
                input_editar_cartao.nextElementSibling.classList.remove('hide');
            } else {
                input_editar_cartao.classList.remove('red');
                input_editar_cartao.nextElementSibling.classList.add('hide');
            }
        });
    }