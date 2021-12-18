function loadMealHistory(){

   const request = new XMLHttpRequest();

   request.open('GET', '/api/cronologia_alimentazione', true);
   request.send();

   request.onload=function(){
      let data=JSON.parse(this.response);

      const tmplt = document.getElementById('row_cibo');
      const tabella = document.getElementById('tableBody_cibo');

      if(request.status>=200 && request.status<400){

         data.forEach(element => {
            let clone = tmplt.content.cloneNode(true);

            let nomeClonato=clone.getElementById('nome');
            let quantitaClonato=clone.getElementById('quantita');
            let energiaClonato=clone.getElementById('energia');
            let grassiClonato=clone.getElementById('grassi');
            let carboidratiClonato=clone.getElementById('carboidrati');
            let proteineClonato=clone.getElementById('proteine');
            let fibreaClonato=clone.getElementById('fibre');
            let ferroClonato=clone.getElementById('ferro');
            let iodioClonato=clone.getElementById('iodio');
            let magnesioClonato=clone.getElementById('magnesio');
            let dataClonato=clone.getElementById('data');

            nomeClonato.innerHTML = element.nome;
            quantitaClonato.innerHTML = element.quantita;
            energiaClonato.innerHTML = element.energia;
            grassiClonato.innerHTML=element.grassi;
            carboidratiClonato.innerHTML=element.carboidrati;
            proteineClonato.innerHTML=element.proteine;
            fibreaClonato.innerHTML=element.fibre;
            ferroClonato.innerHTML=element.ferro;
            iodioClonato.innerHTML=element.iodio;
            magnesioClonato.innerHTML=element.magnesio;
            dataClonato.innerHTML=element.data;

            tabella.append(clone);
         });
      }
   }
}

function loadActivityHistory(){
   const request = new XMLHttpRequest();

   request.open('GET', '/api/cronologia_allenamento', true);
   request.send();

   request.onload=function(){
      let data=JSON.parse(this.response);

      const tmplt = document.getElementById('row_attivita');
      const tabella = document.getElementById('tableBody_attivita');

      if(request.status>=200 && request.status<400){

         data.forEach(element => {
            let clone = tmplt.content.cloneNode(true);

            let nomeClonato=clone.getElementById('nome');
            let tempoClonato=clone.getElementById('tempo');
            let energiaClonato=clone.getElementById('energia');
            let dataClonato=clone.getElementById('data');

            nomeClonato.innerHTML = element.nome;
            tempoClonato.innerHTML=element.tempo;
            energiaClonato.innerHTML=element.energia_bruciata;
            dataClonato.innerHTML=element.data;

            tabella.append(clone);
         });
      }
   }
}