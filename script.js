const API_URL = "https://api.escuelajs.co/api/v1/products";
let allProducts = [];
let filteredProducts = [];

let currentPage = 1;
let pageSize = 10;

async function getAllProducts() {
    try {
        const response = await fetch(API_URL);
        const data = await response.json();
        allProducts = data;
        filteredProducts = data;
        render();
    } catch (error) {
        console.error("Lỗi khi load dữ liệu:", error);
    }
}

function render() {
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;

    const pageData = filteredProducts.slice(start, end);

    renderTable(pageData);
    renderPagination();
}

function renderPagination() {
    const totalPages = Math.ceil(filteredProducts.length / pageSize);
    const paginationUl = document.getElementById("pagination");

    paginationUl.innerHTML = "";

    // Add 'Previous' button
    const prevLi = document.createElement("li");
    prevLi.className = `page-item ${currentPage === 1 ? 'disabled' : ''}`;
    const prevLink = document.createElement("a");
    prevLink.className = "page-link";
    prevLink.href = "#";
    prevLink.innerText = "Previous";
    prevLink.onclick = (e) => {
        e.preventDefault();
        if (currentPage > 1) {
            currentPage--;
            render();
        }
    };
    prevLi.appendChild(prevLink);
    paginationUl.appendChild(prevLi);

    // Add page number buttons
    for (let i = 1; i <= totalPages; i++) {
        const li = document.createElement("li");
        li.className = `page-item ${i === currentPage ? 'active' : ''}`;
        const a = document.createElement("a");
        a.className = "page-link";
        a.href = "#";
        a.innerText = i;
        a.onclick = (e) => {
            e.preventDefault();
            currentPage = i;
            render();
        };
        li.appendChild(a);
        paginationUl.appendChild(li);
    }

    // Add 'Next' button
    const nextLi = document.createElement("li");
    nextLi.className = `page-item ${currentPage === totalPages ? 'disabled' : ''}`;
    const nextLink = document.createElement("a");
    nextLink.className = "page-link";
    nextLink.href = "#";
    nextLink.innerText = "Next";
    nextLink.onclick = (e) => {
        e.preventDefault();
        if (currentPage < totalPages) {
            currentPage++;
            render();
        }
    };
    nextLi.appendChild(nextLink);
    paginationUl.appendChild(nextLi);
}


function renderTable(products) {
    const tbody = document.querySelector("#productTable tbody");
    tbody.innerHTML = "";

    if (products.length === 0) {
        tbody.innerHTML = '<tr><td colspan="5" class="text-center">Không tìm thấy sản phẩm nào.</td></tr>';
        return;
    }

    products.forEach(product => {
        const tr = document.createElement("tr");

        // Check for images and handle missing images
        const imageUrl = product.images && product.images.length > 0 
            ? product.images[0] 
            : 'https://via.placeholder.com/100'; // Placeholder image

        tr.innerHTML = `
            <td>${product.id}</td>
            <td>
                <img src="${imageUrl}" alt="${product.title}">
            </td>
            <td>${product.title}</td>
            <td>$${product.price.toFixed(2)}</td>
            <td>${product.category?.name || 'N/A'}</td>
        `;

        tbody.appendChild(tr);
    });
}

function handleSearch() {
    const keyword = document
        .getElementById("searchInput")
        .value
        .toLowerCase();

    filteredProducts = allProducts.filter(product =>
        product.title.toLowerCase().includes(keyword)
    );

    currentPage = 1;
    render();
}
function changePageSize() {
    pageSize = parseInt(document.getElementById("pageSize").value);
    currentPage = 1;
    render();
}
function sortByPrice(order) {
    filteredProducts.sort((a, b) => {
        return order === "asc"
            ? a.price - b.price
            : b.price - a.price;
    });

    currentPage = 1;
    render();
}

function sortByTitle(order) {
    filteredProducts.sort((a, b) => {
        return order === "asc"
            ? a.title.localeCompare(b.title)
            : b.title.localeCompare(a.title);
    });

    currentPage = 1;
    render();
}



// Gọi khi load trang
getAllProducts();