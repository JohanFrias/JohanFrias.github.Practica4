let datosMenu = [];

const claveMenu = "menuLaProfe";


function cargarMenu() {


const menuGuardado = localStorage.getItem(claveMenu);

// Si ya existen datos guardados, utilizarlos
if (menuGuardado) {

    datosMenu = JSON.parse(menuGuardado);

    mostrarMenu();
    mostrarAdministracion();

    return;
}

// si no, cargarlos
fetch("menu.json")
    .then(respuesta => {

        if (!respuesta.ok) {
            throw new Error("No se pudo cargar menu.json");
        }

        return respuesta.json();
    })
    .then(datos => {

        datosMenu = datos.menu;

        guardarMenu();

        mostrarMenu();
        mostrarAdministracion();

    })
    .catch(error => {

        console.error("Error:", error);

    });


}

// Guardar menu 
function guardarMenu() {


localStorage.setItem(
    claveMenu,
    JSON.stringify(datosMenu)
);


}


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

// Mostrar opciones de administración
function mostrarAdministracion() {


const lista = document.getElementById("listaOpciones");

lista.innerHTML = "";

datosMenu.forEach(opcion => {

    const div = document.createElement("div");

    div.classList.add("opcion-admin");

    const nombre = document.createElement("span");

    nombre.textContent = opcion.nombre;

    const botonModificar = document.createElement("button");

    botonModificar.textContent = "Modificar";

    botonModificar.addEventListener("click", () => {
        modificarOpcion(opcion.id);
    });

    const botonEliminar = document.createElement("button");

    botonEliminar.textContent = "Eliminar";

    botonEliminar.addEventListener("click", () => {
        eliminarOpcion(opcion.id);
    });

    div.appendChild(nombre);
    div.appendChild(botonModificar);
    div.appendChild(botonEliminar);

    lista.appendChild(div);
});


}

// Agregar nueva opcion
document.getElementById("formMenu").addEventListener("submit", function(event) {


event.preventDefault();

const nombre = document
    .getElementById("nombreMenu")
    .value
    .trim();

const enlace = document
    .getElementById("enlaceMenu")
    .value
    .trim();


if (nombre === "" || enlace === "") {

    mostrarMensaje("Debe completar todos los campos.");

    return;
}


if (!enlaceValido(enlace)) {

    mostrarMensaje("El enlace no es válido.");

    return;
}


// Verificar que no exista el mismo nombre
const existe = datosMenu.some(opcion =>
    opcion.nombre.toLowerCase() === nombre.toLowerCase()
);


if (existe) {

    mostrarMensaje("Ya existe una opción con ese nombre.");

    return;
}


// Generar ID unico
const nuevoId = generarId();


const nuevaOpcion = {

    id: nuevoId,

    nombre: nombre,

    enlace: enlace
};


datosMenu.push(nuevaOpcion);


guardarMenu();

mostrarMenu();

mostrarAdministracion();


document.getElementById("formMenu").reset();


mostrarMensaje("Opción agregada correctamente.");


});

// ELIMINAR
function eliminarOpcion(id) {


const confirmar = confirm(
    "¿Está seguro de eliminar esta opción?"
);


if (!confirmar) {
    return;
}


datosMenu = datosMenu.filter(opcion =>
    opcion.id !== id
);


guardarMenu();

mostrarMenu();

mostrarAdministracion();


mostrarMensaje("Opción eliminada correctamente.");


}

// Modificar opción
function modificarOpcion(id) {


const opcion = datosMenu.find(item =>
    item.id === id
);


if (!opcion) {
    return;
}


const nuevoNombre = prompt(
    "Nuevo nombre:",
    opcion.nombre
);


if (
    nuevoNombre === null ||
    nuevoNombre.trim() === ""
) {
    return;
}


const nuevoEnlace = prompt(
    "Nuevo enlace:",
    opcion.enlace
);


if (
    nuevoEnlace === null ||
    nuevoEnlace.trim() === ""
) {
    return;
}


if (!enlaceValido(nuevoEnlace)) {

    mostrarMensaje("El enlace no es válido.");

    return;
}


opcion.nombre = nuevoNombre.trim();

opcion.enlace = nuevoEnlace.trim();


guardarMenu();

mostrarMenu();

mostrarAdministracion();


mostrarMensaje("Opción modificada correctamente.");


}

// Generar ID único
function generarId() {


let id;

do {

    id = Date.now();

} while (
    datosMenu.some(opcion => opcion.id === id)
);

return id;

}

// Validar
function enlaceValido(enlace) {


return (
    enlace.startsWith("#") ||
    enlace.startsWith("https://")
);


}


function mostrarMensaje(mensaje) {


document.getElementById(
    "mensajeMenu"
).textContent = mensaje;


}

// CARGAR MENÚ AL INICIAR
cargarMenu();
