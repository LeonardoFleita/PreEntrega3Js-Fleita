//ARRAYS

const productos = [];
let carrito = [];
const productosEnStorage = [];
let carritoEnStorage = JSON.parse(localStorage.getItem("carrito"));


//CONSTRUCTORES

function producto(id, nombre, precio, descripcion){
    this.id = parseInt(id)
    this.nombre = nombre;
    this.precio = parseInt(precio);
    this.descripcion = descripcion;
    this.precioConIva = this.precio * 1.21;
};


//CREACION DE OBJETOS PARA LOS ARRAY

const redVelvet = productos.push(new producto(1, "Red velvet", 6500, "Torta de chocolate de color rojo brillante recubierta por capas de glaseado de queso cremoso"));
const tresChocolates = productos.push(new producto(2, "Tres chocolates", 5500, "Húmedo bizcochuelo de chocolate amargo, ganache de chocolate amargo y tropezones de avellanas en praline"));
const strawberry = productos.push(new producto(3, "Strawberry", 6500, "Bizcochuelo de vainilla y pistachos, crema de queso mascarpone, agua de azahar y frutillas frescas"));
const rogel = productos.push(new producto(4, "La Rogelia", 2500, "Clásica torta rogel argentina, finas capas de galleta crujiente y dulce de leche, cubierta en merengue quemado"));


//STORAGE DE PRODUCTOS

const almacenar = (clave, valor) => {
    localStorage.setItem(clave, valor)
};

for(const prod of productos){
    almacenar("producto " + prod.id, JSON.stringify(prod));
};

function recuperarDeStorage(nombreDeClave, arrayDeSalida){
    for (let i = 0; i < localStorage.length; i++) {
        let clave = localStorage.key(i);
        let incluye = clave.includes(nombreDeClave);
        incluye && arrayDeSalida.push(JSON.parse(localStorage.getItem(clave)));
    };
    arrayDeSalida.sort((a, b)=>{
        return a.id - b.id;    
    });
};


//DOM

//Imprime los productos en la página junto con el botón de comprar y la cantidad
function imprimirProductos(array){
    for(const elemento of array){
        let div = document.createElement("div");
        div.className = "contenedor"
        div.innerHTML = `<img src="./img/${elemento.nombre}.jpg" alt="${elemento.nombre}" class="fotoProducto">
                        <h3>${elemento.nombre}</h3>
                        <p>${elemento.descripcion}</p>
                        <p>$${elemento.precio}</p>
                        <input type="number" id="cantidad${elemento.id}" value="1" min="1">
                        <button class="comprar" id="boton${elemento.id}">Comprar</button>`;
        document.getElementById("carta").appendChild(div);
    };
};

//Agrega productos al carrito y almacena el carrito en el local storage
function agregarAlCarrito(arrayDeEntrada, arrayDeSalida){
    for(const prod of arrayDeEntrada){
        let boton = document.getElementById("boton"+prod.id);
        let cantidad = document.getElementById("cantidad"+prod.id);
        boton.onclick = () => {
            if(cantidad.value >=1){
                let arrayProvisorio = [];
                arrayProvisorio.push(prod);
                for(const el of arrayProvisorio){
                    el.cantidad = cantidad.value;    
                    el.precio *= cantidad.value;
                    arrayDeSalida.push(el);
                };  
                almacenar("carrito", JSON.stringify(arrayDeSalida));
            };
            window.location.reload();
        };
    };
};

//Agrupa elementos repetidos en uno solo, actualizando los valores de cantidad y precio, es para usar dentro de imprimirCarrito()
function agruparRepetidos(array1, array2){
    let agrupados = [];
    for(const el of array1){
        let repetido = array2.filter((elemento) => elemento.id == el.id);
        let precio = precioTotal(repetido);
        let cantidad = cantidadTotal(repetido);
        let provisorio = [];
        provisorio.push(el);
        provisorio[0].precio = precio;
        provisorio[0].cantidad = cantidad;
        agrupados.push(provisorio[0]);
    };
    return agrupados;
};

//Imprime el carrito en la página
function imprimirCarrito(array1, array2){
    let contenedor = document.getElementById("carrito__tabla");
    let carritoAgrupado = agruparRepetidos(array1, array2);
    for(const prod of carritoAgrupado){
        let fila = document.createElement("tr");
        fila.innerHTML = `<td><h4>${prod.nombre}</h4></td>
                        <td><p>Cantidad: ${prod.cantidad}</p></td>
                        <td><p>Precio: $${prod.precio}</p></td>`
        contenedor.appendChild(fila);
    };
    let total = precioTotal(carritoAgrupado);
    let totalImpreso = document.createElement("div");
    totalImpreso.className = "total";
    totalImpreso.innerHTML = `<h3>Total: $${total}</h3>`;
    contenedor.appendChild(totalImpreso);
};

//Limpia el carrito
function limpiarCarrito(){
    let boton = document.getElementById("limpiar");
    boton.onclick = () =>{
        localStorage.removeItem("carrito");
        window.location.reload();
    };
};

//Retorna precio total de los objetos de un array
function precioTotal(array){
    let nuevoArray = array.map((el) => {
        return el.precio});
    let total = nuevoArray.reduce((acumulador, precio) => acumulador + precio, 0);
    return total;
};

//Retorna cantidad total de los objetos un array (propiedad cantidad, no cantidad real de objetos en array)
function cantidadTotal(array){
    let nuevoArray = array.map((el) => {
        return parseInt(el.cantidad)});
    let total = nuevoArray.reduce((acumulador, cant) => acumulador + cant, 0);
    return total;
};


//EJECUCIÓN

carritoEnStorage && (carrito = carritoEnStorage);
recuperarDeStorage("producto", productosEnStorage);
imprimirProductos(productosEnStorage);
agregarAlCarrito(productosEnStorage, carrito);
limpiarCarrito();
imprimirCarrito(productos, carrito);










