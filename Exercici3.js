// Funció per obtenir dades de l'API de CoinGecko
function obtenirDadesCrypto() {
    // Comprovem si ja tenim dades al localStorage
    var dades = localStorage.getItem('cryptoDades');
    
    if (!dades) {
        // Si no hi ha dades, fem la petició a l'API
        fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
            .then(function(resposta) {
                return resposta.json();  // Convertim la resposta a JSON
            })
            .then(function(dades) {
                // Guardem les dades al localStorage
                localStorage.setItem('cryptoDades', JSON.stringify(dades));

                // Mostrem les dades a la pàgina utilitzant DataTables
                mostrarDades();
            })
            .catch(function() {
                mostrarFeedback('Error en obtenir dades de l\'API.', 'error');
            });
    } else {
        // Si hi ha dades, simplement les mostrem
        mostrarDades();
    }
}

// Funció per mostrar les dades a la taula utilitzant DataTables
function mostrarDades() {
    // Recuperem les dades del localStorage
    var dades = JSON.parse(localStorage.getItem('cryptoDades'));

    if (dades) {
        // Inicialitzem la taula amb DataTables
        var taula = $('#crypto-table').DataTable({
            data: dades, // Les dades a mostrar
            columns: [
                { data: 'name' },            // Columna pel nom de la criptomoneda
                { data: 'current_price' },   // Columna pel preu en USD
                { data: 'market_cap' },      // Columna per la capitalització de mercat
                { 
                    data: null,                // Columna pel botó "Eliminar"
                    render: function(data, type, row, meta) {
                        return '<button class="eliminar-btn" data-index="' + meta.row + '">Eliminar</button>';
                    }
                }
            ],
            destroy: true  // Permet reinicialitzar la taula si es crida múltiples vegades
        });

        // Afegim l'event listener per eliminar una fila
        $('#crypto-table tbody').on('click', '.eliminar-btn', function() {
            // Obtenim l'índex de la fila seleccionada
            var index = $(this).attr('data-index');

            // Eliminem la fila de la taula sense afectar el localStorage
            taula.row($(this).parents('tr')).remove().draw(); // Elimina la fila de la taula

            // Mostrem un missatge de confirmació
            mostrarFeedback('Registre eliminat correctament.', 'success');
        });
    } else {
        mostrarFeedback('No hi ha dades disponibles.', 'error');
    }
}

// Funció per mostrar missatges de retroalimentació
function mostrarFeedback(missatge, tipus) {
    var feedback = $('#feedback');
    feedback.removeClass('success error'); // Eliminem classes anteriors
    feedback.addClass(tipus); // Afegim la classe corresponent
    feedback.text(missatge); // Assignem el missatge
    feedback.show(); // Mostrem el missatge
    setTimeout(function() {
        feedback.hide(); // Ocultem el missatge després de 3 segons
    }, 3000);
}

// Quan es carrega la pàgina, obtenim les dades
obtenirDadesCrypto();
