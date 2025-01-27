// Funktion zur Zuordnung von Farben basierend auf Wasserstress
function getWaterColor(waterStressValue) {
  if (waterStressValue == "null") return "#ffffff"; // grau
  if (waterStressValue > 4.0) return "#241ba7"; // Dunkellila
  if (waterStressValue > 3.0) return "#3d34bf"; // Lila
  if (waterStressValue > 2.0) return "#6F66EC"; // Magenta
  if (waterStressValue > 1.0) return "#9F99F3"; // Rosa
  return "#CFCCF9"; // Hellgelb
}

// Funktion zum Laden und Verarbeiten von GeoJSON-Daten
async function loadGeoJsonLayer(url, layerGroup) {
  try {
    const response = await fetch(url);
    const data = await response.json();

    // Vereinfachung der Geometrien mit Turf.js
    const simplifiedData = turf.simplify(data, {
      tolerance: 0.01,
      highQuality: true,
    });

    // Hinzufügen der GeoJSON-Daten zur Karte
    const geoJsonLayer = L.geoJson(simplifiedData, {
      style: (feature) => ({
        color: getWaterColor(feature.properties.bau50_ws_x_s), // Farbzuweisung
        weight: 1,
        fillOpacity: 0.7,
      }),
    });

    // GeoJSON-Daten zur LayerGroup hinzufügen
    layerGroup.addLayer(geoJsonLayer);
  } catch (error) {
    console.error("Fehler beim Laden der GeoJSON-Datei:", error);
  }
}

// LayerGroup für Europa und Afrika erstellen
const europeAfricaLayer = L.layerGroup();

// Daten für Europa und Afrika hinzufügen
const geoJsonUrls = [
  "./merged_data_2050.geojson",
  "./merged_data_africa_2050.geojson",
];

geoJsonUrls.forEach((url) => loadGeoJsonLayer(url, europeAfricaLayer));

// Layer zur Karte hinzufügen
// europeAfricaLayer.addTo(map);

// Legende hinzufügen
// const legend = L.control({ position: "bottomright" });

// legend.onAdd = function () {
//   const div = L.DomUtil.create("div", "legend");
//   const grades = [0, 1, 2, 3, 4];
//   const labels = ["< 1.0", "1.0 - 2.0", "2.0 - 3.0", "3.0 - 4.0", "> 4.0"];
//   const colors = ["#FFFFE0", "#FFB6C1", "#FF00FF", "#9400D3", "#4B0082"];

//   div.innerHTML += `<strong>Predicted Water Stress by 2050 (business as usual)</strong><br>`;
//   grades.forEach((grade, i) => {
//     div.innerHTML +=
//       `<span class="legend-color" style="background:${colors[i]}"></span>` +
//       `${labels[i]}<br>`;
//   });

//   return div;
// };

// legend.addTo(map);
