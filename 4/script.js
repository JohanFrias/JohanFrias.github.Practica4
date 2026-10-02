let datosMenu = [];



function cargarMenu() {

    fetch("menu.php")
        .then(respuesta => respuesta.json())
        .then(datos => {

            datosMenu = datos.menu;

            mostrarMenu();
            mostrarAdministracion();

        })
        .catch(error => {
            console.error("Error:", error);
        });
}


// Mostrar menu
function mostrarMenu() {

    const menu = document.getElementById("menu");

    menu.innerHTML = "";

    datosMenu.forEach(opcion => {

        const li = document.createElement("li");

        if (opcion.submenu) {

            const boton = document.createElement("button");

            boton.textContent = opcion.nombre;

            const sublista = document.createElement("ul");

            opcion.submenu.forEach(subopcion => {

                const subli = document.createElement("li");

                const enlace = document.createElement("a");

                enlace.textContent = subopcion.nombre;
                enlace.href = subopcion.enlace;

                subli.appendChild(enlace);
                sublista.appendChild(subli);

            });

            boton.addEventListener("click", () => {

                sublista.classList.toggle("mostrar");

            });

            li.appendChild(boton);
            li.appendChild(sublista);

        } else {

            const enlace = document.createElement("a");

            enlace.textContent = opcion.nombre;
            enlace.href = opcion.enlace;

            li.appendChild(enlace);
        }

        menu.appendChild(li);
    });
}


// Mostrar opciones 
function mostrarAdministracion() {

    const lista = document.getElementById("listaOpciones");

    lista.innerHTML = "";

    datosMenu.forEach(opcion => {

        const div = document.createElement("div");

        div.classList.add("opcion-admin");

        div.innerHTML = `
            <span>
                ${opcion.nombre}
            </span>

            <button onclick="modificarOpcion(${opcion.id})">
                Modificar
            </button>

            <button onclick="eliminarOpcion(${opcion.id})">
                Eliminar
            </button>
        `;

        lista.appendChild(div);
    });
}


// Agregar
document.getElementById("formMenu").addEventListener("submit", function(event) {

    event.preventDefault();

    const nombre = document.getElementById("nombreMenu").value.trim();
    const enlace = document.getElementById("enlaceMenu").value.trim();

    if (!enlaceValido(enlace)) {

        mostrarMensaje("El enlace no es válido.");

        return;
    }

    const formulario = new FormData();

    formulario.append("accion", "agregar");
    formulario.append("nombre", nombre);
    formulario.append("enlace", enlace);

    fetch("menu.php", {
        method: "POST",
        body: formulario
    })
    .then(respuesta => respuesta.json())
    .then(datos => {

        if (datos.error) {

            mostrarMensaje(datos.error);

            return;
        }

        datosMenu = datos.menu;

        mostrarMenu();
        mostrarAdministracion();

        document.getElementById("formMenu").reset();

        mostrarMensaje(datos.mensaje);

    });

});


// Eliminar
function eliminarOpcion(id) {

    if (!confirm("¿Desea eliminar esta opción?")) {
        return;
    }

    const formulario = new FormData();

    formulario.append("accion", "eliminar");
    formulario.append("id", id);

    fetch("menu.php", {
        method: "POST",
        body: formulario
    })
    .then(respuesta => respuesta.json())
    .then(datos => {

        datosMenu = datos.menu;

        mostrarMenu();
        mostrarAdministracion();

        mostrarMensaje(datos.mensaje);

    });
}


// Modificar
function modificarOpcion(id) {

    const opcion = datosMenu.find(item => item.id === id);

    if (!opcion) {
        return;
    }

    const nuevoNombre = prompt(
        "Nuevo nombre:",
        opcion.nombre
    );

    if (nuevoNombre === null || nuevoNombre.trim() === "") {
        return;
    }

    const nuevoEnlace = prompt(
        "Nuevo enlace:",
        opcion.enlace
    );

    if (nuevoEnlace === null || nuevoEnlace.trim() === "") {
        return;
    }

    if (!enlaceValido(nuevoEnlace)) {

        mostrarMensaje("El enlace no es válido.");

        return;
    }

    const formulario = new FormData();

    formulario.append("accion", "modificar");
    formulario.append("id", id);
    formulario.append("nombre", nuevoNombre);
    formulario.append("enlace", nuevoEnlace);

    fetch("menu.php", {
        method: "POST",
        body: formulario
    })
    .then(respuesta => respuesta.json())
    .then(datos => {

        datosMenu = datos.menu;

        mostrarMenu();
        mostrarAdministracion();

        mostrarMensaje(datos.mensaje);

    });
}


// Validacion
function enlaceValido(enlace) {

    return enlace.startsWith("#") ||
           enlace.startsWith("https://");
}


// Mostrar mensaje
function mostrarMensaje(mensaje) {

    document.getElementById("mensajeMenu").textContent = mensaje;
}


cargarMenu();