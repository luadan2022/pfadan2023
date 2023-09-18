let total = 0;
let carrito = [];
let listaProductos = [];

async function cargarProductos() {
    try {
        const response = await fetch('productos.json');
        listaProductos = await response.json();

        const productosContainer = document.getElementById('productos');
        
        listaProductos.forEach(producto => {
            const productoDiv = document.createElement('div');
            productoDiv.classList.add('producto');

            const nombreProducto = document.createElement('p');
            nombreProducto.textContent = `${producto.nombre} USD${producto.precio}`;

            const botonAgregar = document.createElement('input');
            botonAgregar.type = 'button';
            botonAgregar.value = 'Agregar Al Carrito';
            botonAgregar.onclick = () => agregarAlCarrito(producto.precio, producto.nombre);

            productoDiv.appendChild(nombreProducto);
            productoDiv.appendChild(botonAgregar);

            productosContainer.appendChild(productoDiv);
        });
    } catch (error) {
        console.error('Error al cargar los productos:', error);
    }
}

window.onload = async function() {
    await cargarProductos();
    cargarCarrito();
    actualizarCarrito();
    actualizarTotal();
};

function agregarAlCarrito(precio, nombre) {
    total += precio;
    carrito.push(nombre);
    guardarCarrito();
    actualizarCarrito();
    actualizarTotal();

    Swal.fire({
        icon: 'success',
        title: 'Producto agregado',
        text: `${nombre} ha sido agregado al carrito.`,
        showConfirmButton: false,
        timer: 1500
    });
}

function eliminarDelCarrito(nombre) {
    const indice = carrito.indexOf(nombre);
    if (indice !== -1) {
        const precioEliminado = obtenerPrecioProducto(nombre);
        carrito.splice(indice, 1);
        total -= precioEliminado;
        guardarCarrito();
        actualizarCarrito();
        actualizarTotal();
    }
}

function obtenerPrecioProducto(nombre) {
    const productoEnLista = listaProductos.find(producto => producto.nombre === nombre);
    if (productoEnLista) {
        return productoEnLista.precio;
    }
    return 0;
}

function cargarCarrito() {
    const carritoGuardado = localStorage.getItem('carrito');
    if (carritoGuardado) {
        carrito = JSON.parse(carritoGuardado);
    }

    const totalGuardado = localStorage.getItem('total');
    if (totalGuardado) {
        total = parseFloat(totalGuardado);
    }
}

function guardarCarrito() {
    localStorage.setItem('carrito', JSON.stringify(carrito));
    localStorage.setItem('total', JSON.stringify(total));
}

function actualizarCarrito() {
    const elementoListaCarrito = document.getElementById('carrito');
    elementoListaCarrito.innerHTML = '';

    carrito.forEach(producto => {
        const li = document.createElement('li');
        li.textContent = producto;

        const botonEliminar = document.createElement('button');
        botonEliminar.classList.add('eliminar-producto');
        botonEliminar.textContent = 'Eliminar';
        botonEliminar.onclick = () => eliminarDelCarrito(producto);
        
        li.appendChild(botonEliminar);
        elementoListaCarrito.appendChild(li);
    });
}

function actualizarTotal() {
    const totalCompras = document.getElementById('totalCompras');
    totalCompras.textContent = total;
}

function limpiarCarrito() {
    total = 0;
    carrito = [];
    guardarCarrito();
    actualizarCarrito();
    actualizarTotal();
}
