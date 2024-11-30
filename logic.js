// Step 1: Create the state mapping
const stateMapping = {
  AL: "Alabama",
  AK: "Alaska",
  AZ: "Arizona",
  AR: "Arkansas",
  CA: "California",
  CO: "Colorado",
  CT: "Connecticut",
  DE: "Delaware",
  FL: "Florida",
  GA: "Georgia",
  HI: "Hawaii",
  ID: "Idaho",
  IL: "Illinois",
  IN: "Indiana",
  IA: "Iowa",
  KS: "Kansas",
  KY: "Kentucky",
  LA: "Louisiana",
  ME: "Maine",
  MD: "Maryland",
  MA: "Massachusetts",
  MI: "Michigan",
  MN: "Minnesota",
  MS: "Mississippi",
  MO: "Missouri",
  MT: "Montana",
  NE: "Nebraska",
  NV: "Nevada",
  NH: "New Hampshire",
  NJ: "New Jersey",
  NM: "New Mexico",
  NY: "New York",
  NC: "North Carolina",
  ND: "North Dakota",
  OH: "Ohio",
  OK: "Oklahoma",
  OR: "Oregon",
  PA: "Pennsylvania",
  RI: "Rhode Island",
  SC: "South Carolina",
  SD: "South Dakota",
  TN: "Tennessee",
  TX: "Texas",
  UT: "Utah",
  VT: "Vermont",
  VA: "Virginia",
  WA: "Washington",
  WV: "West Virginia",
  WI: "Wisconsin",
  WY: "Wyoming",
};

// Step 2: Create the map
let myMap = L.map("map-id", {
  center: [37.0902, -95.7129],
  zoom: 5,
});
console.log(myMap);

// Step 3: Add base layers
let baseLayers = {
  OpenStreetMap: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }),
  "Carto Voyager": L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap contributors & CARTO",
  }),
};

// Add default base layer
baseLayers["Carto Voyager"].addTo(myMap);
console.log(baseLayers);

// Step 4: Define paths to data
const csvPath = "data/US_Accidents_March23_1_percent.csv";

// Step 5: Markers and filters
let allMarkers = [];
let selectedYear = "All";
let selectedWeather = "All";

// Step 6: Map weather conditions to pull all weather
const weatherMapping = {
  "Scattered Clouds": "cloudy",
  "Overcast": "overcast",
  "Clear": "clear",
  "Mostly Cloudy": "cloudy",
  "Partly Cloudy": "cloudy",
  "Light Rain": "rain",
  "Rain": "rain",
  "Heavy Rain": "rain",
  "Haze": "haze",
  "Fair": "fair",
  "Rain Showers": "rain",
  "Fog": "fog",
  "Light Thunderstorms and Rain": "rain",
  "Heavy Thunderstorms and Rain": "rain",
  Mist: "mist",
  Thunderstorm: "rain",
  "Light Drizzle": "drizzle",
  Cloudy: "cloudy",
  Smoke: "smoke",
  "Light Freezing Drizzle": "freezing drizzle",
  "Light Snow": "snow",
  "Thunderstorms and Rain": "rain",
  "Light Freezing Rain": "rain",
  "Shallow Fog": "fog",
  Snow: "snow",
  Sand: "sand",
  "Cloudy / Windy": "cloudy",
  "Light Rain / Windy": "rain",
  Thunder: "rain",
  Drizzle: "drizzle",
  "T-Storm": "rain",
  "Thunder in the Vicinity": "rain",
  "Fair / Windy": "fair",
  "Light Rain with Thunder": "rain",
  "Showers in the Vicinity": "rain",
  "Heavy T-Storm": "rain",
  "Partly Cloudy / Windy": "cloudy",
  "Thunder / Windy": "rain",
  Tornado: "tornado",
  "Mostly Cloudy / Windy": "cloudy",
  "N/A Precipitation": "clear",
  "Haze / Windy": "haze",
  "Patches of Fog": "fog",
  "Wintry Mix": "winter mix",
  "Heavy Snow": "snow",
  "Light Snow and Sleet": "snow",
  "Light Snow / Windy": "snow",
  "Wintry Mix / Windy": "winter mix",
  "Rain / Windy": "rain",
  "Drizzle and Fog": "fog",
  "Heavy T-Storm / Windy": "rain",
  "Heavy Drizzle": "drizzle",
};

// Weather color
function getWeatherColor(weather) {
  const simplifiedWeather = weatherMapping[weather] || "other";
  return simplifiedWeather === "rain"
    ? "blue"
    : simplifiedWeather === "snow"
    ? "lightblue"
    : simplifiedWeather === "fog"
    ? "gray"
    : simplifiedWeather === "clear"
    ? "green"
    : simplifiedWeather === "cloudy"
    ? "lightgray"
    : simplifiedWeather === "drizzle"
    ? "yellow"
    : simplifiedWeather === "haze"
    ? "brown"
    : simplifiedWeather === "overcast"
    ? "darkgray"
    : simplifiedWeather === "fair"
    ? "pink"
    : simplifiedWeather === "tornado"
    ? "red"
    : simplifiedWeather === "winter mix"
    ? "purple"
    : "black"; // color for other weather
}

// Step 7: Load accident data and  markers
d3.csv(csvPath)
  .then((accidentData) => {
    console.log(accidentData);

    accidentData.forEach((record) => {
      if (record.State && record.Severity && record.Start_Time) {
        const year = new Date(record.Start_Time).getFullYear().toString(); // Ensure year is a string
        const weather = weatherMapping[record.Weather_Condition] || "Other";

        //  marker
        const marker = L.circleMarker([+record.Start_Lat, +record.Start_Lng], {
          radius: 5,
          color: getWeatherColor(record.Weather_Condition),
          fillOpacity: 0.6,
        }).bindPopup(`
          <p><strong>Year:</strong> ${year}</p>
          <p><strong>Weather:</strong> ${weather}</p>
          <p><strong>Severity:</strong> ${record.Severity}</p>
        `);

        // Store marker with metadata
        allMarkers.push({
          year: year, // Ensure year is stored as a string
          weather: weather,
          marker: marker,
        });
      }
    });

    console.log(allMarkers);

    // Map with all markers
    updateMap();
  })
  .catch((error) => console.error(error));


// Step 8: Add event listeners for dropdown filters
document.getElementById("yearFilter").addEventListener("change", (event) => {
  selectedYear = event.target.value;
  updateMap();
});

document.getElementById("weatherFilter").addEventListener("change", (event) => {
  selectedWeather = event.target.value;
  updateMap();
});

// Step 9: Function to update map based on filters
function updateMap() {
  console.log(selectedYear, selectedWeather);

  myMap.eachLayer((layer) => {
    if (layer instanceof L.CircleMarker) {
      myMap.removeLayer(layer);
    }
  });

  // Filter and add markers based on year and weather
  allMarkers.forEach(({ year, weather, marker }) => {
    const yearMatch = selectedYear === "All" || year === selectedYear;
    const weatherMatch = selectedWeather === "All" || weather === selectedWeather;

    if (yearMatch && weatherMatch) {
      marker.addTo(myMap);
    }
  });

  console.log("Map updated with current filters.");
}

// Add choropleth layer and toggle control
const geoJsonPath = "data/us-states.json";
const driversDataPath = "data/Licensed_Drivers_clean.csv";

// Adjusted color scale 
function getDriversColor(driversCount) {
  return driversCount > 20000000
    ? "#FFD700" // Darkest
    : driversCount > 15000000
    ? "#FFDF00"
    : driversCount > 10000000
    ? "#FFEB4D"
    : driversCount > 5000000
    ? "#FFF27D"
    : driversCount > 1000000
    ? "#FFF7A6"
    : driversCount > 500000
    ? "#FFFBCC"
    : driversCount > 100000
    ? "#FFFDE5"
    : "#FFFFF0"; // Lightest
}

let driversChoroplethLayer = null;

function addDriversChoropleth() {
  d3.csv(driversDataPath)
    .then((driversData) => {
      console.log("Drivers data loaded:", driversData);

      d3.json(geoJsonPath)
        .then((geoJsonData) => {
          console.log("GeoJSON data loaded:", geoJsonData);

          // Map drivers data to states using stateMapping
          const driversByState = {};
          driversData.forEach((record) => {
            const stateAbbr = record.State.trim(); 
            const driversCount = +record.Drivers;
            const fullStateName = stateMapping[stateAbbr]; 

            if (fullStateName && driversCount) {
              driversByState[fullStateName] = driversCount; // Use full state name as key
            }
          });

          console.log(driversByState);

          // Add drivers data to GeoJSON features
          geoJsonData.features.forEach((feature) => {
            const stateName = feature.properties.name; // Full state name from GeoJSON
            feature.properties.driversCount = driversByState[stateName] || 0; // Use 0 if no data
          });

          geoJsonData.features.forEach((feature) => {
            console.log(
              `State: ${feature.properties.name}, Drivers: ${feature.properties.driversCount}`
            );
          });

          // Create the choropleth layer
          driversChoroplethLayer = L.geoJson(geoJsonData, {
            style: (feature) => {
              const driversCount = feature.properties.driversCount;
              return {
                fillColor: getDriversColor(driversCount),
                weight: 1,
                opacity: 1,
                color: "white",
                fillOpacity: 0.7,
              };
            },
            onEachFeature: (feature, layer) => {
              const driversCount = feature.properties.driversCount;
              const stateName = feature.properties.name;
              layer.bindPopup(`
                <h3>${stateName}</h3>
                <p><strong>Licensed Drivers:</strong> ${
                  driversCount ? driversCount.toLocaleString() : "No data"
                }</p>
              `);
            },
          });

          // Add the layer to the map
          driversChoroplethLayer.addTo(myMap);

          // Add layer control with toggle 
          L.control
            .layers(null, { "Drivers Choropleth": driversChoroplethLayer }, { position: "bottomleft" })
            .addTo(myMap);

          console.log("Drivers choropleth layer added with toggle control");
        })
        .catch((error) => console.error(error));
    })
    .catch((error) => console.error(error));
}

// Call the function to add the choropleth
addDriversChoropleth();
