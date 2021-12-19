function loadIntake() {
    loadEnergy();
    loadMicro();
    loadMacro();
}

function loadEnergy() {
    let energia_bruciata = 0;
    let energia_assunta = 0;
    let request_energia = new XMLHttpRequest();

    request_energia.open('GET', '/api/calorie_assunte', true);
    request_energia.send();
    request_energia.onload = function () {
        let data = JSON.parse(this.response);
        energia_assunta = parseFloat(data);
        let request_energia_bruciata=new XMLHttpRequest();
        request_energia_bruciata.open('GET', '/api/calorie_bruciate', true);
        request_energia_bruciata.send();
        request_energia_bruciata.onload = function () {
        let data = JSON.parse(this.response);
        energia_bruciata = parseFloat(data);
        let bilancio = energia_assunta - energia_bruciata;
        document.getElementById("bilancio-energetico").textContent = bilancio;
    }
    }
}

function loadMicro() {
    let ferro = 0;
    let iodio = 0;
    let magnesio = 0;
    let request_ferro = new XMLHttpRequest();
    request_ferro.open('GET', '/api/assunzione_giornaliera/ferro', true);
    request_ferro.send();
    request_ferro.onload = function () {
        let data = JSON.parse(this.response);
        ferro = parseFloat(data);
        document.getElementById("ferro").textContent = ferro;
    }

    let request_iodio = new XMLHttpRequest();
    request_iodio.open('GET', '/api/assunzione_giornaliera/iodio', true);
    request_iodio.send();
    request_iodio.onload = function () {
        let data = JSON.parse(this.response);
        iodio = parseFloat(data);
        document.getElementById("iodio").textContent = iodio;
    }

    let request_magnesio = new XMLHttpRequest();
    request_magnesio.open('GET', '/api/assunzione_giornaliera/magnesio', true);
    request_magnesio.send();
    request_magnesio.onload = function () {
        let data = JSON.parse(this.response);
        magnesio = parseFloat(data);
        document.getElementById("magnesio").textContent = magnesio;
    }

}

function loadMacro() {
    let carbs = 0;
    let proteins = 0;
    let fats = 0;
    let total = 0;

    let request_carbs = new XMLHttpRequest();
    request_carbs.open('GET', '/api/assunzione_giornaliera/carboidrati', true);
    request_carbs.send();
    request_carbs.onload = function () {
        let data = JSON.parse(this.response);
        carbs = parseFloat(data);
        total += carbs;
        //document.getElementById("ferro").textContent = ferro;
        let request_proteins = new XMLHttpRequest();
        request_proteins.open('GET', '/api/assunzione_giornaliera/proteine', true);
        request_proteins.send();
        request_proteins.onload = function () {
            let data = JSON.parse(this.response);
            proteins = parseFloat(data);
            total += proteins;
            //document.getElementById("ferro").textContent = ferro;
            let request_fats = new XMLHttpRequest();
            request_fats.open('GET', '/api/assunzione_giornaliera/grassi', true);
            request_fats.send();
            request_fats.onload = function () {
                let data = JSON.parse(this.response);
                fats = parseFloat(data);
                total += fats;

                document.getElementById("carb_value").style.width = parseFloat(carbs / total * 100) + '%';
                document.getElementById("prote_value").style.width = parseFloat(proteins / total * 100) + '%';
                document.getElementById("fat_value").style.width = parseFloat(fats / total * 100) + '%';
            }
        }

    }
}