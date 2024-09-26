// Funció per afegir una nova línia a la taula
function afegirLinia() {
    const taula = document.getElementById("table").getElementsByTagName('tbody')[0];
    const fila = taula.insertRow(); // Afegim una nova fila

    // Creem les cel·les i afegim els inputs en l'HTML directament
    const celObjecte = fila.insertCell(0); 
    const celQuantitat = fila.insertCell(1);
    const celPreu = fila.insertCell(2);
    const celTotal = fila.insertCell(3);
    const celEliminar = fila.insertCell(4);

    // Afegim els inputs directament des de l'HTML
    celObjecte.innerHTML = "<input type='text' placeholder='Objecte'>"; 
    celQuantitat.innerHTML = "<input type='number' value='1' oninput='calcularTotal()'>";
    celPreu.innerHTML = "<input type='number' value='0' step='0.01' oninput='calcularTotal()'>";
    celTotal.textContent = "0.00"; // Subtotal inicial
    celEliminar.innerHTML = "<button class = 'btn-eliminar' onclick='eliminarLinia(this)'>X</button>";
}

// Funció per eliminar una línia
function eliminarLinia(boto) {
    const fila = boto.parentNode.parentNode; // Trobem la fila de l'element
    fila.remove(); // Eliminem la fila
    calcularTotal(); // Recalculem el total després d'eliminar
}

// Funció per calcular el total de la factura
function calcularTotal() {
    const taula = document.getElementById('table').getElementsByTagName('tbody')[0];
    let total = 0;

    // Iterem per totes les files per calcular el subtotal
    for (let i = 0; i < taula.rows.length; i++) {
        const quantitat = taula.rows[i].cells[1].children[0].value; // Correcció de l'índex
        const preu = taula.rows[i].cells[2].children[0].value; // Correcció de l'índex
        const subtotal = quantitat * preu;

        // Actualitzem el subtotal de la fila
        taula.rows[i].cells[3].textContent = subtotal.toFixed(2); // Actualització correcta del subtotal
        total += subtotal; // Suma al total
    }

    // Aplicar descompte si n'hi ha
    const descompte = document.getElementById('descompte').value;
    const totalAmbDescompte = total - (total * (descompte / 100));

    // Actualitzar el total
    document.getElementById('totalFactura').textContent = totalAmbDescompte.toFixed(2);
}


