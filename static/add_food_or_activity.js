let request = new XMLHttpRequest();

function addMeal() {
   const field1 = document.getElementById('nome-alimento');
   var nome = field1.value;
   const field2 = document.getElementById('quantità-alimento');
   var quantità = field2.value;

   request.open('POST', "/api/cronologia_alimentazione/" + nome + "/" + quantità, true);
   request.send();
}

function addActivity() {
   var attività = {
      "nome": document.getElementById('nome-allenamento').value,
      "tempo": document.getElementById('tempo-allenamento').value,
      "energia_bruciata": document.getElementById('energia-allenamento').value
   }

   request.open("POST", "/api/cronologia_allenamento/", true);
   request.setRequestHeader("Content-Type", "application/json");
   var data = JSON.stringify(attività);

   request.send(data);
}
