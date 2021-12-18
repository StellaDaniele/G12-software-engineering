function addMeal(){
   console.log("Sono dentro");
   const input1 = document.getElementById('nome-alimento');
   const input2 = document.getElementById('quantità-alimento');
   
   const request = new XMLHttpRequest();

   request.open('POST', "/api/cronologia_alimentazione", true);

   request.send(JSON.stringify(input1));
}