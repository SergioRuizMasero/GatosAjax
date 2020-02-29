window.onload = inicio;

const urlRazasGatos =
  "https://api.thecatapi.com/v1/breeds";

const urlCategoriasGatos =
  "https://api.thecatapi.com/v1/categories";

const cat_input = document.getElementById('cat');
const raza_input = document.getElementById('raza');

var api_key="271a4443-418d-4bf3-ae50-7b478da7f770";

var imagenes = "";
var pagina = 1;
var maxImg = "";
var maxPg = "";
var cat = 'category';



function inicio(){
    
    selectorCatGatos();
    selectorRazGatos();
    
    document.getElementById("buscar").addEventListener("click", resultadoCat);
    
    
}

function MostrarImagenes(){
        
    document.getElementById('paginaAct').innerHTML = pagina+" de "+totalPag();
    
    var CantidadFotos = document.getElementById('select-CantidadFotos').value;
    maxPg = (maxImg/CantidadFotos).toFixed(0) - 1;
    var mostrar = CantidadFotos * pagina;
    
    if(totalPag() == pagina){ 
        
        document.getElementById('sig').style.display = 'none';
    
    } else {
        
        document.getElementById('sig').style.display = 'inline-block';
    }
    
    if(pagina == 1) {
        
        document.getElementById('ant').style.display = 'none';
    
    } else {
        
        document.getElementById('ant').style.display = 'inline-block';
    }
        
    document.getElementById('expositor').innerHTML = "";
    
    for(let c = mostrar-CantidadFotos ; c < mostrar && c < imagenes.length ; c++){
        
        if (imagenes.indexOf(c)){
            
            console.log(c)
            let img = "<img class='col-sm-10 col-md-4 col-lg-3' style='height: 20vh;' src='"+imagenes[c]["url"]+"'>";
            document.getElementById('expositor').innerHTML += img;
            
            }
    }
        
}

function selectorCatGatos() {
    
    cat_input.innerHTML = '<option value="">Ninguno</option>';
        
        getJSON(urlCategoriasGatos).then(function(data) {
            data.forEach(function(categoria) {
              option = document.createElement("option");
              option.setAttribute("value", categoria.id);
              option.innerHTML = categoria.name;
              cat_input.appendChild(option);
            });
        },
            function(status) {
                alert("Error.");
            });
        
}
    
function selectorRazGatos() {
    
    raza_input.innerHTML = '<option value="">Ninguno</option>';
        
        getJSON(urlRazasGatos).then(
          function(data) {
            data.forEach(function(raza) {
              option = document.createElement("option");
              option.setAttribute("value", raza.id);
              option.innerHTML = raza.name;
              raza_input.appendChild(option);
            });
          },
          function(status) {
            alert("Error.");
          }
        );   
}

// llámada asíncrona con AJAX para categorías
var getJSON = function(url) {
  return new Promise(function(resolve, reject) {
    var xhr = new XMLHttpRequest();
    xhr.open("get", url, true);
    xhr.responseType = "json";
    xhr.onload = function() {
      var status = xhr.status;
      if (status == 200) {
        resolve(xhr.response);
      } else {
        reject(status);
        console.log("algo fue mal");
      }
    };
    xhr.send();
  });
};

// El resto de funciones o lo que sea
function resultadoCat(){
    
    pagina = 1;
  // Crear request
    var xhr = new XMLHttpRequest();
 
  // Recoger los valores para la busqueda
    var razval = document.getElementById('raza').value;
    var catval = document.getElementById('cat').value;
    
    
    var urlBusqueda = 'https://api.thecatapi.com/v1/images/search?api_key=271a4443-418d-4bf3-ae50-7b478da7f770&limit=100&category_ids='+catval+'&breed_ids='+razval;
  // Limpiar la parte de la página en la que saldrán
    document.getElementById('expositor').innerHTML = "";

    // Llamada a la api para obtener lo que sea, en este caso fotos de esas pequeñas y adorables bolas de pelo con cuchillos en las patas
    xhr.open('GET',urlBusqueda, true);    
    xhr.send();
    
    // Una vez se haya realizado la llamada, cambiar la página
    xhr.onreadystatechange = function(){
        
        //Comprobar que todo ha ido bien
        if(xhr.readyState == 4 && xhr.status == 200){
            
          // Crear string para añadir las cosas después a la zona en la que se mostrará
            var img = "";

            // Interpretar los datos obtenidos
            var datos = JSON.parse(xhr.responseText);
            maxImg = xhr.getResponseHeader("Pagination-Count");
            document.getElementById('CantidadTotalImg').innerHTML = "La cantidad total de imagenes de la busqueda es: " + maxImg;
            maxPg=totalPag();
            imagenes = datos;
            MostrarImagenes();
            
        }
        
        else {
          // JA!JA! Ahora puedes ir a la esquina a llorar
            //console.log("Ha habido fallos");
        }
        
    }
    
}

function totalPag() {
    
    return Math.ceil(maxImg/document.getElementById("select-CantidadFotos").value);
}



function PaginaAnterior(){
    pagina -= 1;
    MostrarImagenes();
}
function PaginaSiguiente(){
    pagina += 1;
    MostrarImagenes();
}