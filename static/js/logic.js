// Create the state mapping
const stateMapping = {
  AL: "Alabama", AK: "Alaska", AZ: "Arizona", AR: "Arkansas", CA: "California", 
  CO: "Colorado", CT: "Connecticut", DE: "Delaware", FL: "Florida", GA: "Georgia", 
  HI: "Hawaii", ID: "Idaho", IL: "Illinois", IN: "Indiana", IA: "Iowa", 
  KS: "Kansas", KY: "Kentucky", LA: "Louisiana", ME: "Maine", MD: "Maryland", 
  MA: "Massachusetts", MI: "Michigan", MN: "Minnesota", MS: "Mississippi", MO: "Missouri", 
  MT: "Montana", NE: "Nebraska", NV: "Nevada", NH: "New Hampshire", NJ: "New Jersey", 
  NM: "New Mexico", NY: "New York", NC: "North Carolina", ND: "North Dakota", OH: "Ohio", 
  OK: "Oklahoma", OR: "Oregon", PA: "Pennsylvania", RI: "Rhode Island", SC: "South Carolina", 
  SD: "South Dakota", TN: "Tennessee", TX: "Texas", UT: "Utah", VT: "Vermont", 
  VA: "Virginia", WA: "Washington", WV: "West Virginia", WI: "Wisconsin", WY: "Wyoming"
};

// Initialize the map
let myMap = L.map("map-id", {
  center: [37.0902, -95.7129],
  zoom: 5,
});

// Add base layers to the map
let baseLayers = {
  OpenStreetMap: L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "&copy; OpenStreetMap contributors",
  }),
  "Carto Voyager": L.tileLayer("https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png", {
    attribution: "&copy; OpenStreetMap contributors & CARTO",
  }),
};

baseLayers["Carto Voyager"].addTo(myMap);


// Markers and filters
let allMarkers = [];
let selectedYear = "All";
let selectedWeather = "All";

// Add the choropleth layer for licensed drivers

function getDriversColor(driversCount) {
  return driversCount > 20000000
    ? "#FFD700"
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
    : "#FFFFF0";
}

let driversChoroplethLayer = null;

function addDriversChoropleth() {
  d3.csv(driversDataPath)
    .then((driversData) => {
      d3.json(geoJsonPath)
        .then((geoJsonData) => {
          const driversByState = {};

          driversData.forEach((record) => {
            const stateAbbr = record.State.trim();
            const driversCount = +record.Drivers;
            const fullStateName = stateMapping[stateAbbr];
            if (fullStateName && driversCount) {
              driversByState[fullStateName] = driversCount;
            }
          });

          // Add drivers data to GeoJSON features
          geoJsonData.features.forEach((feature) => {
            const stateName = feature.properties.name;
            feature.properties.driversCount = driversByState[stateName] || 0;
          });

          // Create and add the choropleth layer
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
                <p><strong>Licensed Drivers:</strong> ${driversCount ? driversCount.toLocaleString() : "No data"}</p>
              `);
            },
          });

          // Add the choropleth layer to the map
          driversChoroplethLayer.addTo(myMap);

          // Add layer toggle control
          L.control.layers(null, { "Drivers Choropleth": driversChoroplethLayer }, { position: "bottomleft" }).addTo(myMap);
        })
        .catch((error) => console.error("Error loading GeoJSON data: ", error));
    })
    .catch((error) => console.error("Error loading drivers data: ", error));
}

// Call the function to add the choropleth layer
addDriversChoropleth();


// Map weather conditions to simplified categories based on the new filtering criteria
const weatherCategories = {
  windy: [
    "Wind", "Thunderstorm", "Blowing", "T-Storm", "Funnel Cloud", "Squalls", "Sand", "Dust", 
    "Light Thunderstorms and Rain", "Heavy Thunderstorms and Rain", "Thunderstorm", 
    "Thunder / Windy", "Heavy T-Storm / Windy", "Rain / Windy", "Light Rain / Windy", 
    "Partly Cloudy / Windy", "Cloudy / Windy", "Haze / Windy", "Wintry Mix / Windy", "Tornado",
    "Thunderstorms and Rain","Thunder","Fair / Windy","Mostly Cloudy / Windy","Wintry Mix",
    "Light Snow / Windy","Heavy Snow / Windy","Heavy Rain / Windy","Snow / Windy","Blowing Dust / Windy",
    "T-Storm / Windy","Light Drizzle / Windy","Sand / Dust Whirlwinds","Widespread Dust",
    "Freezing Rain / Windy","Blowing Snow / Windy","Fog / Windy","Thunder and Hail","Sleet / Windy",
    "Drizzle / Windy","Light Freezing Rain / Windy","Light Snow and Sleet / Windy","Snow and Sleet / Windy",
    "Thunder / Wintry Mix / Windy","Blowing Dust"
  ],
  rainy: [
    "Rain", "Heavy Rain", "Light Rain", "Rain Showers", "Light Drizzle", "Drizzle", "Rain / Windy", 
    "Light Freezing Rain", "Thunderstorms and Rain", "Heavy Drizzle", "Light Snow and Sleet", 
    "Rain Showers", "Showers in the Vicinity", "Light Rain with Thunder", 
    "Freezing Drizzle", "Winter Mix", "Light Thunderstorms and Rain",
    "Heavy Thunderstorms and Rain","Light Freezing Drizzle","Light Rain / Windy","Wintry Mix / Windy",
    "Drizzle and Fog","Small Hail","Heavy Rain / Windy","Light Rain Shower","Light Drizzle / Windy",
    "Light Sleet","Light Ice Pellets","Freezing Rain","Freezing Rain / Windy","Thunder and Hail",
    "Heavy Sleet","Sleet / Windy","Drizzle / Windy","Light Freezing Rain / Windy",
    "Light Snow and Sleet / Windy","Snow and Sleet / Windy","Thunder / Wintry Mix / Windy","Sleet"
  ],
  foggy: [
    "Fog", "Mist", "Haze", "Shallow Fog", "Patches of Fog", "Drizzle and Fog","Haze / Windy",
    "Partial Fog","Light Freezing Fog","Fog / Windy"
  ],
  snowy: [
    "Snow", "Heavy Snow", "Light Snow", "Light Snow / Windy", "Snow", "Wintry Mix", 
    "Light Snow and Sleet", "Winter Mix / Windy", "Freezing Drizzle", "Winter Mix","Wintry Mix / Windy",
    "Small Hail","Heavy Snow / Windy","Snow / Windy","Light Sleet","Blowing Snow","Snow Showers",
    "Light Ice Pellets","Snow and Sleet","Blowing Snow / Windy","Heavy Sleet","Light Snow Shower",
    "Sleet / Windy","Light Snow and Sleet / Windy","Snow and Sleet / Windy","Thunder / Wintry Mix / Windy",
    "Sleet"
  ],
  clear: ["Clear", "N/A Precipitation","Fair", "Fair / Windy","0",""],
  cloudy: [
    "Scattered Clouds", "Mostly Cloudy", "Partly Cloudy", "Cloudy", "Cloudy / Windy", 
    "Mostly Cloudy / Windy", "Overcast","Partly Cloudy / Windy","Tornado","Heavy T-Storm / Windy",
    "T-Storm / Windy"
  ]
};

// Color Mapping for Each Category
const weatherColors = {
  windy: "gray",  // Windy conditions
  rainy: "blue",    // Rainy conditions
  foggy: "darkgray",    // Foggy conditions
  snowy: "lightblue", // Snowy conditions
  clear: "green",   // Clear weather
  cloudy: "lightgray" // Cloudy conditions

};

function findCategory(weather) {
  for (const [category, conditions] of Object.entries(weatherCategories)) {
    if (conditions.includes(weather)) {
      return category;
    }
  }
  return "other"; // Default category
}

// Define function to get weather color based on category
function getWeatherColor(weather) {
  const category = findCategory(weather);
  return weatherColors[category] || "black"; // Fallback to black if not found
}
const weatherFilter = document.getElementById("weatherFilter");

// Load accident data and markers
d3.csv(csvPath)
  .then((accidentData) => {
    accidentData.forEach((record) => {
      const weather = record.Weather_Condition;
      console.log(weather); // Debug: log the weather condition

      if (record.State && record.Severity && record.Start_Time) {
        const year = new Date(record.Start_Time).getFullYear().toString();
        const weatherColor = getWeatherColor(weather);

        // Create the marker
        const marker = L.circleMarker([+record.Start_Lat, +record.Start_Lng], {
          radius: 2,
          color: weatherColor,
          fillOpacity: 0.6,
        }).bindPopup(`
          <p><strong>Year:</strong> ${year}</p>
          <p><strong>Weather:</strong> ${weather}</p>
          <p><strong>Severity:</strong> ${record.Severity}</p>
          <p><strong>Description:</strong> ${record.Description}</p>
        `);

        // Store marker with metadata
        allMarkers.push({
          year: year,
          weather: weather,
          marker: marker,
        });
      }
    });

    // After data is loaded, update the map
    updateMap();
  })
  .catch((error) => console.error("Error loading data: ", error));

// Event listeners for dropdown filters
document.getElementById("yearFilter").addEventListener("change", (event) => {
  selectedYear = event.target.value;
  updateMap();
});

document.getElementById("weatherFilter").addEventListener("change", (event) => {
  selectedWeather = event.target.value;
  updateMap();
});

// Function to update the map based on filters
function updateMap() {
  // Remove all existing markers
  myMap.eachLayer((layer) => {
    if (layer instanceof L.CircleMarker) {
      myMap.removeLayer(layer);
    }
  });

  // Add markers based on year and weather filters
  allMarkers.forEach(({ year, weather, marker }) => {
    const yearMatch = selectedYear === "All" || year === selectedYear;
    const weatherMatch = selectedWeather === "All" || findCategory(weather) === selectedWeather;

    if (yearMatch && weatherMatch) {
      marker.addTo(myMap);
    }
  });
}

document.getElementById("yearFilter").addEventListener("change", (event) => {
  selectedYear = event.target.value;
  updateMap();
});

document.getElementById("weatherFilter").addEventListener("change", (event) => {
  selectedWeather = event.target.value;
  updateMap();
});


