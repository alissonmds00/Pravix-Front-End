import ClienteDetalhamento from '../components/cliente-detalhamento.js';
import { API_BASE_URL } from '../config.js';

class ClienteVisualizacao {
  constructor() {
    this.btnVisualizar = document.querySelector("#btn-visualizar");
    this.dynamicContent = document.querySelector('#dynamic-content');
    this.clienteDetalhamento = new ClienteDetalhamento();
    this.init();
  }

  init() {
    this.btnVisualizar.addEventListener('click', this.handleVisualizarClick.bind(this));
  }

  async handleVisualizarClick(event) {
    event.preventDefault();
    const { formatarNumero } = await import('../utils/formatador.js');
    const clients = await this.fetchClients();
    this.renderClients(clients, formatarNumero);
  }

  async fetchClients() {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes`);
      const data = await response.json();
      return data.content;
    } catch (error) {
      console.error('Error fetching clients:', error);
      return [];
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
}

document.addEventListener('DOMContentLoaded', () => {
  new ClienteVisualizacao();
});
