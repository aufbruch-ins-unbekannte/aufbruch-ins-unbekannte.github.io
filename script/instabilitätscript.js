// GeoJSON-Daten für Sudan-Grenzen laden und zur Karte hinzufügen
fetch("./geoBoundaries-SDN-ADM0.geojson") // Pfad zur GeoJSON-Datei des Sudan
  .then((response) => response.json())
  .then((sudanData) => {
    L.geoJSON(sudanData, {
      style: function (feature) {
        return {
          color: mainColor1, // Farbe der Umrisse
          weight: 2.5, // Stärke der Umrisse
          opacity: 1, // Deckkraft der Umrisse
          fillColor: mainColor1, // Füllfarbe (optional)
          fillOpacity: 0.1, // Transparenz der Füllung (optional)
        };
      },
    }).addTo(instabilitätLayerGroup); // Hinzufügen der Sudan-Umrisse zur Karte
  })
  .catch((error) =>
    console.error("Fehler beim Laden der Sudan-Grenzdaten:", error)
  );

// Funktion zum Laden der JSON-Daten für jede Ebene und Hinzufügen zu einer LayerGroup
function loadJsonDataToLayerGroup(
  url,
  color,
  minRadius,
  maxRadius,
  layerGroup
) {
  fetch(url) // Den Pfad zur JSON-Datei anpassen
    .then((response) => response.json()) // JSON-Daten parsen
    .then((jsonData) => {
      // Füge Marker für jede Region hinzu
      var maxIndividuals = Math.max(
        ...jsonData.data.map((region) => parseInt(region.individuals))
      );

      jsonData.data.forEach(function (region) {
        // Berechne den Radius basierend auf der Anzahl der betroffenen Personen
        var radius =
          minRadius +
          (parseInt(region.individuals) / maxIndividuals) *
            (maxRadius - minRadius);

        var marker = L.circleMarker(
          [region.centroid_lat, region.centroid_lon],
          {
            radius: radius,
            fillColor: color,
            color: color,
            weight: 0,
            opacity: 1,
            fillOpacity: 0.7,
          }
        );

        // Popup mit Regionennamen und Anzahl der betroffenen Personen
        // marker.bindPopup(
        //   "<b>" +
        //     region.name +
        //     "</b><br>Betroffene Personen: " +
        //     region.individuals
        // );

        // Füge den Marker zur LayerGroup hinzu
        layerGroup.addLayer(marker);
      });
    })
    .catch((error) => {
      console.error("Fehler beim Laden der JSON-Daten:", error);
    });
}

// Definiere den minimalen und maximalen Radius
var minRadius = 2; // Minimaler Radius
var maxRadius = 30; // Maximaler Radius

// LayerGroup für alle Ebenen erstellen
const instabilitätLayerGroup = L.layerGroup();

// Laden der JSON-Daten und Hinzufügen zur LayerGroup
loadJsonDataToLayerGroup(
  "./Instablilität/IP_Migration-Instabilität-Sudan-Karte/unhcr-data-refugees.json",
  mainColor1,
  minRadius,
  maxRadius,
  instabilitätLayerGroup
);
loadJsonDataToLayerGroup(
  "./Instablilität/IP_Migration-Instabilität-Sudan-Karte/unhcr-data-idps.json",
  mainColor2,
  minRadius,
  maxRadius,
  instabilitätLayerGroup
);
loadJsonDataToLayerGroup(
  "./Instablilität/IP_Migration-Instabilität-Sudan-Karte/unhcr-data-refugeeReturnees.json",
  mainColor3,
  minRadius,
  maxRadius,
  instabilitätLayerGroup
);
loadJsonDataToLayerGroup(
  "./Instablilität/IP_Migration-Instabilität-Sudan-Karte/unhcr-data-selfRelocatedRefugees.json",
  mainColor4,
  minRadius,
  maxRadius,
  instabilitätLayerGroup
);

// LayerGroup zur Karte hinzufügen
// instabilitätLayerGroup.addTo(map);
