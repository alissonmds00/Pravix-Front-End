import { API_BASE_URL } from '../config.js'

class ClienteDetalhamento {
  constructor() {
    this.dynamicContent = document.querySelector('#dynamic-content');
  }

  async fetchClientDetails(clientId) {
    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${clientId}`);
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching client details:', error);
      return null;
    }
  }

  renderClientDetails(client) {
    if (!client) return;

    this.dynamicContent.innerHTML = `
      <section id="client-details" class="section bg-white">
        <div class="container section-title accent-background" data-aos="fade-up">
          <h2 class="text-dark">Detalhes do Cliente</h2>
        </div>
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row justify-content-center gx-lg-0 gy-4">
            <div class="col-lg-8">
              <div class="client-details-wrapper p-4 accent-background shadow rounded">
                <div class="client-photo text-center">
                  <img src="${client.foto || 'assets/img/clients/sem-foto.png'}" class="img-fluid" alt="">
                </div>
                <div class="client-info mt-4">
                  <h2>${client.nome}</h2>
                  <p>Telefone: ${client.telefone}</p>
                  <p>Endereço: ${client.endereco.rua}, ${client.endereco.bairro}, ${client.endereco.cidade} - ${client.endereco.estado}, CEP: ${client.endereco.cep}</p>
                  <p>Complemento: ${client.endereco.complemento || 'N/A'}</p>
                </div>
                <div class="client-actions mt-4 d-flex justify-content-center">
                  <button class="btn btn-primary btn-edit"><i class="bi bi-pencil"></i> Editar</button>
                  <button class="btn btn-danger btn-delete"><i class="bi bi-trash"></i> Deletar</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    document.querySelector('.btn-edit').addEventListener('click', () => this.renderEditForm(client));
    document.querySelector('.btn-delete').addEventListener('click', () => this.handleDeleteClient(client.id));
  }

  renderEditForm(client) {
    this.dynamicContent.innerHTML = `
      <section id="edit-client" class="section bg-white">
        <div class="container section-title accent-background" data-aos="fade-up">
          <h2 class="text-dark">Editar Cliente</h2>
        </div>
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row justify-content-center gx-lg-0 gy-4">
            <div class="col-lg-8">
              <div class="form-wrapper p-4 accent-background shadow rounded">
                <form id="form-edit-client" class="php-email-form" data-aos="fade" data-aos-delay="100">
                  <div class="row gy-4">
                    <div class="col-md-6">
                      <label for="telefone">Telefone</label>
                      <input type="text" id="telefone" name="telefone" class="form-control placeholder-light" placeholder="${client.telefone}" maxlength="11" pattern="[0-9]*">
                    </div>
                    <div class="col-md-6">
                      <label for="cep">CEP</label>
                      <input type="text" id="cep" name="cep" class="form-control placeholder-light" placeholder="${client.endereco.cep}" maxlength="8" pattern="[0-9]*">
                    </div>
                    <div class="col-md-6">
                      <label for="estado">Estado</label>
                      <input type="text" id="estado" name="estado" class="form-control placeholder-light" placeholder="${client.endereco.estado}">
                    </div>
                    <div class="col-md-6">
                      <label for="cidade">Cidade</label>
                      <input type="text" id="cidade" name="cidade" class="form-control placeholder-light" placeholder="${client.endereco.cidade}">
                    </div>
                    <div class="col-md-6">
                      <label for="bairro">Bairro</label>
                      <input type="text" id="bairro" name="bairro" class="form-control placeholder-light" placeholder="${client.endereco.bairro}">
                    </div>
                    <div class="col-md-6">
                      <label for="rua">Rua</label>
                      <input type="text" id="rua" name="rua" class="form-control placeholder-light" placeholder="${client.endereco.rua}">
                    </div>
                    <div class="col-md-6">
                      <label for="complemento">Complemento</label>
                      <input type="text" id="complemento" name="complemento" class="form-control placeholder-light" placeholder="${client.endereco.complemento || ''}">
                    </div>
                    <div class="col-md-12 text-center">
                      <button type="button" class="btn btn-secondary btn-lg rounded-pill" id="btn-cancel">Cancelar</button>
                      <button type="submit" class="btn btn-success btn-lg rounded-pill">Salvar</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    document.querySelector('#btn-cancel').addEventListener('click', () => this.renderClientDetails(client));
    document.querySelector('#form-edit-client').addEventListener('submit', (event) => this.handleEditFormSubmit(event, client.id));
    document.querySelector('#cep').addEventListener('blur', this.handleCepBlur);
  }

  async handleCepBlur(event) {
    const cep = event.target.value;
    if (cep.length === 8 && /^[0-9]+$/.test(cep)) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          document.querySelector('#estado').value = data.estado;
          document.querySelector('#cidade').value = data.localidade;
          document.querySelector('#bairro').value = data.bairro;
          document.querySelector('#rua').value = data.logradouro;
        } else {
          alert('CEP não encontrado.');
        }
      } catch (error) {
        console.error('Error fetching address:', error);
      }
    } else {
      alert('CEP inválido.');
    }
  }

  async handleEditFormSubmit(event, clientId) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = {};

    if (formData.get('telefone') !== '') data.telefone = formData.get('telefone');
    if (formData.get('cep') !== '' || formData.get('estado') !== '' || formData.get('cidade') !== '' || formData.get('bairro') !== '' || formData.get('rua') !== '' || formData.get('complemento') !== '') {
      data.endereco = {};
      if (formData.get('cep') !== '') data.endereco.cep = formData.get('cep');
      if (formData.get('estado') !== '') data.endereco.estado = formData.get('estado');
      if (formData.get('cidade') !== '') data.endereco.cidade = formData.get('cidade');
      if (formData.get('bairro') !== '') data.endereco.bairro = formData.get('bairro');
      if (formData.get('rua') !== '') data.endereco.rua = formData.get('rua');
      if (formData.get('complemento') !== '') data.endereco.complemento = formData.get('complemento');
    }

    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${clientId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        alert('Cliente atualizado com sucesso!');
        const updatedClient = await response.json();
        this.renderClientDetails(updatedClient);
      } else {
        const errorData = await response.json();
        alert(`Erro ao atualizar cliente: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error updating client:', error);
      alert(`Erro ao atualizar cliente: ${error.message}`);
    }
  }

  async handleDeleteClient(clientId) {
    const confirmation = confirm('Você tem certeza que deseja deletar este cliente?');
    if (!confirmation) return;

    try {
      const response = await fetch(`${API_BASE_URL}/clientes/${clientId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        alert('Cliente deletado com sucesso!');
        this.dynamicContent.innerHTML = '';
      } else {
        const errorData = await response.json();
        alert(`Erro ao deletar cliente: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error deleting client:', error);
      alert(`Erro ao deletar cliente: ${error.message}`);
    }
  }
}

export default ClienteDetalhamento;
