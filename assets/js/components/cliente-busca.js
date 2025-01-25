import ClienteDetalhamento from './cliente-detalhamento.js';
import {API_BASE_URL} from '../config.js'

class ClienteBusca {
  constructor() {
    this.dynamicContent = document.querySelector('#dynamic-content');
    this.clienteDetalhamento = new ClienteDetalhamento();
    this.init();
  }

  init() {
    const btnPesquisar = document.querySelector('#btn-pesquisar-cliente');
    btnPesquisar.addEventListener('click', this.handlePesquisarClick.bind(this));
  }

  handlePesquisarClick(event) {
    event.preventDefault();
    this.renderSearchForm();
  }

  renderSearchForm() {
    this.dynamicContent.innerHTML = `
      <section id="pesquisar-cliente" class="section bg-white">
        <div class="container section-title accent-background" data-aos="fade-up">
          <h2 class="text-dark">Pesquisar Cliente</h2>
          <p>Digite o valor e selecione o tipo de busca</p>
        </div>
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row justify-content-center gx-lg-0 gy-4">
            <div class="col-lg-8">
              <div class="form-wrapper p-4 accent-background shadow rounded">
                <form id="form-pesquisar-cliente" class="php-email-form" data-aos="fade" data-aos-delay="100">
                  <div class="row gy-4">
                    <div class="col-md-8">
                      <label for="search-value">Valor</label>
                      <input type="text" id="search-value" name="search-value" class="form-control placeholder-light" placeholder="Digite o valor" required>
                    </div>
                    <div class="col-md-4">
                      <label for="search-type">Tipo</label>
                      <select id="search-type" name="search-type" class="form-control placeholder-light" required>
                        <option value="cpf">CPF</option>
                        <option value="nome">Nome</option>
                        <option value="telefone">Telefone</option>
                      </select>
                    </div>
                    <div class="col-md-12 text-center">
                      <button type="submit" class="btn btn-success btn-lg rounded-pill">Pesquisar</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    document.querySelector('#form-pesquisar-cliente').addEventListener('submit', this.handleSearchFormSubmit.bind(this));
  }

  async handleSearchFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const searchValue = formData.get('search-value');
    const searchType = formData.get('search-type');

    const requestBody = {
      [searchType]: searchValue,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/clientes/buscar`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });
      const clients = await response.json();
      this.renderClients(clients);
    } catch (error) {
      console.error('Error searching clients:', error);
      alert(`Erro ao buscar clientes: ${error.message}`);
    }
  }

  renderClients(clients) {
    this.dynamicContent.innerHTML = `
      <section id="clientes" class="team section">
        <div class="container section-title" data-aos="fade-up">
          <h2>Resultados da Pesquisa</h2>
        </div>
        <div class="container">
          <div class="row gy-4"></div>
        </div>
      </section>
    `;

    const clientesContainer = this.dynamicContent.querySelector('.row');
    clientesContainer.innerHTML = '';

    if (clients.length === 0) {
      clientesContainer.innerHTML = '<p class="text-center" style="font-size: 1.5rem;">Nenhum cliente encontrado.</p>';
    } else {
      clients.forEach((client) => {
        const clienteCard = this.createClientCard(client);
        clientesContainer.appendChild(clienteCard);
      });
    }
  }

  createClientCard(client) {
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
          <p>${client.telefone}</p>
        </div>
      </div>
    `;
    clienteCard.addEventListener('click', async (event) => {
      event.preventDefault();
      const clientDetails = await this.clienteDetalhamento.fetchClientDetails(client.id);
      this.clienteDetalhamento.renderClientDetails(clientDetails);
    });
    return clienteCard;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new ClienteBusca();
});
