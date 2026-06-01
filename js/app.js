let districtData = [];

// ১. JSON থেকে জেলার বিস্তারিত ডাটা লোড করা
async function loadMeta() {
    try {
        const res = await fetch('./data/districts.json');
        districtData = await res.json();
    } catch (err) {
        console.error("Error loading districts metadata:", err);
    }
}
loadMeta();

// ২. ম্যাপ থেকে ক্লিকের সিগন্যাল রিসিভ করা
document.addEventListener('districtSelected', (e) => {
    // ম্যাপ থেকে আসা জেলার নামটা ছোট হাতের অক্ষরে (lowercase) করে নেওয়া হলো
    const mapName = e.detail.name.toLowerCase();
    
    // আমাদের districts.json এর সাথে ম্যাপের নাম মেলানো
    const info = districtData.find(d => d.en.toLowerCase() === mapName);
    
    if (info) {
        // সাইডবারের HTML এ ডাটাগুলো বসিয়ে দেওয়া
        document.getElementById('dName').innerText = info.en;
        document.getElementById('dBnName').innerText = info.bn || '';
        document.getElementById('dDivision').innerText = info.division;
        document.getElementById('dArea').innerText = info.area;
        document.getElementById('dPop').innerText = info.population.toLocaleString();
        
        // Geo Location
        if(info.coordinates) {
            document.getElementById('dGeo').innerText = `${info.coordinates[0]}, ${info.coordinates[1]}`;
        }
        
        // Upazilas
        document.getElementById('dUpazilaCount').innerText = info.upazilas;
        const upazilaList = document.getElementById('dUpazilaList');
        upazilaList.innerHTML = ''; // আগের উপজেলার ব্যাজগুলো মুছে ফেলা
        
        if(info.upazila_names && info.upazila_names.length > 0) {
            info.upazila_names.forEach(name => {
                let li = document.createElement('li');
                li.innerText = name;
                upazilaList.appendChild(li);
            });
        } else {
            upazilaList.innerHTML = '<li>Data not added yet</li>';
        }

        // সাইডবারটি স্ক্রিনে ওপেন করা
        const infoPanel = document.getElementById('infoPanel');
        if(infoPanel) infoPanel.classList.remove('closed');
    } else {
        console.warn("No extra data found in districts.json for: " + e.detail.name);
    }
});

// ৩. সাইডবার ক্লোজ করার বাটন
const closeBtn = document.getElementById('closePanel');
if(closeBtn) {
    closeBtn.addEventListener('click', () => {
        document.getElementById('infoPanel').classList.add('closed');
    });
}
