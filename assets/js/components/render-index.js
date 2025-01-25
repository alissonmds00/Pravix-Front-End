import { API_BASE_URL } from '../config.js'

class RenderIndex {
  constructor() {
    this.dynamicContent = document.querySelector('#dynamic-content');
    this.init();
  }

  init() {
    document.querySelector('#icon-btn-visualizar').addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelector('#btn-visualizar').click();
      this.scrollToDynamicContent();
    });

    document.querySelector('#icon-btn-cadastrar-cliente').addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelector('#btn-cadastrar-cliente').click();
      this.scrollToDynamicContent();
    });

    document.querySelector('#icon-btn-pesquisar-cliente').addEventListener('click', (event) => {
      event.preventDefault();
      document.querySelector('#btn-pesquisar-cliente').click();
      this.scrollToDynamicContent();
    });

    document.querySelector('#btn-visualizar').addEventListener('click', this.scrollToDynamicContent.bind(this));
    document.querySelector('#btn-cadastrar-cliente').addEventListener('click', this.scrollToDynamicContent.bind(this));
    document.querySelector('#btn-pesquisar-cliente').addEventListener('click', this.scrollToDynamicContent.bind(this));

    this.fetchHappyClientsCount();
  }

  scrollToDynamicContent() {
    this.dynamicContent.scrollIntoView({ behavior: 'smooth' });
  }

  async fetchHappyClientsCount() {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/contagem`);
      const data = await response.json();
      const count = parseInt(data, 10);
      document.querySelector('#happy-clients-count').setAttribute('data-purecounter-end', count);
      document.querySelector('#happy-clients-count').textContent = count;
      new PureCounter();
    } catch (error) {
      console.error('Error fetching happy clients count:', error);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new RenderIndex();
});
