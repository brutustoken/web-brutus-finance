// Función global para manejar los includes y el año
function cargarComponentes() {
    // Se ejecuta automáticamente en cualquier página que tenga el id "anio"
    function updateYear() {
        const elementAnio = document.getElementById("year");
        if (elementAnio) {
            elementAnio.innerText = new Date(Date.now()).getFullYear().toString();

        }
    }

    updateYear()

}

// Ejecutar al cargar la página
window.onload = cargarComponentes;