let productIdCounter = 2; // Contador para IDs de productos

// Función para añadir una línea (fila) a la tabla de objetos
function afegirLinia() {
    const table = document.querySelector('#table tbody');
    const row = document.createElement('tr');

    // Asignar un ID único a cada nueva fila
    row.id = `product-${productIdCounter}`;

    row.innerHTML = `
        <td>${productIdCounter}</td>
        <td><input type="text" placeholder="Objecte"></td>
        <td><input type="number" value="1" oninput="calcularTotal()"></td>
        <td><input type="number" value="0" step="0.01" oninput="calcularTotal()"></td>
        <td>0.00</td>
        <td><button class="btn-eliminar" onclick="eliminarLinia(${productIdCounter})">X</button></td>
    `;
    table.appendChild(row);
    productIdCounter++; // Incrementar el contador
}

// Función para eliminar una línea (fila) de la tabla
function eliminarLinia(id) {
    const row = document.getElementById(`product-${id}`);
    if (row) {
        row.remove();
        calcularTotal();  // Recalcular el total después de eliminar una fila
    }
}

// Función para calcular el total de la factura
function calcularTotal() {
    let total = 0;
    document.querySelectorAll('#table tbody tr').forEach((row) => {
        const quantitat = parseFloat(row.children[2].children[0].value) || 0;
        const preu = parseFloat(row.children[3].children[0].value) || 0;
        const subtotal = quantitat * preu;
        row.children[4].textContent = subtotal.toFixed(2);
        total += subtotal;
    });

    const descompte = parseFloat(document.getElementById('descompte').value) || 0;
    total -= total * (descompte / 100);

    document.getElementById('totalFactura').textContent = total.toFixed(2);
}

// Función para guardar la factura en el localStorage
function guardarFactura() {
    const clientNom = document.getElementById('clientNom').value;
    const adreca = document.getElementById('adreca').value;
    const ciutat = document.getElementById('ciutat').value;
    const facturaNo = document.getElementById('facturaNo').value;
    const dataFactura = document.getElementById('dataFactura').value;
    const dueData = document.getElementById('dueData').value;
    const formaPagat = document.getElementById('formaPagat').value;
    const totalFactura = document.getElementById('totalFactura').innerText;
    const estat = 'Pending';  // Estado predeterminado

    const factura = {
        clientNom,
        adreca,
        ciutat,
        facturaNo,
        dataFactura,
        dueData,
        formaPagat,
        totalFactura,
        estat
    };

    // Guardar en localStorage
    let factures = JSON.parse(localStorage.getItem('factures')) || [];
    factures.push(factura);
    localStorage.setItem('factures', JSON.stringify(factures));

    alert('Factura guardada!');
}
