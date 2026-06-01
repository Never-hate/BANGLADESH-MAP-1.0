const map = L.map('map', { 
    zoomControl: false, 
    attributionControl: false 
}).setView([23.6850, 90.3563], 7);

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
    // নতুন HDX ফাইলের জন্য ADM2_EN ব্যবহার করা হলো
    const districtName = feature.properties.ADM2_EN || feature.properties.NAME_2;

    if(districtName) {
        layer.bindTooltip(districtName, { permanent: false, direction: 'center' });
    }

    layer.on({
        mouseover: (e) => { 
            e.target.setStyle({ fillColor: '#7C3AED', fillOpacity: 0.9, color: '#F59E0B', weight: 3 }); 
            e.target.bringToFront(); 
        },
        mouseout: (e) => { 
            geoJsonLayer.resetStyle(e.target); 
        },
        click: (e) => {
            map.fitBounds(e.target.getBounds());
            // সঠিক নামটি app.js কে পাঠানো হচ্ছে
            document.dispatchEvent(new CustomEvent('districtSelected', { detail: { name: districtName } }));
        }
    });
}

async function loadMap() {
    try {
        // আপনার লোকাল map.json ফাইলটি কল করা হচ্ছে
        const response = await fetch('./data/map.json');
        const data = await response.json();
        
        geoJsonLayer = L.geoJSON(data, { 
            style: getStyle(), 
            onEachFeature: onEachFeature 
        }).addTo(map);
        
        setTimeout(() => {
            const loader = document.getElementById('loader');
            if(loader) loader.classList.add('fade-out');
        }, 800);

    } catch (err) {
        console.error("Map load error:", err);
    }
}

loadMap();
