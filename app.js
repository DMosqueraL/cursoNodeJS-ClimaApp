import 'dotenv/config';

import colors from "colors";

import { inquirerMenu, leerInput, listarLugares, pausa } from "./helpers/inquirer.js";
import Busquedas from "./models/busquedas.js";

const main = async () => {
  const busquedas = new Busquedas();
  let opt = "";

  do {
    opt = await inquirerMenu();
    //console.log("Ha seleccionado: ", opt);

    switch (opt) {
      /**
       * Consultar - Buscar lugar
       */
      case 1:
        //Mostrar mensaje
        const lugar = await leerInput('Ciudad: ');
        
        //Buscar lugares
        const lugares = await busquedas.ciudad(lugar);

        //Seleccionar lugar
        const idSeleccionado = await listarLugares(lugares);
        if(idSeleccionado === '0') continue;

        //Persistencia en el historial
        const lugarSeleccionado = lugares.find(lugar => lugar.id === idSeleccionado); 
        busquedas.agregarHistorial(lugarSeleccionado.nombre);               

        //Clima
        const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);        

        //Mostrar resultados
        console.clear();
        console.log(`\nInformación de la ciudad\n`.cyan);
        console.log("Ciudad: ", lugarSeleccionado.nombre);
        console.log("Latitud: ", lugarSeleccionado.lat);
        console.log("Longitud: ", lugarSeleccionado.lng);
        console.log("Temperatura: ", clima.temp, '°C');
        console.log("Mínima: ", clima.min, '°C');
        console.log("Máxima: ", clima.max, '°C');
        console.log("El clima: ", clima.desc);
        break;
      /**
       * Historial de Busqueda 
       */  
      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const indice = `${i+1}.`.cyan;
          console.log(`${indice} ${lugar}`);          
        })
        break;
      case 0:
        //Salir de la App
        break;
    }

    if (opt !== 0) await pausa();
  } while (opt !== 0);
};

main();
