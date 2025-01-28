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
      var maxIndividuals = 1008654; // Maximalanzahl der betroffenen Personen (für die Skalierung des Radius)

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

        // Legendenkreisgrößen berechnen
        var groß =
          minRadius +
          (parseInt(1000000) / maxIndividuals) * (maxRadius - minRadius) * 2;
        var mittel =
          minRadius +
          (parseInt(500000) / maxIndividuals) * (maxRadius - minRadius) * 2;
        var klein =
          minRadius +
          (parseInt(100000) / maxIndividuals) * (maxRadius - minRadius) * 2;

        console.log(`groß: ${groß}, mittel: ${mittel}, klein: ${klein}`);

        // Popup mit Regionennamen und Anzahl der betroffenen Personen
        marker.bindPopup(
          "<b>" + region.name + "</b><br> Personen: " + region.individuals
        );

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
var maxRadius = 45; // Maximaler Radius

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
