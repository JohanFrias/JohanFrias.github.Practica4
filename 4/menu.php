<?php

header("Content-Type: application/json");

$archivo = "menu.json";

if (!file_exists($archivo)) {
    echo json_encode([
        "error" => "No se encontró el archivo menu.json"
    ]);
    exit;
}

$datos = json_decode(file_get_contents($archivo), true);

$accion = $_POST["accion"] ?? "";


// AGREGAR
if ($accion === "agregar") {

    $nombre = trim($_POST["nombre"] ?? "");
    $enlace = trim($_POST["enlace"] ?? "");

    if ($nombre === "" || $enlace === "") {
        echo json_encode([
            "error" => "Todos los campos son obligatorios"
        ]);
        exit;
    }

    // Verificar que el ID sea unico
    $ids = [];

    foreach ($datos["menu"] as $opcion) {
        $ids[] = $opcion["id"];

        if (isset($opcion["submenu"])) {
            foreach ($opcion["submenu"] as $subopcion) {
                $ids[] = $subopcion["id"];
            }
        }
    }

    do {
        $id = rand(1, 99999);
    } while (in_array($id, $ids));

    $nuevaOpcion = [
        "id" => $id,
        "nombre" => $nombre,
        "enlace" => $enlace
    ];

    $datos["menu"][] = $nuevaOpcion;

    file_put_contents(
        $archivo,
        json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
    );

    echo json_encode([
        "mensaje" => "Opción agregada correctamente",
        "menu" => $datos["menu"]
    ]);

    exit;
}


// ELIMINAR
if ($accion === "eliminar") {

    $id = intval($_POST["id"] ?? 0);

    foreach ($datos["menu"] as $posicion => $opcion) {

        if ($opcion["id"] == $id) {
            unset($datos["menu"][$posicion]);
        }
    }

    $datos["menu"] = array_values($datos["menu"]);

    file_put_contents(
        $archivo,
        json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
    );

    echo json_encode([
        "mensaje" => "Opción eliminada correctamente",
        "menu" => $datos["menu"]
    ]);

    exit;
}


// MODIFICAR
if ($accion === "modificar") {

    $id = intval($_POST["id"] ?? 0);
    $nombre = trim($_POST["nombre"] ?? "");
    $enlace = trim($_POST["enlace"] ?? "");

    if ($nombre === "" || $enlace === "") {
        echo json_encode([
            "error" => "Todos los campos son obligatorios"
        ]);
        exit;
    }

    foreach ($datos["menu"] as &$opcion) {

        if ($opcion["id"] == $id) {

            $opcion["nombre"] = $nombre;
            $opcion["enlace"] = $enlace;

            break;
        }
    }

    file_put_contents(
        $archivo,
        json_encode($datos, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE)
    );

    echo json_encode([
        "mensaje" => "Opción modificada correctamente",
        "menu" => $datos["menu"]
    ]);

    exit;
}


echo json_encode($datos);

?>