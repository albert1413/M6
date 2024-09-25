// Funció per obtenir dades de l'API de CoinGecko
function obtenirDadesCrypto() {
    // Fem la petició a l'API
    fetch('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd')
      .then(function(resposta) {
        return resposta.json();  // Convertim la resposta a JSON
      })
      .then(function(dades) {
        // Guardem les dades al localStorage
        localStorage.setItem('cryptoDades', JSON.stringify(dades));
  
        // Mostrem les dades a la pàgina utilitzant DataTables
        mostrarDades();
      });
  }
  
  // Funció per mostrar les dades a la taula utilitzant DataTables
  function mostrarDades() {
    // Recuperem les dades del localStorage
    var dades = localStorage.getItem('cryptoDades');
    // Convertim les dades de nou a un objecte JavaScript
    dades = JSON.parse(dades);
  
    if (dades) {
      // Taula HTML amb DataTables
      $('#crypto-table').DataTable({
        data: dades, // Les dades a mostrar
        columns: [
          { data: 'name' },            // Columna pel nom de la criptomoneda
          { data: 'current_price' },   // Columna pel preu en USD
          { data: 'market_cap' },       // Columna per la capitalització de mercat
          { data: null,            // COlumna pel boto eliminar
            render: function (data, type, row, meta) {
                return '<button class="eliminar-btn" data-index="' + meta.row + '">Eliminar</button>';
            }
          }
        ],
        destroy: true  // Permet reinicialitzar la taula si es crida múltiples vegades
      });
      $('#crypto-table tbody').on('click', '.eliminar-btn', function() {
        // Obtenim l'índex de la fila seleccionada
        var index = $(this).attr('data-index');
  
        // Eliminem el registre de les dades
        dades.splice(index, 1);
  
        // Actualitzem el localStorage amb les dades actualitzades
        localStorage.setItem('cryptoDades', JSON.stringify(dades));
  
        // Actualitzem la taula
        mostrarDades();
      });
    } else {
      console.log('No hi ha dades disponibles.');
    }
  }
  // Quan es carrega la pàgina, obtenim les dades
  obtenirDadesCrypto();
  