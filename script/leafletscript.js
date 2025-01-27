// ==================== Karte Initialisieren ==================

// Karte initialisieren
const map = L.map("map", {
  center: [30, 0], // Zentraler Punkt
  zoom: 2.5, // Zoomlevel
  maxBounds: [
    [-85.05112878, -180], // Südwestliche Ecke der Weltkarte
    [85.05112878, 180], // Nordöstliche Ecke der Weltkarte
  ],
  worldCopyJump: true, // Verhindert unendliches Scrollen
  zoomControl: false,
  doubleClickZoom: false,
});

// Füge den Positron Tile Layer von CartoDB hinzu
// Füge den Dark Matter Tile Layer von CartoDB hinzu
const baseLayer = L.tileLayer(
  "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
  {
    attribution: "&copy; <a href='https://carto.com/attributions'>CartoDB</a>",
    subdomains: ["a", "b", "c", "d"],
    maxZoom: 18,
    minZoom: 2.5,
  }
).addTo(map);

// Setze maximale Begrenzungen
map.setMaxBounds([
  [-85.05112878, -180], // Südwestliche Ecke
  [85.05112878, 180], // Nordöstliche Ecke
]);

// ============================ Navigation ========================================

const hideAllLayers = () => {
  map.eachLayer((layer) => {
    if (layer !== baseLayer) map.removeLayer(layer);
  });
};

const showLayer = (layerGroup) => {
  hideAllLayers();
  layerGroup.addTo(map);
};

let minimized = true;

const changeview = (lat, lon, zoom, layerGroup, maxZoom, name, menuType) => {
  map.setView([lat, lon], zoom);
  showLayer(layerGroup);
  changeMenu(menuType);
  zoomThreshold = maxZoom;
  if (name) {
    changeInfo(name);
  }
  minimized = layerGroup !== navigationLayer;
  minimizeInfo();
};

const changeMenu = (menuType) => {
  graphicsMenubar.innerHTML =
    menuType === "handelMenu"
      ? `<div class='menu handelMenu' id='handelMenuH1' onclick='highlightVisaType("H1 Visa")'>H 1</div>
     <div class='menu handelMenu' id='handelMenuH2' onclick='highlightVisaType("H2 Visa")'>H 2</div>
     <div class='menu handelMenu' id='handelMenuH3' onclick='highlightVisaType("H3 Visa")'>H 3</div>
     <div class='menu handelMenu' id='handelMenuH4' onclick='highlightVisaType("H4 Visa")'>H 4</div>`
      : "";
};
// ============================= Legenden und Infoebene =================================

const info = L.control({ position: "topright" });
const infolegend = L.DomUtil.create("div", "");

info.onAdd = () => {
  infolegend.setAttribute("id", "info");
  infolegend.innerHTML = `
    <div id="minimizebtn">></div>
    <div id="infoContainer">
      <h1 id="infoHeadline">Wie ist das heute?</h1>
      <h3 id="infoSubhead">Gründe für Migration sind vielseitig und selten monokausaler Natur. Diese Infografiken zeigen, wo heute Migrationsgründe vorliegen und entstehen</h3>
      <div id="infoText"></div>
      <h4 id="infoSrc">Kartendaten von Open Street Map, Tiles von CartoDB</h4>
    </div>`;
  return infolegend;
};

info.addTo(map);

const infoContainer = document.querySelector("#infoContainer");
L.DomEvent.disableScrollPropagation(infoContainer);

const minimizebtn = document.querySelector("#minimizebtn");
const infoHeadline = document.querySelector("#infoHeadline");
const infoSubhead = document.querySelector("#infoSubhead");
const infoText = document.querySelector("#infoText");
const infoSrc = document.querySelector("#infoSrc");

minimizebtn.addEventListener("click", () => minimizeInfo());

const minimizeInfo = () => {
  infoContainer.style.display = minimized ? "block" : "none";
  minimizebtn.textContent = minimized ? "X" : "i";
  minimized = !minimized;
};

const changeInfo = (name) => {
  console.log(name);
  const infoData = {
    expansion: {
      headline: "Russischer Imperialismus in der Ukraine (G 30.1)",
      subhead:
        "Der imperialistische Angriffskrieg Russlands gegen die Ukraine hat eine der größten innereuropäischen Migrationsbewegungen der vergangenen Jahrzehnte ausgelöst. Seit Februar 2022 haben massive Angriffe gegen Zivilist*innen Millionen Menschen dazu gezwungen, ihre Heimat zu verlassen.",
      text: ` <div class="ukraineLegendContainer">
      <span class="country-label">1.000.000</span> <span class="legendText">Anzahl ukrainischer Schutzsuchenden</span>
      <span class="gradientWrapper margin">
        <span class="smallText">>25</span>
        <span class="smallText">0.5</span> 
        <span class="ukraine-gradient"></span>
      </span>
      </span><span class="legendText margin">Ukrainische Schutzsuchende pro 1000 Einwohner</span>
      </div>      `,
      src: "Stand: November 2024; Quelle: EU/eurostat",
    },
    ressourcenknappheit: {
      headline: "Wassermangel als Migrationsgrund (G 30.4)",
      subhead:
        "Die Karte zeigt den prognostizierten Wasserstress für das Jahr 2050, wenn weiter wie bisher Wasser entnommen wird und keine weiteren Maßnahmen getroffen werden. Der Wasserstress errechnet sich aus den vorhandenen erneuerbaren Frischwasservorkommen und dem Wasserverbrauch.",
      text: `
        <div class="textlegend"><span class="bgColorOne colorlabel"></span> <span class="legendText">>1 kein Wasserstress</span></div>
        <div class="textlegend"><span class="bgColorTwo colorlabel"></span> <span class="legendText">1–2 kein Wasserstress</span></div>
        <div class="textlegend"><span class="bgColorThree colorlabel"></span> <span class="legendText">2–3 kein Wasserstress</span></div>
        <div class="textlegend"><span class="bgColorFour colorlabel"></span> <span class="legendText">3–4 kein Wasserstress</span></div>
        <div class="textlegend"><span class="bgColorFive colorlabel"></span> <span class="legendText">>4 extremer Wasserstress</span></div>`,
      src: "Quellen: World Resources Institute, HydroSHEDS",
    },
    instabilität: {
      headline: "Bürgerkrieg im Sudan (G 30.2)",
      subhead:
        "Die Karte zeigt, in welche Regionen vom Bürgerkrieg im Sudan betroffene Menschen geflohen sind. ",
      text: `<div class="textlegend"><span class="mainColorOne  colorlabel"></span > <span class="legendText">Neu angekommene Flüchtlinge/Asylbewerber*innen</span></div>
      <div class="textlegend"><span class="mainColorTwo colorlabel"></span> <span class="legendText">Neu angekommene "refugee returnees", die zuvor in den Sudan geflohen waren und nun in ihre Heimatregionen zurückkehren</span></div>
      <div class="textlegend"><span class="mainColorThree colorlabel"></span> <span class="legendText">Binnenvertriebene im Sudan</span></div>
      <div class="textlegend"><span class="mainColorFour colorlabel"></span> <span class="legendText">"self-relocated refugees", die zuvor geflohen sind und nun erneut fliehen</span></div>`,
      src: "Stand: Dezember 2024; Quelle: UNHCR",
    },
    handel: {
      headline: "Arbeitsmigration in die USA<br> (G 30.5)",
      subhead:
        "Die Karte zeigt die 10 Länder mit den meisten Einwanderungen in die USA über sogenannte Employment-Based Visa. Diese ermöglichen Fachkräften, Unternehmern und Investoren, dauerhaft in die USA einzuwandern und werden in folgende Kategorien unterteilt:",
      text: `
        <div class="textlegend"><span class="mainColorOne colorlabel"></span> <span class="legendText">E1 – Personen mit außergewöhnlichen Fähigkeiten, wie z. B. International anerkannte Wissenschaftler*innen, bestimmte Manager*innen und Führungskräfte</span></div>
        <div class="textlegend"><span class="mainColorTwo colorlabel"></span><span class="legendText">E2 – Personen mit Hochschulabschluss oder besonderen Fähigkeiten und Stellenangebot in den USA.</span></div>
        <div class="textlegend"><span class="mainColorThree colorlabel"></span><span class="legendText">E3 – Fachkräfte und sonstige Arbeitnehmer*innen</span></div>
        <div class="textlegend"><span class="mainColorFour colorlabel"></span><span class="legendText">E4 – Religiöse und kirchliche Mitarbeiter*innen</span></div>`,
      src: "Quelle: US Department of State",
    },
    vertreibung: {
      headline: "Verfolgung der Rohingya in Myanmar (G 30.3)",
      subhead:
        "Die Karte zeigt im Zeitraum 2017–2018 in Myanmar zerstörte Dörfer, deren Bevölkerung mehrheitlich der Minderheit der Rohingya angehörte, sowie die Flüchtlingslager der Vertriebenen Rohingya in Bangladesch.",
      text: `
        <div class="textlegend"><span class="mainColorTwo  colorlabel"></span> <span class="legendText">Zerstörte Dörfer</span></div>
        <div class="textlegend"><span class="mainColorOne colorlabel"></span> <span class="legendText">Flüchtlingslager</span></div>`,
      src: "Stand: Dezember 2024; Quellen: UNHCR, UNITAR/UNOSAT",
    },
    default: {
      headline: "Wie ist das Heute?",
      subhead:
        "Gründe für Migration sind vielseitig und selten monokausaler Natur. Diese Infografiken zeigen, wo heute Migrationsgründe vorliegen und entstehen.",
      text: "",
      src: "Kartendaten von Open Street Map, Tiles von CartoDB",
    },
  };

  const data = infoData[name] || infoData["default"];
  infoHeadline.innerHTML = data.headline;
  infoSubhead.textContent = data.subhead;
  infoText.innerHTML = data.text;
  infoSrc.textContent = data.src;
};

// ===============================  Navigationselement ===============================

const NavLegend = L.control({ position: "bottomleft" });
const NavDiv = L.DomUtil.create("div", "");

NavLegend.onAdd = () => {
  NavDiv.innerHTML =
    "<div class='navigationItem' id='mainmenubtn' onclick='returnToMain()'></div>";
  return NavDiv;
};

NavLegend.addTo(map);

function returnToMain() {
  // showLoadingScreen(200);
  changeview(30, 0, 2.5, navigationLayer, 18, "navigation");
  // setTimeout(hideLoadingScreen, 200);
}

// =============================== Zur Übersicht zurückkehren beim Rauszoomen =====================

// let zoomThreshold = 13;
// let lastZoomState = null;

// const checkZoomLevel = () => {
//   const currentZoom = Math.round(map.getZoom() * 10) / 10; // Runde auf die erste Nachkommastelle
//   if (currentZoom < zoomThreshold && lastZoomState !== "small") {
//     console.log(`Zoomstufe ist kleiner als ${zoomThreshold}: ${currentZoom}`);
//     lastZoomState = "small";
//     changeview(30, 0, 2.5, navigationLayer);
//   } else if (currentZoom >= zoomThreshold && lastZoomState !== "large") {
//     console.log(
//       `Zoomstufe ist ${currentZoom}, über oder gleich ${zoomThreshold}`
//     );
//     lastZoomState = "large";
//   }
// };

// map.on("zoomend", checkZoomLevel);

//  ===================== Karte nach Zeitintervall ohne Interaktion zurücksetzen =======================

let inactivityTimeout;
const inactivityDuration = 60000; // 60 Sekunden

const onInactivity = () => changeview(30, 0, 2.5, navigationLayer);

const resetInactivityTimer = () => {
  clearTimeout(inactivityTimeout);
  inactivityTimeout = setTimeout(onInactivity, inactivityDuration);
};

map.on("mousemove", resetInactivityTimer);
map.on("click", resetInactivityTimer);
map.on("zoom", resetInactivityTimer);
map.on("zoomend", resetInactivityTimer);

resetInactivityTimer();

//  ====================================== Infografiken Bedienfelder ====================================

const graphicsMenu = L.control({ position: "bottomright" });
const graphicsMenubar = L.DomUtil.create("div", "graphicsMenubar");

graphicsMenu.onAdd = () => {
  graphicsMenubar.innerHTML = "";
  return graphicsMenubar;
};

graphicsMenu.addTo(map);

//  ========================================= Navigation layer =======================================
const navigationLayer = L.layerGroup().addTo(map);

// Function to show the loading screen
function showLoadingScreen(delay) {
  const loadingScreen = document.getElementById("loading-screen");
  const progressBar = loadingScreen.querySelector(".progress");
  progressBar.style.animation = `progress ${delay / 1000}s linear infinite`;
  loadingScreen.style.display = "flex";
}

// Function to hide the loading screen
function hideLoadingScreen() {
  document.getElementById("loading-screen").style.display = "none";
}

const NavDots = [
  {
    name: "ressourcenknappheit",
    latlong: [38, 11],
    backgroundColor: "#6e849d",
    text: "G 30.4" + "<br>" + "Ressourcen-" + "<br>" + "knappheit",
    zoom: 4.5,
    layer: europeAfricaLayer,
    maxZoom: 4,
    menuType: "",
    delay: 1000,
  },
  {
    name: "instabilität",
    latlong: [13, 32],
    backgroundColor: "#8c8182",
    text: "G 30.2" + "<br>" + "Instabilität",
    zoom: 5,
    layer: instabilitätLayerGroup,
    maxZoom: 4,
    menuType: "",
    delay: 400,
  },
  {
    name: "vertreibung",
    latlong: [20.8099, 92.5727],
    backgroundColor: "#8a90aa",
    text: "G 30.3" + "<br>" + "Vertreibung",
    zoom: 9.5,
    layer: displacementLayerGroup,
    maxZoom: 8,
    menuType: "",
    delay: 0,
  },
  {
    name: "expansion",
    latlong: [49.377634, 38],
    backgroundColor: "#597075",
    text: "G 30.1" + "<br>" + "Expansion",
    zoom: 4.5,
    layer: ukraineLayerGroup,
    maxZoom: 4,
    menuType: "",
    delay: 400,
  },
  {
    name: "handel",
    latlong: [38.412897, -100.52341],
    backgroundColor: "#90a1c0",
    text: "G 30.5" + "<br>" + "Handel",
    zoom: 3,
    layer: handelLayer,
    menuType: "handelMenu",
    maxZoom: 3,
    delay: 200,
  },
];

NavDots.forEach((element) => {
  const navDot = L.circleMarker(element.latlong, {
    radius: 60, // Größe der Marker
    fillColor: element.backgroundColor, // Farbe der Marker
    weight: 0, // Randbreite
    fillOpacity: 1, // Transparenz
  }).addTo(navigationLayer);

  const labelResource = L.tooltip({
    permanent: true,
    direction: "center",
    className: "labelText",
  })
    .setContent(element.text)
    .setLatLng(element.latlong)
    .addTo(navigationLayer);

  navDot.addEventListener("click", () => {
    console.log(
      element.latlong[0],
      element.latlong[1],
      element.zoom,
      element.layer,
      element.maxZoom,
      element.name,
      element.menuType
    );

    // Show the loading screen with the delay
    showLoadingScreen(element.delay);

    // Change the view and hide the loading screen once the map has loaded
    changeview(
      element.latlong[0],
      element.latlong[1],
      element.zoom,
      element.layer,
      element.maxZoom,
      element.name,
      element.menuType
    );

    // Hide the loading screen after the specified delay
    setTimeout(hideLoadingScreen, element.delay); // Adjust the delay as needed
  });
});

// Function to request fullscreen mode
function requestFullscreen() {
  const element = document.documentElement;
  if (element.requestFullscreen) {
    element.requestFullscreen();
  } else if (element.mozRequestFullScreen) {
    // Firefox
    element.mozRequestFullScreen();
  } else if (element.webkitRequestFullscreen) {
    // Chrome, Safari and Opera
    element.webkitRequestFullscreen();
  } else if (element.msRequestFullscreen) {
    // IE/Edge
    element.msRequestFullscreen();
  }
}

window.onload = () => {
  changeview(30, 0, 2.5, navigationLayer);
};

// document.addEventListener(
//   "click",
//   () => {
//     requestFullscreen();
//   },
//   { once: true }
// );

// document.addEventListener("fullscreenchange", () => {
//   if (!document.fullscreenElement) {
//     console.log("Exited fullscreen. Re-entering fullscreen...");
//     requestFullscreen();
//   }
// });
