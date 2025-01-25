export default class Paginacao {
  constructor(currentPage, totalPages, onPageClick) {
    this.currentPage = currentPage;
    this.totalPages = totalPages;
    this.onPageClick = onPageClick;
  }

  render() {
    let paginationHTML = `
      <!-- Blog Pagination Section -->
      <section id="blog-pagination" class="blog-pagination section">
        <div class="container">
          <div class="d-flex justify-content-center">
            <ul>
    `;

    const startPage = Math.max(1, this.currentPage - 5);
    const endPage = Math.min(this.totalPages, this.currentPage + 4);

    for (let i = startPage; i <= endPage; i++) {
      paginationHTML += `<li><a href="#" data-page="${i - 1}" class="${this.currentPage === i ? 'active' : ''}">${i}</a></li>`;
    }

    paginationHTML += `
            </ul>
          </div>
        </div>
      </section><!-- /Blog Pagination Section -->
    `;

    return paginationHTML;
  }

  attachEvents(container) {
    container.querySelectorAll('#blog-pagination a').forEach(link => {
      link.addEventListener('click', (event) => this.onPageClick(event));
    });
  }
}
