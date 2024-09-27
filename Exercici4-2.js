let factures = JSON.parse(localStorage.getItem('factures')) || [];
let facturaEditIndex = -1;
let productes = [];

// Inicializar DataTable y mostrar facturas
$(document).ready(function() {
    mostrarFactures();
});

// Mostrar la tabla de factures
function mostrarFactures() {
    const facturesBody = document.getElementById('facturesBody');
    facturesBody.innerHTML = ''; // Limpiar el contenido

    factures.forEach((factura, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${factura.estat}</td>
            <td>${factura.facturaNo}</td>
            <td>${factura.dataFactura}</td>
            <td>${factura.dueData}</td>
            <td>${factura.clientNom}</td>
            <td>${factura.formaPagat}</td>
            <td>${factura.totalFactura}</td>
            <td>
                <button onclick="editarFactura(${index})">Editar</button>
                <button onclick="eliminarFactura(${index})">Eliminar</button>
            </td>
        `;
        facturesBody.appendChild(row);
    });

    $('#table2').DataTable();
}

// Mostrar el formulario para crear/editar factures
function mostrarFormFactura() {
    document.getElementById('facturesTable').classList.add('hidden');
    document.getElementById('formFactura').classList.remove('hidden');
    resetFormulario();  // Resetear el formulario
}

// Resetear el formulario a valores vacíos
function resetFormulario() {
    document.getElementById('clientNom').value = '';
    document.getElementById('adreca').value = '';
    document.getElementById('ciutat').value = '';
    document.getElementById('facturaNo').value = '';
    document.getElementById('dataFactura').value = '';
    document.getElementById('dueData').value = '';
    document.getElementById('formaPagat').value = '';
    productes = [];
    document.getElementById('productesBody').innerHTML = '';
    document.getElementById('descompte').value = 0;
    document.getElementById('totalFactura').innerText = '0.00';
    facturaEditIndex = -1;
    document.getElementById('formTitle').innerText = 'Crear Factura';
}

// Agregar un nuevo producto al formulario
function afegirProducte() {
    const producteRow = document.createElement('tr');
    producteRow.innerHTML = `
        <td><input type="text" placeholder="Producte"></td>
        <td><input type="number" value="1" min="1" oninput="calcularSubtotal(this)"></td>
        <td><input type="number" value="0" min="0" step="0.01" oninput="calcularSubtotal(this)"></td>
        <td>0.00</td>
        <td><button type="button" onclick="eliminarProducte(this)">X</button></td>
    `;
    document.getElementById('productesBody').appendChild(producteRow);
}

// Calcular el subtotal de un producto en la tabla
function calcularSubtotal(element) {
    const row = element.closest('tr');
    const quantitat = row.querySelector('input[type="number"]').value;
    const preu = row.querySelector('input[type="number"]:nth-child(3)').value;
    const subtotal = (quantitat * preu).toFixed(2);
    row.querySelector('td:nth-child(4)').innerText = subtotal;

    calcularTotal();
}

// Calcular el total de la factura con los productos y el descuento
function calcularTotal() {
    let total = 0;
    document.querySelectorAll('#productesBody tr').forEach(row => {
        const subtotal = parseFloat(row.querySelector('td:nth-child(4)').innerText);
        total += subtotal;
    });

    const descompte = parseFloat(document.getElementById('descompte').value) || 0;
    total = total - (total * (descompte / 100));
    document.getElementById('totalFactura').innerText = total.toFixed(2);
}

// Eliminar un producto del formulario
function eliminarProducte(button) {
    const row = button.closest('tr');
    row.remove();
    calcularTotal();
}

// Guardar la factura (nueva o editada)
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

    // Recopilar productos
    productes = [];
    document.querySelectorAll('#productesBody tr').forEach(row => {
        const producte = row.querySelector('td:nth-child(1) input').value;
        const quantitat = row.querySelector('td:nth-child(2) input').value;
        const preu = row.querySelector('td:nth-child(3) input').value;
        const subtotal = row.querySelector('td:nth-child(4)').innerText;
        productes.push({ producte, quantitat, preu, subtotal });
    });

    const factura = { estat, clientNom, adreca, ciutat, facturaNo, dataFactura, dueData, formaPagat, totalFactura, productes };

    // Guardar o actualizar la factura
    if (facturaEditIndex !== -1) {
        factures[facturaEditIndex] = factura;
    } else {
        factures.push(factura);
    }

    localStorage.setItem('factures', JSON.stringify(factures));

    // Mostrar nuevamente la tabla
    mostrarTablaFactures();
}

// Mostrar la tabla de factures y ocultar el formulario
function mostrarTablaFactures() {
    document.getElementById('formFactura').classList.add('hidden');
    document.getElementById('facturesTable').classList.remove('hidden');
    mostrarFactures();
}

// Cancelar y volver a la tabla sin guardar cambios
function cancelarFactura() {
    mostrarTablaFactures();
}

// Editar una factura existente
function editarFactura(index) {
    mostrarFormFactura();
    document.getElementById('formTitle').innerText = 'Editar Factura';
    facturaEditIndex = index;

    const factura = factures[index];
    document.getElementById('clientNom').value = factura.clientNom;
    document.getElementById('adreca').value = factura.adreca;
    document.getElementById('ciutat').value = factura.ciutat;
    document.getElementById('facturaNo').value = factura.facturaNo;
    document.getElementById('dataFactura').value = factura.dataFactura;
    document.getElementById('dueData').value = factura.dueData;
    document.getElementById('formaPagat').value = factura.formaPagat;
    document.getElementById('totalFactura').innerText = factura.totalFactura;

    // Mostrar los productos en la tabla del formulario
    document.getElementById('productesBody').innerHTML = '';
    factura.productes.forEach(producte => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><input type="text" value="${producte.producte}"></td>
            <td><input type="number" value="${producte.quantitat}" min="1" oninput="calcularSubtotal(this)"></td>
            <td><input type="number" value="${producte.preu}" min="0" step="0.01" oninput="calcularSubtotal(this)"></td>
            <td>${producte.subtotal}</td>
            <td><button type="button" onclick="eliminarProducte(this)">X</button></td>
        `;
        document.getElementById('productesBody').appendChild(row);
    });
}

// Eliminar una factura
function eliminarFactura(index) {
    factures.splice(index, 1);
    localStorage.setItem('factures', JSON.stringify(factures));
    mostrarFactures();
}
