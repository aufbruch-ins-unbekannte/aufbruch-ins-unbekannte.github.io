

// LayerGroup für Vertreibungsdaten erstellen
const displacementLayerGroup = L.layerGroup();

// Constants
const VILLAGE_MARKER_OPTIONS = {
  radius: 6,
  fillColor: mainColor2,
  color: "darkred",
  weight: 0,
  fillOpacity: 0.5,
};
const CAMP_MARKER_OPTIONS = {
  fillColor: mainColor1,
  weight: 0,
  fillOpacity: 0.5,
};
const MIN_RADIUS = 2;
const MAX_RADIUS = 60;
const MIN_INDIVIDUALS = 0;
const MAX_INDIVIDUALS = 100000;

// Function to calculate radius based on individuals
const calculateRadius = (individuals) => {
  return Math.max(
    MIN_RADIUS,
    Math.min(
      ((individuals - MIN_INDIVIDUALS) / (MAX_INDIVIDUALS - MIN_INDIVIDUALS)) *
        (MAX_RADIUS - MIN_RADIUS) +
        MIN_RADIUS,
      MAX_RADIUS
    )
  );
};

// Function to load GeoJSON data
const loadGeoJSON = async (url, layerGroup, markerOptions, popupContent) => {
  try {
    const response = await fetch(url);
    const data = await response.json();
    L.geoJSON(data, {
      pointToLayer: (feature, latlng) => L.circleMarker(latlng, markerOptions),
      onEachFeature: (feature, layer) => {
        layer.bindPopup(popupContent(feature));
      },
    }).addTo(layerGroup);
  } catch (error) {
    console.error(`Fehler beim Laden der GeoJSON-Daten von ${url}:`, error);
  }
};

// Function to load JSON data for camps
const loadCampsData = async (url, layerGroup) => {
  try {
    const response = await fetch(url);
    const responseData = await response.json();
    const camps = responseData.data || [];

    camps.forEach((camp) => {
      const lat = camp.centroid_lat;
      const lon = camp.centroid_lon;

      if (lat && lon) {
        const individuals = parseInt(camp.individuals) || 0;
        const radius = calculateRadius(individuals);

        const marker = L.circleMarker([lat, lon], {
          ...CAMP_MARKER_OPTIONS,
          radius: radius,
        });

        const name = camp.geomaster_name || "Unbekannt";
        marker.bindPopup(
          `<b>Camp:</b> ${name}<br><b>Menschen:</b> ${individuals}`
        );

        layerGroup.addLayer(marker);
      }
    });
  } catch (error) {
    console.error(`Fehler beim Laden der Camp-Daten von ${url}:`, error);
  }
};

// Load data and add to layer group
const initDisplacementLayerGroup = async () => {
  await loadGeoJSON(
    "./Vertreibung/AffectedVillages_20180318.geojson",
    displacementLayerGroup,
    VILLAGE_MARKER_OPTIONS,
    (feature) => {
      const village = feature.properties.Village || "Unbekannt";
      const damage = feature.properties.Damage_per || "Keine Angabe";
      return `<b>Dorf:</b> ${village}<br><b>Zerstörungsgrad:</b> ${damage}`;
    }
  );

  await loadCampsData(
    "./Vertreibung/bangladesh-rohingya-refugee-camps-data.json",
    displacementLayerGroup
  );

  // Add the layer group to the map
  // displacementLayerGroup.addTo(map);
};

// Initialize the displacement layer group
initDisplacementLayerGroup();
