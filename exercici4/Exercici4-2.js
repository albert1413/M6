let factures = JSON.parse(localStorage.getItem('factures')) || [];
let facturaEditIndex = -1;
let productIdCounter = 1; 

// Mostrar factures
$(document).ready(function() {
    mostrarFactures();
});

function mostrarFactures() {
    const facturesBody = document.getElementById('facturesBody');
    facturesBody.innerHTML = ''; 

    factures.forEach((factura, index) => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td><select>
                <option value="Pendent">Pendent</option>
                <option value="Completat">Completat</option>
            </select></td>
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

// Mostrar el formulario
function mostrarFormFactura() {
    document.getElementById('facturesTable').classList.add('hidden');
    document.getElementById('formFactura').classList.remove('hidden');
    resetFormulario();  
}

// Resetear el formulario
function resetFormulario() {
    document.getElementById('clientNom').value = '';
    document.getElementById('adreca').value = '';
    document.getElementById('ciutat').value = '';
    document.getElementById('facturaNo').value = '';
    document.getElementById('dataFactura').value = '';
    document.getElementById('dueData').value = '';
    document.getElementById('formaPagat').value = '';
    document.getElementById('productesBody').innerHTML = '';
    document.getElementById('descompte').value = 0;
    document.getElementById('totalFactura').innerText = '0.00';
    facturaEditIndex = -1;
}

// Añadir producto
function afegirLinia() {
    const table = document.querySelector('#productesBody');
    const row = document.createElement('tr');
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
    productIdCounter++;
}

// Eliminar fila
function eliminarLinia(id) {
    const row = document.getElementById(`product-${id}`);
    if (row) {
        row.remove();
        calcularTotal();
    }
}

// Calcular total
function calcularTotal() {
    let total = 0;
    document.querySelectorAll('#productesBody tr').forEach((row) => {
        const quantitat = parseFloat(row.children[2].children[0].value) || 0;
        const preu = parseFloat(row.children[3].children[0].value) || 0;
        const subtotal = quantitat * preu;
        row.children[4].textContent = subtotal.toFixed(2);
        total += subtotal;
    });

    const descompte = parseFloat(document.getElementById('descompte').value) || 0;
    const totalAmbDescompte = total * ((100 - descompte) / 100);

    document.getElementById('totalFactura').textContent = totalAmbDescompte.toFixed(2);
}

// Guardar factura
function guardarFactura() {
    const clientNom = document.getElementById('clientNom').value;
    const adreca = document.getElementById('adreca').value;
    const ciutat = document.getElementById('ciutat').value;
    const facturaNo = document.getElementById('facturaNo').value;
    const dataFactura = document.getElementById('dataFactura').value;
    const dueData = document.getElementById('dueData').value;
    const formaPagat = document.getElementById('formaPagat').value;
    const totalFactura = document.getElementById('totalFactura').textContent;

    // Recoger los productos de la tabla
    const productes = [];
    document.querySelectorAll('#productesBody tr').forEach((row) => {
        const objecte = row.children[1].children[0].value;
        const quantitat = parseFloat(row.children[2].children[0].value) || 0;
        const preu = parseFloat(row.children[3].children[0].value) || 0;
        const subtotal = quantitat * preu;

        productes.push({
            objecte,
            quantitat,
            preu,
            subtotal: subtotal.toFixed(2)
        });
    });

    const factura = {
        clientNom,
        adreca,
        ciutat,
        facturaNo,
        dataFactura,
        dueData,
        formaPagat,
        totalFactura,
        productes,  // Productos de la factura
        estat: 'pendent'
    };

    // Verificar si la factura ya existe
    const existingFacturaIndex = factures.findIndex(f => f.facturaNo === facturaNo);

    if (existingFacturaIndex > -1) {
        // Si la factura existe, reemplazarla
        factures[existingFacturaIndex] = factura;
    } else {
        // Si no existe, añadirla como una nueva factura
        factures.push(factura);
    }

    // Guardar en localStorage
    localStorage.setItem('factures', JSON.stringify(factures));

    // Mostrar la lista de facturas y ocultar el formulario
    mostrarFactures();
    document.getElementById('facturesTable').classList.remove('hidden');
    document.getElementById('formFactura').classList.add('hidden');
}

function editarFactura(index) {
    facturaEditIndex = index;
    const factura = factures[index];
    
    mostrarFormFactura();
    
    document.getElementById('clientNom').value = factura.clientNom;
    document.getElementById('adreca').value = factura.adreca;
    document.getElementById('ciutat').value = factura.ciutat;
    document.getElementById('facturaNo').value = factura.facturaNo;
    document.getElementById('dataFactura').value = factura.dataFactura;
    document.getElementById('dueData').value = factura.dueData;
    document.getElementById('formaPagat').value = factura.formaPagat;
    document.getElementById('totalFactura').textContent = factura.totalFactura;

    // Limpiar las líneas de productos actuales antes de añadir las nuevas
    const productesBody = document.getElementById('productesBody');
    productesBody.innerHTML = '';

    // Rellenar los productos de la factura
    factura.productes.forEach((producte, i) => {
        const row = document.createElement('tr');
        row.id = `product-${i}`;
        row.innerHTML = `
            <td>${i + 1}</td>
            <td><input type="text" value="${producte.objecte}" placeholder="Objecte"></td>
            <td><input type="number" value="${producte.quantitat}" oninput="calcularTotal()"></td>
            <td><input type="number" value="${producte.preu}" step="0.01" oninput="calcularTotal()"></td>
            <td>${producte.subtotal}</td>
            <td><button class="btn-eliminar" onclick="eliminarLinia(${i})">X</button></td>
        `;
        productesBody.appendChild(row);
    });
}


function eliminarFactura(index) {
    factures.splice(index, 1);
    localStorage.setItem('factures', JSON.stringify(factures));
    mostrarFactures();
}
