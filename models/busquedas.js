import fs from "fs";

import axios from "axios";

class Busquedas {
  historial = [];
  dbPath = "./db/database.json";

  constructor() {
    this.leerDB();
  }

  get historialCapitalizado() {
    //Capitalizar a inicial de cada palabra
    return this.historial.map((lugar) => {
      let palabras = lugar.split(" ");
      palabras = palabras.map(
        palabra => palabra[0].toUpperCase() + palabra.substring(1)
      );
      return palabras.join(" ");
    });
  }

  get paramsMapbox() {
    return {
      access_token: process.env.MAPBOX_KEY,
      language: "es",
      limit: 5,
    };
  }

  async ciudad(lugar = "") {
    try {
      //Petición HTTP
      const instance = axios.create({
        baseURL: `https://api.mapbox.com/geocoding/v5/mapbox.places/${lugar}.json`,
        params: this.paramsMapbox,
      });

      const resp = await instance.get();
      return resp.data.features.map((lugar) => ({
        id: lugar.id,
        nombre: lugar.place_name,
        lng: lugar.center[0],
        lat: lugar.center[1],
      }));
    } catch (e) {
      return [];
    }
  }

  get paramsApiWeatherService() {
    return {
      appid: process.env.OPENWEATHER_KEY,
      lang: "es",
      units: "metric",
    };
  }

  async climaLugar(lat, lon) {
    try {
      //Petición HTTP
      const instance = axios.create({
        baseURL: `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}`,
        params: this.paramsApiWeatherService,
      });

      const resp = await instance.get();
      const { weather, main } = resp.data;
      return {
        temp: main.temp,
        min: main.temp_min,
        max: main.temp_max,
        desc: weather[0].description,
      };
    } catch (e) {
      console.log(e);
    }
  }

  agregarHistorial(lugar = "") {
    if (this.historial.includes(lugar.toLocaleLowerCase())) {
      return;
    }
    this.historial = this.historial.splice(0,9);
    this.historial.unshift(lugar.toLocaleLowerCase());
    this.guardarDB();
  }

  guardarDB() {
    const payload = {
      historial: this.historial,
    };
    fs.writeFileSync(this.dbPath, JSON.stringify(payload));
  }

  leerDB() {
    if (!fs.existsSync(this.dbPath)) {
      return;
    }
    const info = fs.readFileSync(this.dbPath, { encoding: "utf-8" });
    const data = JSON.parse(info);

    this.historial = data.historial;
  }
}

export default Busquedas;
