const map = L.map('map', { zoomControl: false, attributionControl: false }).setView([23.6850, 90.3563], 7);
let geoJsonLayer;

function getStyle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return { fillColor: isDark ? '#1E1E2F' : '#E2E8F0', weight: 1.5, color: isDark ? '#7C3AED' : '#06B6D4', fillOpacity: 0.7 };
}

function onEachFeature(feature, layer) {
    const districtName = feature.properties.adm2_name; 

    if(districtName) {
        layer.bindTooltip(districtName, { permanent: false, direction: 'center', className: 'map-tooltip' });
    }

    layer.on({
        // মাউস নিলে ডাটা আপডেট হবে
        mouseover: (e) => { 
            e.target.setStyle({ fillColor: '#7C3AED', fillOpacity: 0.9, color: '#F59E0B', weight: 3 }); 
            e.target.bringToFront(); 
            
            // হোভার করলেই সিগন্যাল পাঠানো হচ্ছে
            if(districtName) {
                document.dispatchEvent(new CustomEvent('districtSelected', { detail: { name: districtName } }));
            }
        },
        // মাউস সরালে স্টাইল রিসেট
        mouseout: (e) => { if (geoJsonLayer) geoJsonLayer.resetStyle(e.target); },
        
        // ক্লিকে শুধু জুম হবে
        click: (e) => {
            if(districtName) {
                map.fitBounds(e.target.getBounds());
            }
        }
    });
}

async function loadMap() {
    try {
        const response = await fetch('./data/map.json');
        const data = await response.json();
        geoJsonLayer = L.geoJSON(data, { style: getStyle(), onEachFeature: onEachFeature }).addTo(map);
        const loader = document.getElementById('loader');
        if(loader) loader.classList.add('fade-out');
    } catch (err) { console.error("Map load error:", err); }
}

loadMap();
