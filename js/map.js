/**
 * Bangladesh Interactive Map Logic
 */

const map = L.map('map', { 
    zoomControl: false, 
    attributionControl: false 
}).setView([23.6850, 90.3563], 7);

let geoJsonLayer;

// ম্যাপের স্টাইল
function getStyle() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    return { 
        fillColor: isDark ? '#1E1E2F' : '#E2E8F0', 
        weight: 1.5, 
        color: isDark ? '#7C3AED' : '#06B6D4', 
        fillOpacity: 0.7 
    };
}

// জেলার নাম সেট করা এবং ক্লিক ইভেন্ট
function onEachFeature(feature, layer) {
    const districtName = feature.properties.adm2_name; 

    layer.on({
        // মাউস নিলে যা যা হবে:
        mouseover: (e) => { 
            // ১. ম্যাপের কালার চেঞ্জ হবে
            e.target.setStyle({ fillColor: '#7C3AED', fillOpacity: 0.9 }); 
            e.target.bringToFront(); // বর্ডারগুলো ক্লিয়ার দেখানোর জন্য

            // ২. মাউস নিলেই সাথে সাথে সাইডবারে ডাটা পাঠানোর সিগন্যাল (এটাই আপনার কাঙ্ক্ষিত ফিচার)
            document.dispatchEvent(new CustomEvent('districtSelected', { 
                detail: { name: districtName } 
            }));
        },
        // মাউস সরিয়ে নিলে কালার আগের মতো হয়ে যাবে
        mouseout: (e) => { 
            if (geoJsonLayer) geoJsonLayer.resetStyle(e.target); 
        },
        // ক্লিক করলে শুধু জুম হবে (কারণ ডাটা তো হোভার করলেই চলে যাচ্ছে)
        click: (e) => {
            map.fitBounds(e.target.getBounds());
        }
    });
}

// ম্যাপ ডাটা লোড করা
async function loadMap() {
    try {
        const response = await fetch('./data/map.json');
        const data = await response.json();
        
        geoJsonLayer = L.geoJSON(data, { 
            style: getStyle(), 
            onEachFeature: onEachFeature 
        }).addTo(map);
        
        const loader = document.getElementById('loader');
        if(loader) loader.classList.add('fade-out');

    } catch (err) {
        console.error("Map load error:", err);
    }
}

loadMap();
