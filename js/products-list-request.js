const token =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJMb2dpblR5cGUiOiIxIiwiQ3VzdG9tZXJJRCI6IjU1NzI0IiwiRmlyc3ROYW1lIjoiRGVtbyIsIkxhc3ROYW1lIjoiSHlwZXIiLCJFbWFpbCI6ImRlbW9AaHlwZXIuY29tIiwiQ3VzdG9tZXJUeXBlSUQiOiIzMiIsIklzUmVzZWxsZXIiOiIwIiwiSXNBUEkiOiIxIiwiUmVmZXJhbmNlSUQiOiIiLCJSZWdpc3RlckRhdGUiOiIzLzI1LzIwMjUgMTowMDo0OCBQTSIsImV4cCI6MjA1Mzk3MDc0MywiaXNzIjoiaHR0cHM6Ly9oeXBlcnRla25vbG9qaS5jb20iLCJhdWQiOiJodHRwczovL2h5cGVydGVrbm9sb2ppLmNvbSJ9.dJnOilP5umTtEYFKdpBNUMgIpl8mBN7SUrAPuMyPwn4";

const productsListContainer = document.getElementById(
  "products-list-container"
);

let allProducts = [];

let cartItemCount = 0;

let currentPage = 1;
let productsPerPage = 20;

function updateCartBadge() {
  const cartBadge = document.querySelector('.fa-shopping-basket').nextElementSibling;
  cartBadge.textContent = cartItemCount > 99 ? '99+' : cartItemCount;
}

function createProductCard(product) {
  const productCardName = document.createElement("div");
  productCardName.className = "col-auto product-card";

  productCardName.innerHTML = `
  <div class="product-image">
    <img src="${product.image}" />
    <div class="product-category-icon">
      <img src="${product.categoryIcon}" />
    </div>
    <div class="product-card-hover">
      <h4>${product.name}</h4>
      <div class="rating">⭐️ ⭐️ ⭐️ ⭐️ ⭐️ ( ${product.rating} )</div>
      <div class="product-buttons">
        <button class="detail-view-button">Detaylı Görüntüle</button>
        <button class="add-to-cart-button" onclick="addToCart('${product.name}')">Sepete Ekle</button>
      </div>
    </div>
  </div>
  <div class="product-price-container">
    <h3>${product.price} ₺</h3>
  </div>
`;
  return productCardName;
}

fetch("https://api.hyperteknoloji.com.tr/products/list", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  },
})
  .then((response) => {
    if (!response.ok)
      throw new Error("Ürün listesi çekilirken bir sorun oluştu.");
    return response.json();
  })
  .then((data) => {
    productsListContainer.innerHTML = "";
    console.log("data", data);

    allProducts = data.data.map(product => ({
      name: product.productName,
      image: product.productData.productMainImage,
      categoryIcon: product.productData.categoryIcon
        ? product.productData.categoryIcon
        : "assets/icons/riot_icon.svg",
      price: product.marketPrice,
      rating: product.rating ? product.rating : 0,
    }));
    
    displayProducts(allProducts);
  })
  .catch((error) => {
    console.log("Request Error:", error);
  });

function createPaginationButtons(totalProducts) {
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const pagination = document.getElementById('pagination');
  pagination.innerHTML = '';

  const firstLi = document.createElement('li');
  firstLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  firstLi.innerHTML = `<a class="page-link" href="#" aria-label="First">
    <span aria-hidden="true">&laquo;&laquo;</span>
  </a>`;
  firstLi.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage !== 1) {
      currentPage = 1;
      displayProducts(allProducts);
    }
  });
  pagination.appendChild(firstLi);

  const prevLi = document.createElement('li');
  prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
  prevLi.innerHTML = `<a class="page-link" href="#" aria-label="Previous">
    <span aria-hidden="true">&laquo;</span>
  </a>`;
  prevLi.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage > 1) {
      currentPage--;
      displayProducts(allProducts);
    }
  });
  pagination.appendChild(prevLi);

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  
  if (endPage - startPage < 4) {
    startPage = Math.max(1, endPage - 4);
  }

  for (let i = startPage; i <= endPage; i++) {
    const li = document.createElement('li');
    li.className = `page-item ${currentPage === i ? 'active' : ''}`;
    li.innerHTML = `<a class="page-link" href="#">${i}</a>`;
    li.addEventListener('click', (e) => {
      e.preventDefault();
      currentPage = i;
      displayProducts(allProducts);
    });
    pagination.appendChild(li);
  }

  const nextLi = document.createElement('li');
  nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  nextLi.innerHTML = `<a class="page-link" href="#" aria-label="Next">
    <span aria-hidden="true">&raquo;</span>
  </a>`;
  nextLi.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage < totalPages) {
      currentPage++;
      displayProducts(allProducts);
    }
  });
  pagination.appendChild(nextLi);

  const lastLi = document.createElement('li');
  lastLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
  lastLi.innerHTML = `<a class="page-link" href="#" aria-label="Last">
    <span aria-hidden="true">&raquo;&raquo;</span>
  </a>`;
  lastLi.addEventListener('click', (e) => {
    e.preventDefault();
    if (currentPage !== totalPages) {
      currentPage = totalPages;
      displayProducts(allProducts);
    }
  });
  pagination.appendChild(lastLi);
}

function displayProducts(products) {
  productsListContainer.innerHTML = "";
  
  if (products.length === 0) {
    const noProductMessage = document.createElement("div");
    noProductMessage.className = "col-12 text-center mt-5";
    noProductMessage.innerHTML = `
      <h3>Ürün Bulunamadı</h3>
    `;
    productsListContainer.appendChild(noProductMessage);
    return;
  }

  const startIndex = (currentPage - 1) * productsPerPage;
  const endIndex = startIndex + productsPerPage;
  const paginatedProducts = products.slice(startIndex, endIndex);

  paginatedProducts.forEach(product => {
    const card = createProductCard(product);
    productsListContainer.appendChild(card);
  });

  createPaginationButtons(products.length);
}

function searchProducts(searchTerm) {
  currentPage = 1;
  const filteredProducts = allProducts.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  displayProducts(filteredProducts);
}

document.querySelector('.search-input').addEventListener('input', (e) => {
  searchProducts(e.target.value);
});

function addToCart(productName) {
  cartItemCount++;
  updateCartBadge();  
  alert(`${productName} sepete eklendi!`);
}

document.addEventListener('DOMContentLoaded', () => {
  cartItemCount = 0;
  updateCartBadge();

  const productsPerPageSelect = document.getElementById('productsPerPageSelect');
  productsPerPageSelect.addEventListener('change', (e) => {
    productsPerPage = parseInt(e.target.value);
    currentPage = 1;
    displayProducts(allProducts);
  });
});
