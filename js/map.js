/**
 * Bangladesh Interactive Map Logic
 * Handles GeoJSON loading, hover animations, and click events.
 */

const map = L.map('map', { 
    zoomControl: false, 
    attributionControl: false 
}).setView([23.6850, 90.3563], 7);

let geoJsonLayer;

// ম্যাপের স্টাইল নির্ধারণ
function getStyle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return { 
        fillColor: isDark ? '#1E1E2F' : '#E2E8F0', 
        weight: 1.5, 
        color: isDark ? '#7C3AED' : '#06B6D4', 
        fillOpacity: 0.7 
    };
}

// প্রতিটি জেলার জন্য ইভেন্ট লিসেনার
function onEachFeature(feature, layer) {
    // জেলার নাম খোঁজা (ADM2_EN অথবা NAME_2)
    const districtName = feature.properties.ADM2_EN || feature.properties.NAME_2;

    if(districtName) {
        layer.bindTooltip(districtName, { permanent: false, direction: 'center', className: 'map-tooltip' });
    }

    layer.on({
        // মাউস নিলে কালার পরিবর্তন
        mouseover: (e) => { 
            const layer = e.target;
            layer.setStyle({ 
                fillColor: '#7C3AED', 
                fillOpacity: 0.9, 
                color: '#F59E0B', 
                weight: 3 
            }); 
            layer.bringToFront(); 
        },
        // মাউস সরিয়ে নিলে কালার রিসেট
        mouseout: (e) => { 
            if (geoJsonLayer) {
                geoJsonLayer.resetStyle(e.target); 
            }
        },
        // ক্লিক করলে ইনফরমেশন পাঠানো
        click: (e) => {
            if(districtName) {
                map.fitBounds(e.target.getBounds());
                document.dispatchEvent(new CustomEvent('districtSelected', { 
                    detail: { name: districtName } 
                }));
            }
        }
    });
}

// ম্যাপ ডাটা লোড করা
async function loadMap() {
    try {
        const response = await fetch('./data/map.json'); // আপনার ফাইলের লোকেশন
        if (!response.ok) throw new Error("Could not load map data");
        
        const data = await response.json();
        
        geoJsonLayer = L.geoJSON(data, { 
            style: getStyle(), 
            onEachFeature: onEachFeature 
        }).addTo(map);
        
        // লোডার সরিয়ে দেওয়া
        const loader = document.getElementById('loader');
        if(loader) loader.classList.add('fade-out');

    } catch (err) {
        console.error("Map initialization failed:", err);
    }
}

// ম্যাপ শুরু করা
loadMap();
