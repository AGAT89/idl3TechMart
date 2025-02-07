document.addEventListener("DOMContentLoaded", () => {
    const contenedorProductos = document.getElementById("productos-container");
    const carritoCounter = document.getElementById("carrito-counter");
    const buscador = document.getElementById("buscador");
    const modalCarrito = document.getElementById("modal-carrito");
    const cerrarModalCarrito = document.getElementById("cerrar-modal");
    const productosModal = document.getElementById("productos-modal");
    const totalSuma = document.getElementById("total-suma");
    const btnCarrito = document.getElementById("carrito");
    const btnIniciarSesion = document.getElementById("iniciar-sesion");
    const modalLogin = document.getElementById("modal-login");
    const formLogin = document.getElementById("formLogin");

    const modalCompra = document.createElement("div");
    modalCompra.id = "modal-compra";
    modalCompra.classList.add("modal");
    modalCompra.innerHTML = `
        <div class="modal-content">
            <h2>Detalles de Compra</h2>
            <form id="formCompra">
                <label for="nombre">Nombre:</label>
                <input type="text" id="nombre" required>
                
                <label for="direccion">Dirección:</label>
                <input type="text" id="direccion" required>
    
                <label for="tipoTarjeta">Tipo de Tarjeta:</label>
                <select id="tipoTarjeta" required>
                    <option value="Visa">Visa</option>
                    <option value="Mastercard">Mastercard</option>
                    <option value="Amex">American Express</option>
                </select>
    
                <label for="numeroTarjeta">Número de Tarjeta:</label>
                <input type="text" id="numeroTarjeta" pattern="[0-9]{16}" placeholder="16 dígitos" required>
    
                <label for="claveTarjeta">Clave de Tarjeta (CVV):</label>
                <input type="password" id="claveTarjeta" pattern="[0-9]{3,4}" placeholder="3 o 4 dígitos" required>
    
                <button type="submit">Confirmar Compra</button>
                <button type="button" id="cerrar-modal-compra">Cancelar</button>
            </form>
        </div>
    `;
    document.body.appendChild(modalCompra);

    const cerrarModalCompra = document.getElementById("cerrar-modal-compra");
    const formCompra = document.getElementById("formCompra");
    // Asegurar que el botón de cerrar esté dentro del formulario
    const btnCerrarLogin = document.createElement("button");
    btnCerrarLogin.textContent = "Cerrar";
    btnCerrarLogin.id = "cerrar-modal-login";
    btnCerrarLogin.type = "button";
    
    formLogin.appendChild(btnCerrarLogin);

    btnCerrarLogin.addEventListener("click", () => {
        modalLogin.style.display = "none";
    });

    window.addEventListener("click", (event) => {
        if (event.target === modalLogin) {
            modalLogin.style.display = "none";
        }
    });


    const btnComprar = document.createElement("button");
    btnComprar.textContent = "Comprar";
    btnComprar.classList.add("btn-comprar");
    btnComprar.addEventListener("click", () => {
        modalCarrito.style.display = "none";
        modalCompra.style.display = "block";
    });

    let carrito = [];

    const cargarProductos = async () => {
        try {
            const response = await fetch('/productos');
            if (!response.ok) throw new Error(`Error al cargar productos: ${response.statusText}`);

            const productos = await response.json();
            renderizarProductos(productos);

            buscador.addEventListener("input", (e) => {
                const query = e.target.value.toLowerCase();
                const productosFiltrados = productos.filter(producto =>
                    producto.nombre.toLowerCase().includes(query) ||
                    producto.descripcion.toLowerCase().includes(query)
                );
                renderizarProductos(productosFiltrados);
            });

        } catch (error) {
            console.error(error);
            contenedorProductos.innerHTML = '<p>Error al cargar los productos.</p>';
        }
    };
    cerrarModalCompra.addEventListener("click", () => {
        modalCompra.style.display = "none";
    });
    
    // **Evento para procesar la compra**
    formCompra.addEventListener("submit", (event) => {
        event.preventDefault();
    
        Swal.fire("Compra realizada con éxito").then(() => {
            modalCompra.style.display = "none";
            carrito = [];
            actualizarCarrito();
    
            // **Vaciar los campos del formulario**
            formCompra.reset();
        });
    });

    const renderizarProductos = (productos) => {
        contenedorProductos.innerHTML = "";
        productos.forEach(producto => {
            const productoDiv = document.createElement("div");
            productoDiv.classList.add("producto");

            productoDiv.innerHTML = `
                <h2>${producto.nombre}</h2>
                <p>${producto.descripcion}</p>
                <p>Precio: $${producto.precio}</p>
                <button data-id="${producto.id}" data-nombre="${producto.nombre}" data-precio="${producto.precio}" class="btn-agregar">Agregar al carrito</button>
            `;
            contenedorProductos.appendChild(productoDiv);
        });

        document.querySelectorAll(".btn-agregar").forEach(boton => {
            boton.addEventListener("click", () => {
                const id = parseInt(boton.dataset.id);
                const nombre = boton.dataset.nombre;
                const precio = parseFloat(boton.dataset.precio);
                agregarAlCarrito(id, nombre, precio);
            });
        });
    };

    const agregarAlCarrito = (id, nombre, precio) => {
        carrito.push({ id, nombre, precio });
        actualizarCarrito();
        Swal.fire("Producto agregado al carrito.");
    };

    const actualizarCarrito = () => {
        carritoCounter.textContent = carrito.length;
        renderizarCarrito();
    };
    
    const renderizarCarrito = () => {
        productosModal.innerHTML = "";
    
        let total = 0;
    
        carrito.forEach((producto, index) => {
            total += producto.precio;
    
            const item = document.createElement("div");
            item.classList.add("producto-carrito");
    
            item.innerHTML = `
                <p>${producto.nombre} - $${producto.precio.toFixed(2)}</p>
                <button class="btn-eliminar" data-index="${index}">Eliminar</button>
            `;
    
            productosModal.appendChild(item);
        });
        document.addEventListener("DOMContentLoaded", () => {
            const modalLogin = document.getElementById("modal-login");
            const btnCerrarLogin = document.getElementById("cerrar-modal-login");
        
            if (btnCerrarLogin) {
                btnCerrarLogin.addEventListener("click", () => {
                    modalLogin.style.display = "none";
                });
            }
        
            window.addEventListener("click", (event) => {
                if (event.target === modalLogin) {
                    modalLogin.style.display = "none";
                }
            });
        });
        
        totalSuma.textContent = `Total: $${total.toFixed(2)}`;

        document.querySelectorAll(".btn-eliminar").forEach(boton => {
            boton.addEventListener("click", () => {
                const index = boton.dataset.index;
                carrito.splice(index, 1);
                actualizarCarrito();
            });
        });

        if (!productosModal.contains(btnComprar)) {
            productosModal.appendChild(btnComprar);
        }
    };

    btnCarrito.addEventListener("click", () => modalCarrito.style.display = "block");
    cerrarModalCarrito.addEventListener("click", () => modalCarrito.style.display = "none");
    cerrarModalCompra.addEventListener("click", () => modalCompra.style.display = "none");
    btnCerrarLogin.addEventListener("click", () => modalLogin.style.display = "none");

    formCompra.addEventListener("submit", (event) => {
        event.preventDefault();
        Swal.fire("Compra realizada con éxito");
        modalCompra.style.display = "none";
        carrito = [];
        actualizarCarrito();
    });

    if (cerrarModalCompra) {
        cerrarModalCompra.addEventListener("click", () => {
            modalCompra.style.display = "none";
        });
    }

    formCompra.addEventListener("submit", (event) => {
        event.preventDefault();
        Swal.fire("Compra realizada con éxito");
        modalCompra.style.display = "none";
        carrito = [];
        actualizarCarrito();
    });

    if (btnIniciarSesion) {
        btnIniciarSesion.addEventListener("click", () => {
            modalLogin.style.display = "block";
        });
    }

    window.addEventListener("click", (event) => {
        if (event.target === modalLogin) {
            modalLogin.style.display = "none";
        }
    });

    formLogin.addEventListener("submit", async function(event) {
        event.preventDefault();
    
        const usuario = document.getElementById("usuario").value.trim();
        const password = document.getElementById("password").value.trim();
    
        if (!usuario || !password) {
            Swal.fire("Por favor ingresa tus credenciales");
            return;
        }
    
        const data = { usuario, password };
        
    
        try {
            const response = await fetch("http://127.0.0.1:5000/login", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });
    
            if (!response.ok) {
                throw new Error(`Error en la solicitud: ${response.status} ${response.statusText}`);
            }
    
            const res = await response.json();
    
            if (res.mensaje === "Acceso concedido") {
                Swal.fire("Inicio de sesión exitoso").then(() => {
                    modalLogin.style.display = "none";
                    window.location.href = "/admin";
                });
            } else {
                Swal.fire("Usuario o contraseña incorrectos");
            }
        } catch (error) {
            console.error("Error en el login:", error);
            Swal.fire("No se pudo iniciar sesión");
        }
    });

    cargarProductos();
});

