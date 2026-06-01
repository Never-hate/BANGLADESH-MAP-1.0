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
    // আপনার ফাইল অনুযায়ী সঠিক প্রপার্টি 'adm2_name' ব্যবহার করা হয়েছে
    const districtName = feature.properties.adm2_name;

    if(districtName) {
        layer.bindTooltip(districtName, { permanent: false, direction: 'center', className: 'map-tooltip' });
    }

    layer.on({

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

        mouseout: (e) => { 
            if (geoJsonLayer) {
                geoJsonLayer.resetStyle(e.target); 
            }
        },

        click: (e) => {
            if(districtName) {
                map.fitBounds(e.target.getBounds());
                // app.js এ নাম পাঠানোর জন্য ইভেন্ট
                document.dispatchEvent(new CustomEvent('districtSelected', { 
                    detail: { name: districtName } 
                }));
            }
        }
    });
}
