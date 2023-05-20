//Creo las variables que usaré dentro del JS y que además hacen referencia a las clases en el html
const calendar = document.querySelector(".calendar");
const date = document.querySelector(".date");
const daysContainer = document.querySelector(".days");
const prev = document.querySelector(".prev");
const next = document.querySelector(".next");
const todayBtn = document.querySelector(".today-btn");
const gotoBtn = document.querySelector(".goto-btn");
const dateInput = document.querySelector(".date-input");
const eventDay = document.querySelector(".event-day");
const eventDate = document.querySelector(".event-date");
const eventsContainer = document.querySelector(".events");
const addEventSubmit = document.querySelector(".add-event-btn");
    
//Creo variables donde consulto la fecha actual, al mismo voy a buscar el mes y año
let today = new Date();
let activeDay;
let month = today.getMonth();
let year = today.getFullYear();

//Declaro los meses en el array
const months = ["Enero","Febrero","Marzo","Abril","Mayo","Junio","Julio","Agosto","Septiembre","Octubre","Noviembre","Diciembre"];

//Declaro el array vacío dinámico
let eventsArr = [];

//Llamo la funciona del localstorage para cargar los eventos que ya están almacenados, en este caso, los feriados
loadEventsFromLocalStorage();

//Función para agregar los días al calendario
function initCalendar() {
    //Declaro las siguientes variables que utilizaré para poblar el calendario

    //firstDay = declaro la primera fecha del mes, utilizando las variables de más arriba y el 1 lo defino como el primer día del mes
    const firstDay = new Date(year, month, 1);
    //lastDay = uso el mismo caso anterior, pero al declarar el día como 0 obtengo el último día del mes anterior, por eso le sumo 1 al mes.
    const lastDay = new Date(year, month + 1, 0);
    //prevLastDay = mismo caso anterior, pero esta vez no le sumo 1 al mes para ir a buscar el ultimo día del mes anterior solamente
    const prevLastDay = new Date(year, month, 0);
    //prevDays = voy a buscar la cantidad de días del mes anterior (variable anterior)
    const prevDays = prevLastDay.getDate();
    //last days = mismo caso anterior, pero ocn el mes actual
    const lastDays = lastDay.getDate();
    //day = voy a buscar el día de la semana de acuerdo con la primera variable definida
    const day = firstDay.getDay();
    //nextDays = con esta variable acomodo los días de la semana de acuerdo al calendario y así poder presentarlos empezando del domingo[0] al sábado[6]
    const nextDays = 7 - lastDay.getDay() - 1;


    //Con lo siguiente, empiezo a poblar el calendario para que se muestre en el HTML
    date.innerHTML = months[month] + " " + year;

    //Variable para los días que llamaré para empezar a poblar el calendario
    let days = "";

    //Creo un bucle para poblar el mes previo del actual
    for(let x = day; x > 0; x--) {
        //Modifico el HTML para que empiece a mostrarse el mes anterior
        days += `<div class="day prev-date">${prevDays - x + 1}</div>`;
    }

    //Creo un bucle para poblar el mes actual
    for(let i = 1; i <= lastDays; i++) {
        //Valido si el día en curso presenta eventos
         let event = false;
         //Recorro el array
         eventsArr.forEach((eventObj) => {
            if(eventObj.day === i && eventObj.month === month + 1 && eventObj.year === year) {
                //si encuentra evento cambio la variable anterior a true, para posteriormente asignarle el active y que se pueda visualizar en el HTML
                event = true;
            }
         });
        //condición para añadir el día en curso
        if(i === new Date().getDate() && year === new Date().getFullYear() && month === new Date().getMonth()){
            //Variable definida más arriba
            activeDay = i;
            //Función definida más abajo, que toma el día activo(i)
            getActiveDay(i);
            //Función definida más abajo, para mostrar los eventos del día seleccionado, toma como input el día activo(i)
            updateEvents(i);
            //si anteriormente encontró eventos y definió la variable event como true, agregará al día activo o actual la clase event al html, de modo contrario, no lo agrega
            if(event) {
                days += `<div class="day today active event">${i}</div>`;
            } else {
                days += `<div class="day today active">${i}</div>`;
            }
        } else {
            //Mismo caso anterior, pero con los días que no están activos y/o no corresponden al actual
            if(event) {
                days += `<div class="day event">${i}</div>`;
            } else {
                days += `<div class="day">${i}</div>`;
            }
        }
    }

     //Creo un bucle para poblar el mes siguiente del actual, misma lógica para poblar el mes previo
     for(let j = 1; j <= nextDays; j++) {
        days += `<div class="day next-date">${j}</div>`;
    }

    //Presento los días en el HTML (presentación visual)
    daysContainer.innerHTML = days;
    //Luego que se pobla el calendario, llamo a la función addListner para aplicar las clases correspondientes al HTML (función definida más abajo)
    addListner();
}

//Inicializo el calendario poblado
initCalendar();

//Función para los meses previos
function prevMonth() {
    month--;
    if(month < 0) {
        month = 11;
        year--;
    }
    //Inicializo el calendario
    initCalendar();
}

//Función para los meses siguientes
function nextMonth() {
    month++;
    if(month > 11){
        month = 0;
        year++;
    }
    //Inicializo el calendario
    initCalendar();
}

//Añado el listener para que los botones de cambiar el calendaria generen una acción
prev.addEventListener("click",prevMonth);
next.addEventListener("click",nextMonth);

//Listener para el botón Hoy
todayBtn.addEventListener("click", () => {
    //Actualizo la variable today con una nueva fecha (día actual o en curso)
    today = new Date();
    //Voy a buscar el mes del today
    month = today.getMonth();
    //voy a busar el año del today
    year = today.getFullYear();
    //Inicializo la función del calendario para ir a buscarlo y me lo muestre en pantalla
    initCalendar();
});

//Event Listener para el elemento de entrada de fecha que deseo ir a buscar (mm/yyyy)
dateInput.addEventListener("input", (e) => {
    //Solo permito entrada de números, utilizo el replace para reemplazar aquellos que no correspondan a un número con ""
    dateInput.value = dateInput.value.replace(/[^0-9/]/g, "");
    //valido que el largo del del input sea de dos
    if(dateInput.value.length === 2) {
        //Si se cumple la condición, añado el slash "/" luego de que el largo sea 2 (mm/yyyy)
        dateInput.value += "/";
    }
    //Luego de la condición anterior, valido que el largo del input no sea mayor a 7
    if(dateInput.value.length > 7) {
        //Si el input es mayor a 7, borro lo que se ingrese después
        dateInput.value = dateInput.value.slice(0, 7);
    }
    //Permito borrar contenido, si no aplico la siguiente condición, al querer modificar el input, este me genera probleas con el "/"
    if(e.inputType === "deleteContentBackward") {
        //Condición para que el largo del input sea 3 == (mm/)
        if(dateInput.value.length === 3) {
            //si cumple la condición, permite borrar contenido
            dateInput.value = dateInput.value.slice(0,2);
        }
    }
});

//Event Listener para el boton de Ir
gotoBtn.addEventListener("click", gotoDate);

//Función para generar una acción en el botón de ir a fecha
function gotoDate() {
    //Declaro una variable donde recibe de entrada el input anterior (mm/yyyy) utilizo el split para dejarlo como (mm/yy)
    const dateArr = dateInput.value.split("/");
    //Condición para que la variable anterior tenga como mínimo un largo de 2
    if(dateArr.length === 2) {
        //DateArr[0] cumple la función del mes y valido que sea mayor a 0 y menor a 13
        //DateArr[1] cumple la función del año y solicito mínimo 4 números
        if(dateArr[0] > 0 && dateArr[0] < 13 && dateArr[1].length === 4) {
            month = dateArr[0] - 1;
            year = dateArr[1];
            //Reseteo el input de la fecha dejandolo en blanco
            dateInput.value = "";
            //Inicializo el calendario para ir a buscar la fecha ingresada en el input
            initCalendar();
            return;
        } else {
            //Si la fecha ingresada no es válida, se genera lo siguiente
            alert("Fecha búscada no válida");
            //Dejo en blanco el input de fecha
            dateInput.value = "";
        }
    } 
};

//variables para el recuadro de añadir evento
const addEventBtn = document.querySelector(".add-event");
const addEventContainer = document.querySelector(".add-event-wrapper");
const addEventCloseBtn = document.querySelector(".close");
//addEventTitle = document.querySelector(".event-name"),
const addEventTitle = document.getElementById("event-name");
//addEventFrom = document.querySelector(".event-time-from"),
const addEventFrom = document.getElementById("event-time-from");
//addEventTo = document.querySelector(".event-time-to");
const addEventTo = document.getElementById("event-time-to");

//Event Listener para el botón de añadir evento
addEventBtn.addEventListener("click", () => {
    //añado la clase active, para que el recuadro pueda visualizarse
    addEventContainer.classList.toggle("active");
});

//Event Listener para cuando cierre el recuadro
addEventCloseBtn.addEventListener("click", () => {
    //Remuevo la clase de active para que no se visualice el recuadro
    addEventContainer.classList.remove("active");
});

//Event listener para desactivar el recuadro de añadir evento en caso de no utilizar el botón de cerrar
document.addEventListener("click", (e) => {
    //Si hace click afuera, remuevo la clase active
    if(e.target != addEventBtn && !addEventContainer.contains(e.target)) {
        addEventContainer.classList.remove("active");
    }
});

//Events Listener para el input del titulo
addEventTitle.addEventListener("input", (e) => {
    //Permite la entrada de 50 caracteres máximo para el título
    addEventTitle.value = addEventTitle.value.slice(0, 50);
});

//Event Listener para el input de tiempo de inicio del evento que se añadirá
addEventFrom.addEventListener("input", (e) => {
    //remuevo la entrada de letras, solo se permiten números
    addEventFrom.value = addEventFrom.value.replace(/[^0-9:]/g, "");
    if(addEventFrom.value.length === 2) {
        //añade : si se ingresan 2 números
        addEventFrom.value += ":";
    }
    //no permito al usuario añadir más de 5 caracteres
    if(addEventFrom.value.length > 5) {
        addEventFrom.value = addEventFrom.value.slice(0,5);
    }
    //Permito borrar si utilizo la tecla para borrar
    if(e.inputType === "deleteContentBackward") {
        if(addEventFrom.value.length === 3) {
            addEventFrom.value = addEventFrom.value.slice(0,2);
        }
    }
});

//Replico lo anterior para la otra solicitud de tiempo
//Event Listener para el input de tiempo de finalización del evento que se añadirá
addEventTo.addEventListener("input", (e) => {
    //remuevo la entrada de letras, solo se permiten números
    addEventTo.value = addEventTo.value.replace(/[^0-9:]/g, "");
    if(addEventTo.value.length === 2) {
        //añade : si se ingresan 2 números
        addEventTo.value += ":";
    }
    //no permito al usuario añadir más de 5 caracteres
    if(addEventTo.value.length > 5) {
        addEventTo.value = addEventTo.value.slice(0,5);
    }
    //Permito borrar si utilizo la tecla para borrar
    if(e.inputType === "deleteContentBackward") {
        if(addEventTo.value.length === 3) {
            addEventTo.value = addEventTo.value.slice(0,2);
        }
    }
});

//Creo una función para "activar" los días seleccionados
function addListner() {
    //declaro la constante para ir a capturar el día seleccionado del calendario
    const days = document.querySelectorAll(".day");
    //Itero el Array
    days.forEach((day) => {
        //A cada día que recorro con la iteración, le acreo un event listener
        day.addEventListener("click", (e) => {
            //seteo el día seleccionado (activeDay va a partir siendo el día actual o en curso) como día activo, voy a buscar el número del día con number
            activeDay = Number(e.target.innerHTML);

            //Llamo a la función getActiveDay para mostrar en el HTML la fecha del día activo
            getActiveDay(e.target.innerHTML);
            //Llamo a la función updateEvents para mostrar los eventos en el HTML del día activo
            updateEvents(Number(e.target.innerHTML));

            //Remuevo la clase active de aquella que se encontraba activa antes de cambiarla
            days.forEach((day) => {
                day.classList.remove("active");
            });

            //Condición que al clickear en algún día que se visualice del mes previo, me lleva al mes de ese día y selecciona ese día como activo
            if(e.target.classList.contains("prev-date")) {
                //Función para cambiar al mes anterior
                prevMonth();

                //Seteo un tiempo de respuesta del calendario de 100 milisegundos
                setTimeout(() => {
                    //selecciona todos los días de ese mes para mostrarlos
                    const days = document.querySelectorAll(".day");

                    //Se añade la clase active al día/días seleccionados del mes anterior
                    days.forEach((day) => {
                        if(!day.classList.contains("prev-date") && day.innerHTML === e.target.innerHTML) {
                            //Añado la clase active al día del mes anterior que tengo seleccionado
                            day.classList.add("active");
                        }
                    });
                }, 100);
                //Mismo situación anterior pero con el mes siguiente
            } else if(e.target.classList.contains("next-date")) {
                //Función para cambiar al mes siguiente
                nextMonth();
                
                setTimeout(() => {
                    //selecciona todos los días de ese mes para mostrarlos
                    const days = document.querySelectorAll(".day");
                    
                    //Se añade la clase active al día/días seleccionados del mes siguiente
                    days.forEach((day) => {
                        if(!day.classList.contains("next-date") && day.innerHTML === e.target.innerHTML) {
                            //Añado la clase active al día del mes siguiente que tengo seleccionado
                            day.classList.add("active");
                        }
                    });
                }, 100);
            //En caso de no cumplir la condición anterior, significa que estoy visualizando el mes actual
            } else {
                //Agrego la clase active al día seleccionado del mes actual
                e.target.classList.add("active");
            }
        });
    });
}

//Función para mostrar la fecha y día en el recuadro de la derecha
function getActiveDay(date) {
    //variable para ir a buscar la fecha y capturar su información utilizando las variables definidas al inicio
    let day = new Date(year, month, date);
    //Cambio el formato de la fecha para que lo presente en español, utilizo el short para abreviar el día que se presenta
    day = day.toLocaleDateString('es-CL', { weekday: 'short'});
    //Voy a buscar solo el nombre de la fecha de forma abreviada ej: Martes = Mar
    const dayName = day.toString().split(" ")[0];
    //Muestro en el HTML el nombre del día de la semana abreviado
    eventDay.innerHTML = dayName;
    //Muestro al lado del nombre del día de la semana, la fecha completa (día" "mes" "año)
    eventDate.innerHTML = date + " " + months[month] + " " + year;
}

//Función para mostrar los eventos del día seleccionado
function updateEvents(date) {
    //Defino el events vacío para después modificarlo con HTML
    let events = "";
    //Recorro el array de los eventos
    eventsArr.forEach((event) => {
        //Condición para traer los eventos del día seleccionado
        if(date === event.day && month + 1 === event.month && year === event.year) {
            //Recorro los (events) para mostrar la información del evento y genero el html
            event.events.forEach((event) => {
                events += `
                <div class="animate__animated animate__backInRight event">
                    <div class="title">
                        <i class="fas fa-circle"></i>
                        <h3 class="event-title">${event.title}</h3>
                    </div>
                    <div class="event-time">
                        <span class="event-time">${event.time}</span>
                    </div>
                </div>
                `;
            });
        }
    });

    //Si no encuentra eventos para ese día, presento el mensaje en el recuadro de "No hay Eventos"
    if((events === "")) {
        events = `<div class="animate__animated animate__bounceInDown no-event">
                    <h3>No hay Eventos</h3>
                  </div>`;
    }

    //Presento en el container de los eventos (HTML -- Recuadro de la derecha), los eventos encontrados y no encontrados 
    eventsContainer.innerHTML = events;
    //En caso de que haga una actualización de los eventos, los almaceno en el localstorage
    localStorage.setItem("events", JSON.stringify(eventsArr));
}

//Event Listener del click de añadir eventos
addEventSubmit.addEventListener("click", () => {
    //Declaro las variables de los input donde se ingresa la información del evento
    const eventTitle = addEventTitle.value;
    const eventTimeFrom = addEventFrom.value;
    const eventTimeTo = addEventTo.value;

    //Valido que el evento que se quiere ingresar no contenga sus campos vacios
    if(eventTitle === "" || eventTimeFrom === "" || eventTimeTo === "") {
        alert("Por favor, complete los campos del Evento");
    }

    //constantes para guardar el tiempo/hora como array y eliminar el ":"
    const timeFromArr = eventTimeFrom.split(":");
    const timeToArr = eventTimeTo.split(":");

    //Me aseguro que las horas ingresadas como array al menos contengan la hora[0] y los minutos[1], solicitando un largo mínimo de 2 para ambos casos
    //También me aseguro que el número ingresado para las horas no sea superario a 23 y que el número ingresado para los minutos no sea superior a 59
    //La siguiente condición es por si no cumple lo anterior
    if(timeFromArr.length != 2 || timeToArr.length != 2 || timeFromArr[0] > 23 || timeFromArr[1] > 59 || timeToArr[0] > 23 || timeToArr[1] > 59) {
        //Genero un alert y seteo los input en ""
        alert("Formato de las horas del evento es inválido");
        addEventTitle.value = "";
        addEventFrom.value = "";
        addEventTo.value = "";

    //Si cumple la condición anterior (condición solicitada o mejor dicho ideal)
    } else {
        //Seteo las horas con la función convertTime en AM y PM
        const timeFrom = convertTime(eventTimeFrom);
        const timeTo = convertTime(eventTimeTo);

        //variable utilizada para verificar si agregué el evento
        let eventAdded = false;
    
        //Varibale del formato del nuevo evento (array)
        const newEvent = {
            title: eventTitle,
            time: timeFrom + " - " + timeTo,
        };    
        
        //si el evento no ha sido agregado, genero el push del evento
        if(!eventAdded) {
            //como mi array tiene 2 dimensiones (fechas y evento), almaceno primero la información de la fecha y a la misma al final, se agrego la información del evento utilizando mi variable anterior de newEvent
            eventsArr.push({
                day: activeDay,
                month: month + 1,
                year: year,
                events: [newEvent],
            });
        }

        //Remuevo la clase active
        addEventContainer.classList.remove("active");
        //Limpio los campos de entrada
        addEventTitle.value = "";
        addEventFrom.value = "";
        addEventTo.value = "";

        //Almaceno el nuevo cambio en el localStorage
        localStorage.setItem("events", JSON.stringify(eventsArr));
        
        //Utilizo la función updateEvents para mostrar los eventos añadidos del día activo/seleccionado
        updateEvents(activeDay);
        
        //Agrego la clase event a los días que ahora poseen un evento y que antes no tenías
        const activeDayElem = document.querySelector(".day.active");
        if(!activeDayElem.classList.contains("event")) {
            activeDayElem.classList.add("event");
        }
    }
});

//Función para cargar los eventos ya almacenados en el localStorage
//En un inicio, sin esta función la API me cargaba cada vez que refrescaba el sitio los eventos de los feriados, por eso también la coloco al inicio y post, me ayuda a evitar duplicidad
function loadEventsFromLocalStorage() {
    //Si los eventos no se encuentran vaciós, cumplo la condición
    if (localStorage.getItem("events") !== null) {
        //Se cargan los eventos ya almacenados en el localstorage
        eventsArr = JSON.parse(localStorage.getItem("events"));
    //Si no se encuentran eventos, llamo la función de la API, para cargar los feriados como eventos.
    } else {
        fetchEvents();
    }
}

//Cargo los eventos
loadEventsFromLocalStorage();

//Función para formatear las horas presentadas de los eventos
function convertTime(time) {
    //Le quito los ":" a la hora ingresada
    let timeArr = time.split(":");
    //Almaceno los primeros 2 números (hora) como un array
    let timeHour = timeArr[0];
    //Almaceno los primeros 2 números (minutos) como un array
    let timeMin = timeArr[1];

    //Formateo las horas entre PM y AM
    //Si es mayor igual a 12, lo formatea como PM, si es menor, lo formatea como AM
    let timeFormat = timeHour >= 12 ? "PM" : "AM";
        //utilizo el resto de las división de la hora ingresada, si este es menor a 12, entonces corresponderá a AM si el resto es mayor a 12, entonces será PM
        //El resto de la división corresponderá a la hora presentada
        timeHour = timeHour % 12 || 12;
        time = timeHour + ":" + timeMin + " " + timeFormat;
        return time;
}

//Event Listener para eliminar eventos al hacer click
eventsContainer.addEventListener("click", (e) => {
    //Condición para ver si contiene la clase "event" correspondiente a un evento
    if(e.target.classList.contains("event")) {
        //Variable para traer un elemento (titulo) contenido dentro de otro (event) que aparece en el HTML
        const eventTitle = e.target.children[0].children[1].innerHTML;
        //Al obtener el título del evento, recorro el array para posteriormente borrar el evento
        eventsArr.forEach((event) => {
            //Condición para comparar el día seleccionado del evento que se desea borrar
            if(event.day === activeDay && event.month === month + 1 && event.year === year) {
                //Recorro el array de los eventos 
                event.events.forEach((item, index) => {
                    //Condición para comparar el título del evento que se desea eliminar dentro del día seleccionado
                    if(item.title === eventTitle) {
                        //Confirmación de la eliminación
                        var result = confirm("¿Estás seguro de realizar esta acción?");
                        if(result) {
                            //si result es true, significa que confirma la eliminación del elemento, de modo contrario no hace nada
                            event.events.splice(index, 1);
                        }
                    }
                });
                //Condición para validar si quedan eventos en el día seleccionad
                if(event.events.length === 0){
                    //Elimino el evento del array
                    eventsArr.splice(eventsArr.indexOf(event), 1);
                    //Remuevo la clase event del día activo
                    const activeDayElem = document.querySelector(".day.active");
                    //Condicón para saber si mi día activo o día seleccionado contiene la clase event
                    if(activeDayElem.classList.contains("event")){
                        //remuevo la clase
                        activeDayElem.classList.remove("event");
                    }
                }
            }
        });
        //Utilizo la función de actualizar
        updateEvents(activeDay);
    }
});

//Función  para llamar a la API de los feriados del año 2023 de Chile 
function fetchEvents() {
    //Genero la solicitud de los feriados
    fetch('https://api.generadordni.es/v2/holidays/holidays?country=CL&year=2023')
    //transformo los feriados a json
      .then(response => response.json())
      .then(data => {
        //Recorro el array de datos de feriados
        data.forEach(holiday => {
            //rescato la fecha de inicio del feriado
            dateHoliday = holiday.start;
            //La seteo como una nueva fecha
            dateHoliday = new Date(dateHoliday);
            //voy a buscar los datos de la fecha para cada campo
            dayHoliday = dateHoliday.getDate();
            monthHoliday = dateHoliday.getMonth();
            yearHoliday = dateHoliday.getFullYear();
            hourFromHoliday = dateHoliday.getHours();
            //Voy a buscar la hora de finalización del evento
            dayHolidayeEnd = holiday.end;
            dayHolidayeEnd = new Date(dayHolidayeEnd);
            hourToHoliday = dayHolidayeEnd.getHours();

            //Variable para validar si ya existen eventos en la misma fecha, en caso que los haya, lo define como true
            const eventExists = eventsArr.some(item => item.day === dayHoliday && item.month === monthHoliday + 1 && item.year === yearHoliday);

            //Condición que indica que lo anterior es falso (no existen eventos para la misma fecha)
            if (!eventExists) {
                //La hora de inicio del evento solo devuelve 0, así que la seteo para que se almacene como 00:00 
                if(hourFromHoliday == 0) { 
                    hourFromHoliday = '00:00'
                }
                //Parseo la hora con la función de convertTime y que se muestre como 12:00 AM
                const timeFromHoliday = convertTime(hourFromHoliday);

                //La hora de finalización del evento solo devuelve 0, así que la seteo para que se almacene como 23:59
                if(hourToHoliday == 0) {
                    hourToHoliday = '23:59'
                }
                //Parseo la hora con la función de convertTime y que se muestre como 11:59 PM
                const timeToHoliday = convertTime(hourToHoliday);
                
                //Guardo la fecha como un nuevo evento y con las horas formateadas
                const newEvent = {
                    title: holiday.name,
                    time: timeFromHoliday + " - " + timeToHoliday,
                };

                //Seteo la variable de eventAdded como false para indicar que aun no se agrega el evento
                let eventAdded = false;

                //Condición para validar que el array no esté vació
                if (eventsArr.length > 0) {
                    //Recorro el array
                    eventsArr.forEach((item) => {
                        //Condición para comparar la fecha del calendario con el feriado
                        //Si encuentra una fecha que coincida con el feriado, generará la acción
                        if (item.day === dayHoliday && item.month === monthHoliday + 1 && item.year === yearHoliday) {
                            //Hago push del nuevo evento, correspondiente al feriado
                            item.events.push(newEvent);
                            //Seteo mi variable anterior como true, par así indicar que ya se agregó el evento
                            eventAdded = true;
                        }
                    });
                }

                //Condición en caso de que lo anterior no lo cumpla
                if (!eventAdded) {
                    //Genero el push de la fecha y del evento con la información del feriado
                    eventsArr.push({
                        day: dayHoliday,
                        month: monthHoliday + 1,
                        year: yearHoliday,
                        events: [newEvent],
                    });
                }
            }
            
            //Guardo lo anterior en el LocalStorage
            localStorage.setItem("events", JSON.stringify(eventsArr));
            
            //Utilizo la función updateEvents para mostrar los eventos añadidos
            updateEvents(dayHoliday);         
        });
      })
      .catch(error => {
        console.log('Error:', error);
      });
  }