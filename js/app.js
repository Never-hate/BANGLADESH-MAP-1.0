let districtData = [];

async function loadMeta() {
    try {
        const res = await fetch('./data/districts.json');
        districtData = await res.json();
    } catch (err) {
        console.error("Error loading districts metadata.");
    }
}
loadMeta();

// Listen for district clicks from map.js
document.addEventListener('districtSelected', (e) => {
    const dName = e.detail.name;
    const info = districtData.find(d => d.en.toLowerCase() === dName.toLowerCase());
    
    if (info) {
        document.getElementById('dName').innerText = info.en;
        document.getElementById('dBnName').innerText = info.bn;
        document.getElementById('dDivision').innerText = info.division;
        document.getElementById('dArea').innerText = info.area;
        document.getElementById('dPop').innerText = info.population.toLocaleString();
        
        // Geo Location
        document.getElementById('dGeo').innerText = `${info.coordinates[0]}, ${info.coordinates[1]}`;
        
        // Upazilas
        document.getElementById('dUpazilaCount').innerText = info.upazilas;
        const upazilaList = document.getElementById('dUpazilaList');
        upazilaList.innerHTML = ''; // Clear old badges
        
        if(info.upazila_names && info.upazila_names.length > 0) {
            info.upazila_names.forEach(name => {
                let li = document.createElement('li');
                li.innerText = name;
                upazilaList.appendChild(li);
            });
        } else {
            upazilaList.innerHTML = '<li>Data not added yet</li>';
        }

        // Open panel
        document.getElementById('infoPanel').classList.remove('closed');
    }
});

document.getElementById('closePanel').addEventListener('click', () => {
    document.getElementById('infoPanel').classList.add('closed');
});

// Animate Dashboard Counters
document.querySelectorAll('.counter').forEach(counter => {
    const update = () => {
        const target = +counter.getAttribute('data-target');
        const count = +counter.innerText.replace(/,/g, '');
        const inc = target / 150;
        if (count < target) { 
            counter.innerText = Math.ceil(count + inc).toLocaleString(); 
            setTimeout(update, 15); 
        } else { 
            counter.innerText = target.toLocaleString(); 
        }
    };
    setTimeout(update, 1200);
});
