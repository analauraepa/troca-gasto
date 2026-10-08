import { defineConfig } from 'vite';

export default defineConfig({
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