const CLAVE_CARRITO = "miTiendaCarrito";
const carrito = JSON.parse(localStorage.getItem(CLAVE_CARRITO) || "{}");
const contadores = document.querySelectorAll("[data-contador-carrito]");

function mostrarMensajeCarrito(mensaje) {
    document.querySelectorAll("[data-mensaje-carrito]").forEach((elemento) => {
        elemento.textContent = mensaje;
    });
}

function guardarCarrito() {
    localStorage.setItem(CLAVE_CARRITO, JSON.stringify(carrito));
}

function actualizarContadores() {
    const cantidad = Object.values(carrito).reduce(
        (total, producto) => total + producto.cantidad,
        0
    );
    contadores.forEach((contador) => {
        contador.textContent = String(cantidad);
    });
}

function actualizarVistaCarrito() {
    const lista = document.querySelector("[data-lista-carrito]");
    if (!lista) {
        return;
    }

    const vacio = document.querySelector("[data-carrito-vacio]");
    const totalElemento = document.querySelector("[data-total-carrito]");
    lista.replaceChildren();
    let total = 0;

    Object.entries(carrito).forEach(([nombre, producto]) => {
        total += producto.precio * producto.cantidad;

        const item = document.createElement("li");
        item.className = "carrito-item";
        const descripcion = document.createElement("span");
        descripcion.textContent = `${nombre} x ${producto.cantidad} — $${(producto.precio * producto.cantidad).toFixed(2)}`;
        const quitar = document.createElement("button");
        quitar.type = "button";
        quitar.textContent = "Quitar uno";
        quitar.setAttribute("aria-label", `Quitar una unidad de ${nombre}`);
        quitar.addEventListener("click", () => {
            if (producto.cantidad > 1) {
                producto.cantidad -= 1;
            } else {
                delete carrito[nombre];
            }
            guardarCarrito();
            actualizarContadores();
            actualizarVistaCarrito();
            mostrarMensajeCarrito("");
        });
        item.append(descripcion, quitar);
        lista.append(item);
    });

    totalElemento.textContent = total.toFixed(2);
    vacio.hidden = Object.keys(carrito).length > 0;
}

document.querySelectorAll("[data-producto]").forEach((boton) => {
    boton.addEventListener("click", () => {
        const nombre = boton.dataset.producto;
        const precio = Number(boton.dataset.precio);
        const producto = carrito[nombre];

        if (producto) {
            producto.cantidad += 1;
        } else {
            carrito[nombre] = { precio, cantidad: 1 };
        }

        guardarCarrito();
        actualizarContadores();
        actualizarVistaCarrito();
        mostrarMensajeCarrito(`${nombre} agregado al carrito.`);
    });
});

document.querySelector("[data-vaciar-carrito]")?.addEventListener("click", () => {
    Object.keys(carrito).forEach((nombre) => delete carrito[nombre]);
    guardarCarrito();
    actualizarContadores();
    actualizarVistaCarrito();
    mostrarMensajeCarrito("El carrito está vacío.");
});

document.querySelector("[data-finalizar-compra]")?.addEventListener("click", () => {
    mostrarMensajeCarrito(Object.keys(carrito).length
        ? "El carrito está listo. Para procesar pagos se necesita conectar un servidor."
        : "Agrega un producto antes de finalizar la compra.");
});

document.querySelector("[data-formulario-login]")?.addEventListener("submit", (evento) => {
    evento.preventDefault();
    document.querySelector("[data-mensaje-login]").textContent =
        "El formulario funciona, pero la autenticación requiere conectarse a un servidor.";
});

document.querySelectorAll("[data-anio]").forEach((anio) => {
    anio.textContent = String(new Date().getFullYear());
});

actualizarContadores();
actualizarVistaCarrito();
