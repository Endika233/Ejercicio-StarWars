//    Personajes de Star Wars por planeta

//1 - Utilizar la base de datos de Star Wars(disponible en https://swapi.co/documentation), 
//    para obtener la lista de planetas y mostrarlos en un dropdown(etiqueta select).
//2 - Cuando el usuario elige una(buscar documentación de un evento que se ejecuta al cambiar 
//    el item del dropdown seleccionado, mostrar un alert con el planeta seleccionado.
//3 - En vez de mostrar el alert, hacer una petición de http para ver los personajes que están en ese planeta y 
//    mostrarlos en un div debajo del dropdown.
//4 - Crea un enlace dentro de cada uno de los personajes, debería llevarte a otro HTML, y al llegar a la otra 
//    página se muestra la información de ese personaje.
//https://swapi.co/api/planets/ Lista de planetas
let dropdown = document.getElementById("planets");
if (dropdown!== null) {
    dropdown.addEventListener("change", charactersOnPlanet);
}
(function () {////TODO: en el html2 da error porque has puesto autoejecutables
    let xhr = new XMLHttpRequest();
    let urlPlanets = "https://swapi.co/api/planets/";
    xhr.open("GET", urlPlanets);
    xhr.send();
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let planets = JSON.parse(xhr.response).results;
            dropdownPlanets(planets);
        }
    };
}())
function dropdownPlanets(planets) {
    planets.forEach(function (x) {
        document.getElementById("planets").innerHTML += "<option>" + x.name + "</option>";
    });
}
//Parte 3
function charactersOnPlanet() {
    let planetName = document.getElementById("planets").value;
    let xhr = new XMLHttpRequest();
    let urlPlanets = "https://swapi.co/api/planets/?search=";
    urlPlanets += planetName;
    xhr.open("GET", urlPlanets)
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            let charactersUrl = JSON.parse(xhr.response).results[0].residents;//Results en un array(de un solo valor en este caso),asi que hay que darle posicion de la que quieres coger datos, si fuera de varios con un forEach
            if (charactersUrl.length === 0) {
                document.getElementById("charactersShow").innerHTML = "No se encuentran datos de ningún residente en " + planetName;
            }
            else if (charactersUrl.length >= 0) {
                anchorCharacters(charactersUrl);
            }
        }
    }
    xhr.send();
}
function anchorCharacters(charactersUrl) {
    document.getElementById("charactersShow").innerHTML = "";//Para borrar el mensaje anterior
    let personsArray = [];
    let cont = 0;
    let tope = charactersUrl.length;
    let xhr = new XMLHttpRequest();
    xhr.open("GET", charactersUrl[cont]);
    xhr.onreadystatechange = function () {//Luego, con send(); vuelves al readystatechange
        if (xhr.readyState === 4 && xhr.status === 200) {
            cont++;
            let character = JSON.parse(xhr.response);
            personsArray.push(character);
            document.getElementById("charactersShow").innerHTML += "<p><a onclick=\"nameToLocal('"+ character.name +"')\">" + character.name + "</a></p>";
            if (cont < tope) {
                xhr.open("GET", charactersUrl[cont]);
                xhr.send();
            }
            else if (cont === tope) {
                personsToLocal(personsArray);
            }
        }       
    }
    xhr.send();
}
//Parte 4//TODO:Has intentado llevar un objeto al html y no se puede
function nameToLocal(name) {//Mirar los onclick, a veces al meter varias comillas simples se vuelve loco y mete espacios y demas
    localStorage.setItem("name", JSON.stringify(name));
    window.location.href = "HTMLPage2.html";
}
function personsToLocal(persons){
    localStorage.setItem("persons", JSON.stringify(persons));
}
if (dropdown === null) {
    let name = JSON.parse(localStorage.getItem("name"));
    showPerson(getPerson(name));
}
function getPerson(name) {
    let persons = JSON.parse(localStorage.getItem("persons"));
    for (var i = 0; i < persons.length; i++) {
        if (persons[i].name === name) {
            return persons[i];
        }
    }
    //persons.forEach(function (x) {//El forEach no se puede romper con un return, usar for
    //    if (x.name === name) {
    //        return x;
    //    }
    //});
}
function showPerson(person) {
    document.getElementById("showPerson").innerHTML = "<p> Name: " + person.name + "</p>" + "<p> Height: " + person.height + "</p>" + "<p> Mass: " + person.mass + "</p>" + "<p> Hair Color: " + person.hair_color + "</p>" + "<p> Skin Color: " + person.skin_color + "</p>" + "<p> Eye Color: " + person.eye_color + "</p>" + "<p> Birth Year: " + person.birth_year + "</p>";
}


////Parte 2(asignar al onchange del select esta funcion)
//function planetAlert() {
//    let planetName = document.getElementById("planets").value;
//    alert(planetName);
//}

