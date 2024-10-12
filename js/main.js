let carroCompras = JSON.parse(localStorage.getItem("carro")) || [];

fetch("https://fakestoreapi.com/products")
    .then((resp) => resp.json ())
    .then((data) => cargarProductos(data))



let contendorProductos = document.querySelector("#productos");
let carroVacio = document.querySelector("#carro-vacio");
let carroProductos = document.querySelector("#carro-compras");
let carroTotal = document.querySelector("#carro-total");

function cargarProductos (data) {
    data.forEach((producto) => {
        let div = document.createElement ("div");
        div.classList.add ("producto");
        div.innerHTML = `
        <img class="producto-img" src=${producto.image}>
        <h3>${producto.title}</h3>
        <p>$${producto.price}</p>
        `;

        let boton = document.createElement("button");
        boton.classList.add ("producto-boton");
        boton.innerText = "Agregar al carro de compras";
        boton.addEventListener("click", () => {
            agregarAlCarro (producto);
        })

        div.append(boton);

        productos.append(div);
    });
}


function actualizarCarro() {
    if (carroCompras.length === 0) {
        carroVacio.classList.remove("d-none");
        carroProductos.classList.add("d-none");
    } else {
        carroVacio.classList.add("d-none");
        carroProductos.classList.remove("d-none");

        carroProductos.innerHTML = "";
        carroCompras.forEach((producto) => {
            let div = document.createElement("div");
            div.classList.add("carrito-producto");
            div.innerHTML = `
            <h3>${producto.title}</h3>
            <p>$${producto.price}</p>
            <p>Cantidad: ${producto.cantidad}</p>
            <p>Subt: ${(producto.price * producto.cantidad).toFixed(2)}</p>
            `;

            let botonAumento = document.createElement ("button");
            botonAumento.classList.add ("carrito-producto-boton");
            botonAumento.innerText = "⬆️";
            botonAumento.addEventListener("click", () => {
                aumentoCantidad(producto);
            })
            div.append (botonAumento);
        
            let botonReducir = document.createElement ("button");
            botonReducir.classList.add ("carrito-producto-boton");
            botonReducir.innerText = "⬇️";
            botonReducir.addEventListener("click", () => {
                reducirCantidad(producto);
        })
            div.append (botonReducir);

            let boton = document.createElement("button");
            boton.classList.add ("carrito-producto-boton");
            boton.innerText = "❌";
            boton.addEventListener("click", () => {
                borrarDelCarro(producto);
            });

            div.append(boton);
            carroProductos.append(div);
        });
    }
    actualizarTotal();
    localStorage.setItem("carro", JSON.stringify(carroCompras));
}

function agregarAlCarro (producto){
    let itemEncontrado = carroCompras.find((item) => item.id === producto.id);

    if (itemEncontrado) {
        itemEncontrado.cantidad++;
        Toastify({
            text: "Cantidad actualizada!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#65B891",
        }).showToast();
    } else {
        carroCompras.push({...producto, cantidad: 1});
        Toastify({
            text: "Producto agregado al carro!",
            duration: 3000,
            gravity: "top",
            position: "right",
            backgroundColor: "#65B891",
        }).showToast();
    }

    actualizarCarro();
}

function borrarDelCarro (producto) {
    let indice = carroCompras.findIndex ((item) => item.id === producto.id);
    carroCompras.splice (indice, 1);
    Toastify({
        text: "Producto eliminado del carro!",
        duration: 3000,
        gravity: "bottom",
        position: "right",
        backgroundColor: "#F2542D",
    }).showToast();

    actualizarCarro();
}

function actualizarTotal (producto) {
    let total = carroCompras.reduce((acc, prod) => acc + (prod.price * prod.cantidad), 0);
    carroTotal.innerText = `$${total.toFixed(2)}`;
}

function aumentoCantidad (producto) {
    let itemEncontrado = carroCompras.find ((item) => item.id === producto.id);
    itemEncontrado.cantidad++;
    Toastify({
        text: "Cantidad aumentada!",
        duration: 3000,
        gravity: "top",
        position: "right",
        backgroundColor: "#4E878C",
    }).showToast();

    actualizarCarro();
}

function reducirCantidad (producto) {
    let itemEncontrado = carroCompras.find ((item) => item.id === producto.id);
    
    if (itemEncontrado.cantidad >= 2) {
        itemEncontrado.cantidad--;
        actualizarCarro ();
        Toastify({
            text: "Cantidad reducida!",
            duration: 3000,
            gravity: "bottom",
            position: "right",
            backgroundColor: "#4E878C",
        }).showToast();

    } else {
        borrarDelCarro (itemEncontrado);
    }
}

actualizarCarro();