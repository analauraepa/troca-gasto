import { defineConfig } from 'vite';

export default defineConfig({
  base: '/troca-gasto/',

  build: {
    rollupOptions: {
      input: {
        index: 'index.html',
        movimentacoes: 'movimentacoes.html',
        cartoes: 'cartoes.html',
        contasFixas: 'contas-fixas.html'
      }
    }
  }
});