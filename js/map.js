const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([23.6850, 90.3563], 7);
let geoJsonLayer;

function getStyle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return { 
        fillColor: isDark ? '#1E1E2F' : '#E2E8F0', 
        weight: 1.5, 
        color: isDark ? '#7C3AED' : '#06B6D4', 
        fillOpacity: 0.7 
    };
}

function onEachFeature(feature, layer) {
    // Tooltip showing district name
    if(feature.properties && feature.properties.NAME_2) {
        layer.bindTooltip(feature.properties.NAME_2, { permanent: false, direction: 'center' });
    }

    layer.on({
        mouseover: (e) => { 
            e.target.setStyle({ fillColor: '#7C3AED', fillOpacity: 0.9, color: '#F59E0B', weight: 3 }); 
            e.target.bringToFront(); 
        },
        mouseout: (e) => { geoJsonLayer.resetStyle(e.target); },
        click: (e) => {
            map.fitBounds(e.target.getBounds());
            // Send the district name to app.js
            document.dispatchEvent(new CustomEvent('districtSelected', { detail: { name: feature.properties.NAME_2 } }));
        }
    });
}

async function loadMap() {
    try {
        // Fetching local map.json
        const response = await fetch('./data/map.json');
        const data = await response.json();
        
        geoJsonLayer = L.geoJSON(data, { style: getStyle(), onEachFeature: onEachFeature }).addTo(map);
        
        setTimeout(() => {
            document.getElementById('loader').classList.add('fade-out');
        }, 800);
    } catch (err) {
        document.querySelector('.loader-container h2').innerText = "Please add data/map.json file!";
        console.error("Map load error:", err);
    }
}

loadMap();
