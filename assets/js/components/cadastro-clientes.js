import { API_BASE_URL } from '../config.js';

document.addEventListener('DOMContentLoaded', () => {
  const clienteCadastro = new ClienteCadastro();
  clienteCadastro.init();
});

class ClienteCadastro {
  init() {
    const btnCadastrar = document.querySelector("#btn-cadastrar-cliente");
    btnCadastrar.addEventListener("click", this.handleCadastrarClick.bind(this));
  }

  handleCadastrarClick(event) {
    event.preventDefault();
    this.renderCadastroForm();
  }

  renderCadastroForm() {
    const dynamicContent = document.querySelector('#dynamic-content');
    dynamicContent.innerHTML = `
      <section id="cadastro-cliente" class="section bg-white">
        <div class="container section-title accent-background" data-aos="fade-up">
          <h2 class="text-dark">Cadastrar Cliente</h2>
              <p>Insira as informações</p>
        </div>
        <div class="container" data-aos="fade-up" data-aos-delay="100">
          <div class="row justify-content-center gx-lg-0 gy-4">
            <div class="col-lg-8">
              <div class="form-wrapper p-4 accent-background shadow rounded">
                <form id="form-cadastro-cliente" class="php-email-form" data-aos="fade" data-aos-delay="100">
                  <div class="row gy-4">
                    <div class="col-md-6">
                      <label for="nome">Nome</label>
                      <input type="text" id="nome" name="nome" class="form-control placeholder-light" placeholder="João da Silva" required>
                    </div>
                    <div class="col-md-6">
                      <label for="telefone">Telefone</label>
                      <input type="text" id="telefone" name="telefone" class="form-control placeholder-light" placeholder="11987654321" maxlength="11" pattern="[0-9]*" required>
                    </div>
                    <div class="col-md-6">
                      <label for="cpf">CPF</label>
                      <input type="text" id="cpf" name="cpf" class="form-control placeholder-light" placeholder="12345678901" maxlength="11" pattern="[0-9]*" required>
                    </div>
                    <div class="col-md-6">
                      <label for="cep">CEP</label>
                      <input type="text" id="cep" name="cep" class="form-control placeholder-light" placeholder="12345678" maxlength="8" pattern="[0-9]*" required>
                    </div>
                    <div class="col-md-6">
                      <label for="estado">Estado</label>
                      <input type="text" id="estado" name="estado" class="form-control placeholder-light" placeholder="São Paulo" required>
                    </div>
                    <div class="col-md-6">
                      <label for="cidade">Cidade</label>
                      <input type="text" id="cidade" name="cidade" class="form-control placeholder-light" placeholder="São Paulo" required>
                    </div>
                    <div class="col-md-6">
                      <label for="bairro">Bairro</label>
                      <input type="text" id="bairro" name="bairro" class="form-control placeholder-light" placeholder="Centro" required>
                    </div>
                    <div class="col-md-6">
                      <label for="rua">Rua</label>
                      <input type="text" id="rua" name="rua" class="form-control placeholder-light" placeholder="Rua das Flores" required>
                    </div>
                    <div class="col-md-6">
                      <label for="complemento">Complemento</label>
                      <input type="text" id="complemento" name="complemento" class="form-control placeholder-light" placeholder="Apto 101">
                    </div>
                    <div class="col-md-12 text-center">
                      <div class="loading">Loading</div>
                      <div class="error-message" style="display: none; min-height: 50px; color: white;"></div>
                      <div class="sent-message" style="display: none; min-height: 50px;">Cliente cadastrado com sucesso!</div>
                      <button type="submit" class="btn btn-success btn-lg rounded-pill">Cadastrar</button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    `;

    const form = document.querySelector('#form-cadastro-cliente');
    form.addEventListener('submit', this.handleFormSubmit.bind(this));

    const cepInput = document.querySelector('#cep');
    cepInput.addEventListener('blur', this.handleCepBlur.bind(this));
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

  async handleFormSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const formData = new FormData(form);
    const data = {
      nome: formData.get('nome'),
      telefone: formData.get('telefone'),
      cpf: formData.get('cpf'),
      endereco: {
        cep: formData.get('cep'),
        estado: formData.get('estado'),
        cidade: formData.get('cidade'),
        bairro: formData.get('bairro'),
        rua: formData.get('rua'),
        complemento: formData.get('complemento') || ''
      }
    };

    try {
      const response = await fetch(`${API_BASE_URL}/clientes`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      const successMessage = document.querySelector('.sent-message');
      const errorMessage = document.querySelector('.error-message');

      if (response.ok) {
        successMessage.style.display = 'block';
        errorMessage.style.display = 'none';
        form.reset();
      } else {
        const errorData = await response.json();
        errorMessage.textContent = `Erro ao cadastrar cliente: ${errorData.message}`;
        errorMessage.style.display = 'block';
        successMessage.style.display = 'none';
      }
    } catch (error) {
      console.error('Error:', error);
      const errorMessage = document.querySelector('.error-message');
      errorMessage.textContent = `Erro ao cadastrar cliente: ${error.message}`;
      errorMessage.style.display = 'block';
      document.querySelector('.sent-message').style.display = 'none';
    }
  }
}