// Define a color scale for migration rate (per 1000 persons)
function getColor(value) {
  if (value > 20) return "#241ba7"; // Very saturated blue for the highest values
  if (value > 15) return "#3d34bf"; // Pure Blue
  if (value > 10) return "#6F66EC"; // Dodger Blue
  if (value > 5) return "#9F99F3"; // Steel Blue
  if (value > 2.5) return "#CFCCF9"; // Cadet Blue
  if (value > 0.5) return "#CCD5E2"; // Light Sky Blue
  return "#FFFFFF00"; // White for the lowest value
}

const ukraineLayerGroup = L.layerGroup(); // Ensure this is added to the map in the main script

// Load the GeoJSON map of Europe
fetch("./europe.geojson")
  .then((response) => response.json())
  .then((geojsonData) => {
    // Load the CSV file and extract data
    fetch("./ukraine-migrationdata.csv")
      .then((response) => response.text())
      .then((csvData) => {
        Papa.parse(csvData, {
          header: true,
          skipEmptyLines: true,
          complete: function (results) {
            const migrationData = {};

            // Convert CSV data into a lookup object
            results.data.forEach((row) => {
              let country = row["Country"]?.trim();
              let total = row["Total"]
                ? row["Total"].replace(/,/g, "").trim()
                : "0";
              let per1000 = row["Per 1000"]
                ? parseFloat(row["Per 1000"].trim())
                : 0;

              if (country) {
                migrationData[country] = {
                  total: parseInt(total) || 0,
                  per1000: per1000,
                };
              }
            });

            // Merge GeoJSON with migration data
            L.geoJSON(geojsonData, {
              style: (feature) => {
                let countryName = feature.properties.NAME; // Changed to "NAME"
                // Log the whole properties object for debugging
                console.log("GeoJSON feature properties:", feature.properties);
                let per1000 = migrationData[countryName]?.per1000 || 0;

                if (countryName === "Ukraine") {
                  return {
                    fillColor: mainColor1, // Distinct color for Ukraine
                    weight: 2.5,
                    opacity: 1,
                    color: mainColor1,
                    fillOpacity: 0.1,
                  };
                }

                // Check if the country is included in the data
                if (migrationData[countryName]) {
                  return {
                    fillColor: getColor(per1000),
                    weight: 1,
                    opacity: 1,
                    color: "white", // Add border
                    fillOpacity: 0.8,
                  };
                } else {
                  return {
                    fillColor: getColor(per1000),
                    weight: 0, // No border
                    opacity: 1,
                    color: "white",
                    fillOpacity: 0,
                  };
                }
              },
              onEachFeature: (feature, layer) => {
                let countryName = feature.properties.NAME; // Changed to "NAME"
                let data = migrationData[countryName];

                // Log the CSV data to check for correct country name match
                //   if (data) {
                //     console.log(`CSV Data for ${countryName}:`, data);
                //   }

                if (data) {
                  //   layer.bindPopup(
                  //     `<b>${countryName}</b><br>
                  //       Total: ${data.total.toLocaleString()} people<br>
                  //       Per 1000: ${data.per1000}`
                  //   );

                  // Add a label with absolute numbers
                  let centroid = turf.centroid(feature).geometry.coordinates;

                  let label = L.marker([centroid[1], centroid[0]], {
                    icon: L.divIcon({
                      className: "",
                      html: `<div style="width: fit-content" class="country-label">${data.total.toLocaleString()}</div>`,
                      iconSize: [40, 20],
                    }),
                  });
                  ukraineLayerGroup.addLayer(label); // Add labels to layer group
                }
              },
            }).addTo(ukraineLayerGroup);
          },
        });
      });
  })
  .catch((error) => {
    console.error("Error loading GeoJSON or CSV data:", error);
  });
