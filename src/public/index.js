const socketClient = io()

const addProduct = document.getElementById('buttonAddProduct')
const form = document.getElementById('formSockets')
const products = document.getElementById('products')
const error = document.getElementById('error')

const deleteProd = (id) => {
    socketClient.emit('deleteProduct', id);
}
form.addEventListener('submit', (e) => {
    e.preventDefault()
    const title = document.getElementById('title').value
    const description = document.getElementById('description').value
    const code = document.getElementById('code').value
    const price = parseInt(document.getElementById('price').value)
    const stock = parseInt(document.getElementById('stock').value)
    const category = document.getElementById('category').value
    const status = true
    socketClient.emit('newProduct', { title, description, code, price, stock, category, status });
});
socketClient.on('arrayProducts', (array) => {
    let infoProducts = '';
    if (array) {
        array.forEach(p => {
            infoProducts += `
                <div class="container-fluid mb-2 d-flex flex-column align-items-center">
                    <div class="card text-center" style="width: 18rem;">
                        <div class="card-body">
                            <h5 class="card-title">${p.title}</h5>
                            <p class="card-text">${p.description}</p>
                            <h6 class="card-text">${p.price}</h6>
                        </div>
                    </div>
                    <button class="btn btn-danger" onclick="deleteProd('${p.id}')">eliminar</button>
                </div>
            `;
            products.innerHTML = infoProducts;
        });
    } else {
        infoProducts +=
            `<p>No tenemos productos</p>`
        products.innerHTML = infoProducts;
    }
});
socketClient.on('error', (message) => {
    let infoError = message
    error.innerHTML = infoError
    setTimeout(() => {
        infoError = '';
        error.innerHTML = infoError
    }, 3000);
})