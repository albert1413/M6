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
  
        // Mostrem les dades a la pàgina
        mostrarDades();
      });
  }
  
  // Funció per mostrar les dades a la pàgina
  function mostrarDades() {
    // Recuperem les dades del localStorage
    var dades = localStorage.getItem('cryptoDades');
    // Convertim les dades de nou a un objecte JavaScript
    dades = JSON.parse(dades);
  
    var contenedor = document.getElementById('crypto-data');
  
    // Comprovem que hi hagi dades
    if (dades) {
      var html = '';  // Creem una cadena de text buida per afegir les dades
  
      // Per cada criptomoneda, afegim la informació a la cadena de text
      for (var i = 0; i < dades.length; i++) {
        html += '<p><strong>Nom:</strong> ' + dades[i].name + '<br>';
        html += '<strong>Preu:</strong> ' + dades[i].current_price + ' USD<br>';
        html += '<strong>Capitalització de Mercat:</strong> ' + dades[i].market_cap + ' USD</p>';
      }
  
      // Afegim el contingut HTML al div
      contenedor.innerHTML = html;
    } else {
      contenedor.innerHTML = 'No hi ha dades disponibles.';
    }
  }
  
  // Quan es carrega la pàgina, obtenim les dades
  obtenirDadesCrypto();
  