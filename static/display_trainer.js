// [DONE] Funzione che inserisce le informazioni dell'utente ritornate dalla API nei vari text field
function displayTrainer() {
   const request_trainer = new XMLHttpRequest();
   request_trainer.open('GET', '/api/datiAllenatore', true);
   request_trainer.send();
   request_trainer.onload = function () {
      let data = JSON.parse(this.response);

      let nome = document.getElementById("anome");
      let cognome = document.getElementById("acognome");
      let eta = document.getElementById("aetà");
      let certificazione = document.getElementById("acertificazione");

      nome.innerText = data.nome;
      cognome.innerText = data.cognome;
      eta.innerText = data.eta;
      certificazione.innerText = data.certificazione;
   }
}