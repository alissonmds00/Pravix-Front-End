import ClienteDetalhamento from '../components/cliente-detalhamento.js';
import Paginacao from '../components/paginacao.js';
import { API_BASE_URL } from '../config.js';

class ClienteVisualizacao {
  constructor() {
    this.btnVisualizar = document.querySelector("#btn-visualizar");
    this.dynamicContent = document.querySelector('#dynamic-content');
    this.clienteDetalhamento = new ClienteDetalhamento();
    this.currentPage = 1;
    this.totalPages = 1;
    this.init();
  }

  init() {
    this.btnVisualizar.addEventListener('click', this.handleVisualizarClick.bind(this));
  }

  async handleVisualizarClick(event) {
    event.preventDefault();
    const { formatarNumero } = await import('../utils/formatador.js');
    const { clients, totalPages } = await this.fetchClients(this.currentPage - 1);
    this.totalPages = totalPages;
    this.renderClients(clients, formatarNumero);
  }

  async fetchClients(page = 0) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes?page=${page}`);
      const data = await response.json();
      return { clients: data.content, totalPages: data.totalPages };
    } catch (error) {
      console.error('Error fetching clients:', error);
      return { clients: [], totalPages: 1 };
    }
  }

  renderClients(clients, formatarNumero) {
    this.dynamicContent.innerHTML = `
      <section id="clientes" class="team section">
        <div class="container section-title" data-aos="fade-up">
          <h2>Nossos clientes</h2>
        </div>
        <div class="container">
          <div class="row gy-4"></div>
        </div>
      </section>
    `;

    const clientesContainer = this.dynamicContent.querySelector('.row');
    clientesContainer.innerHTML = '';

    if (clients.length === 0) {
      clientesContainer.innerHTML = '<p class="text-center" style="font-size: 1.5rem;">Ainda não há nenhum cliente cadastrado.</p>';
    } else {
      clients.forEach(client => {
        const clienteCard = this.createClientCard(client, formatarNumero);
        clientesContainer.appendChild(clienteCard);
      });
    }

    this.addPagination();
  }

  createClientCard(client, formatarNumero) {
    const clienteCard = document.createElement('a');
    clienteCard.href = `#`;
    clienteCard.classList.add('col-xl-3', 'col-md-6', 'd-flex');
    clienteCard.setAttribute('data-aos', 'fade-up');
    clienteCard.setAttribute('data-aos-delay', '100');
    clienteCard.innerHTML = `
      <div class="member text-center">
        <img src="${client.foto || 'assets/img/clients/sem-foto.png'}" class="img-fluid" alt="">
        <h4>${client.nome}</h4>
        <span>${client.endereco.estado} - ${client.endereco.cidade}</span>
        <div class="social">
          <p>${formatarNumero(client.telefone)}</p>
        </div>
      </div>
    `;
    clienteCard.addEventListener('click', (event) => this.handleClientCardClick(event, client.id));
    return clienteCard;
  }

  async handleClientCardClick(event, clientId) {
    event.preventDefault();
    const client = await this.clienteDetalhamento.fetchClientDetails(clientId);
    this.clienteDetalhamento.renderClientDetails(client);
  }

  addPagination() {
    const paginacao = new Paginacao(this.currentPage, this.totalPages, this.handlePaginationClick.bind(this));
    const paginationHTML = paginacao.render();
    this.dynamicContent.insertAdjacentHTML('beforeend', paginationHTML);
    paginacao.attachEvents(this.dynamicContent);
  }

  async handlePaginationClick(event) {
    event.preventDefault();
    const page = parseInt(event.target.getAttribute('data-page'));
    if (page >= 0 && page < this.totalPages) {
      this.currentPage = page + 1;
      const { formatarNumero } = await import('../utils/formatador.js');
      const { clients, totalPages } = await this.fetchClients(page);
      this.totalPages = totalPages;
      this.renderClients(clients, formatarNumero);
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ClienteVisualizacao();
});
