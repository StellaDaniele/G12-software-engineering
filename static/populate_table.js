function loadAlimentazione() {
   const request = new XMLHttpRequest();

   request.open('GET', '/api/riepilogo_alimentazione', true);
   request.send();

   request.onload = function () {
      let data = JSON.parse(this.response);

      const tmplt = document.getElementById('row_alimentazione');
      const tabella = document.getElementById('tabella_alimentazione');

      if (request.status >= 200 && request.status < 400) {
         data.forEach(meal => {
            let clone = tmplt.content.cloneNode(true);

            let nomeClonato = clone.getElementById('alimento');
            let quantitaClonata = clone.getElementById('quantita');
            let dataClonata = clone.getElementById('data');

            nomeClonato.innerHTML = meal.nome;
            quantitaClonata.innerHTML = meal.quantita;
            dataClonata.innerHTML = meal.data;

            tabella.append(clone);
         });
      }
   }
}

function loadAlenamento() {
   const request = new XMLHttpRequest();

   request.open('GET', '/api/riepilogo_allenamento', true);
   request.send();

   request.onload = function () {
      let data = JSON.parse(this.response);

      const tmplt = document.getElementById('row_attivita');
      const tabella = document.getElementById('tabella_attivita');

      if (request.status >= 200 && request.status < 400) {
         data.forEach(attivita => {
            let clone = tmplt.content.cloneNode(true);

            let nomeClonato = clone.getElementById('attivita');
            let quantitaClonata = clone.getElementById('durata');
            let dataClonata = clone.getElementById('data2');

            nomeClonato.innerHTML = attivita.nome;
            quantitaClonata.innerHTML = attivita.tempo;
            dataClonata.innerHTML = attivita.data;

            tabella.append(clone);
         });
      }
   }
}