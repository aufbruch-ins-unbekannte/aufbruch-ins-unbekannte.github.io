


const handelLayer = L.layerGroup();

// Immigration data
const immigrationData = [
  {
    country: "India",
    visas: [16604, 4782, 4301, 709],
    lat: 20.5937,
    lon: 78.9629,
  },
  {
    country: "Brazil",
    visas: [7800, 3951, 2158, 394],
    lat: -14.235,
    lon: -51.9253,
  },
  {
    country: "Philippines",
    visas: [13617, 0, 1243, 151],
    lat: 12.8797,
    lon: 121.774,
  },
  {
    country: "El Salvador",
    visas: [3231, 0, 0, 0],
    lat: 13.7942,
    lon: -88.8965,
  },
  {
    country: "China - mainland born",
    visas: [7007, 6371, 4218, 0],
    lat: 35.8617,
    lon: 104.1954,
  },
  { country: "Guatemala", visas: [2394, 0, 0, 0], lat: 15.7835, lon: -90.2308 },
  { country: "Honduras", visas: [2114, 0, 0, 0], lat: 15.2, lon: -86.2419 },
  {
    country: "Great Britain and Northern Ireland",
    visas: [2839, 0, 0, 0],
    lat: 55.3781,
    lon: -3.436,
  },
  {
    country: "South Korea",
    visas: [3861, 3147, 1316, 339],
    lat: 35.9078,
    lon: 127.7669,
  },
  {
    country: "Mexico",
    visas: [2059, 1802, 4033, 710],
    lat: 23.6345,
    lon: -102.5528,
  },
  {
    country: "Canada",
    visas: [2356, 1796, 1316, 0],
    lat: 56.1304,
    lon: -106.3468,
  },
  { country: "Iran", visas: [2716, 0, 0, 0], lat: 32.4279, lon: 53.688 },
  { country: "Bangladesh", visas: [0, 2012, 0, 0], lat: 23.685, lon: 90.3563 },
  { country: "Vietnam", visas: [0, 0, 2667, 0], lat: 14.0583, lon: 108.2772 },
  { country: "Ecuador", visas: [0, 0, 0, 430], lat: -1.8312, lon: -78.1834 },
  { country: "France", visas: [1403, 0, 0, 0], lat: 46.6034, lon: 1.8883 },
  { country: "Russia", visas: [1111, 0, 0, 0], lat: 61.524, lon: 105.3188 },
  { country: "Taiwan", visas: [0, 1568, 0, 0], lat: 23.6978, lon: 120.9605 },
  { country: "Nigeria", visas: [0, 1545, 1293, 234], lat: 9.082, lon: 8.6753 },
  { country: "Germany", visas: [1002, 0, 0, 0], lat: 51.1657, lon: 10.4515 },
];
const visaLabels = ["H1 Visa", "H2 Visa", "H3 Visa", "H4 Visa"];
const colors = [mainColor1, mainColor2, mainColor3, mainColor4];

// Target location (USA center point)
const usaCoordinates = [37.0902, -95.7129];

// Add immigration data with varying line thickness
immigrationData.forEach((data) => {
  visaLabels.forEach((label, index) => {
    if (data.visas[index] > 0) {
      // Calculate line thickness at the origin
      const lineWidth = Math.sqrt(data.visas[index]) / 5;

      // Create a polyline with a variable thickness at the origin
      const polyline = L.polyline([[data.lat, data.lon], usaCoordinates], {
        color: colors[index],
        weight: lineWidth, // Thickness proportional to visa count
        opacity: 0.8,
        lineCap: "round",
      }).bindPopup(`
        <strong>${data.country}</strong><br>
        Visa Type: ${label}<br>
        Count: ${data.visas[index]}
      `);

      // Add the polyline to the LayerGroup
      handelLayer.addLayer(polyline);
    }
  });
});

// Function to highlight lines of a specific visa type
function highlightVisaType(visaType) {
  const visaIndex = visaLabels.indexOf(visaType); // Get the index of the visa type

  const grayLines = []; // To store the gray lines for the background
  const colorLines = []; // To store the color lines for the foreground

  handelLayer.eachLayer((layer) => {
    if (layer instanceof L.Polyline) {
      const popupContent = layer.getPopup().getContent();
      const visaCount = parseInt(popupContent.match(/Count: (\d+)/)[1], 10); // Extract visa count
      const lineWidth = Math.sqrt(visaCount) / 5; // Calculate line thickness proportionally

      const isMatchingType = popupContent.includes(`Visa Type: ${visaType}`);

      if (isMatchingType) {
        // Highlight matching lines
        layer.setStyle({
          color: colors[visaIndex],
          weight: lineWidth, // Maintain proportional thickness for selected visa type
          opacity: 0.8,
          zIndex: 1000, // Bring matching lines to the front
        });
        colorLines.push(layer); // Add to the color lines array
      } else {
        // Set non-matching lines to gray
        layer.setStyle({
          color: "gray",
          weight: 2, // Maintain same thickness for gray lines
          opacity: 0.5,
          zIndex: -1000, // Push non-matching lines to the background
        });
        grayLines.push(layer); // Add to the gray lines array
      }
    }
  });

  // Remove any existing lines from the map
  handelLayer.clearLayers();

  // Add gray lines to the map first (they will be in the background)
  grayLines.forEach((line) => {
    handelLayer.addLayer(line);
  });

  // Then add color lines to the map (they will be in the foreground)
  colorLines.forEach((line) => {
    handelLayer.addLayer(line);
  });

  minimized = false;
  minimizeInfo();
}
