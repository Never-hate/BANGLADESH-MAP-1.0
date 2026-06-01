let districtData = [];

// 1. districts.json theke data load kora
fetch('./data/districts.json')
    .then(res => res.json())
    .then(data => {
        districtData = data;
        console.log("Districts data loaded:", districtData.length);
    })
    .catch(err => console.error("Data load error:", err));

// 2. Map theke click korar signal paile ei event ta kaj korbe
document.addEventListener('districtSelected', (e) => {
    const clickedName = e.detail.name;
    console.log("Map theke click kora zilar nam:", clickedName);

    // json data er sathe map er nam match kora (choto hat er okkhor kore)
    const info = districtData.find(d => d.en.toLowerCase().trim() === clickedName.toLowerCase().trim());
    
    if (info) {
        console.log("Data match koreche!", info);
        
        // 3. Side box er HTML id gulote data bosano
        document.getElementById('dName').innerText = info.en || '';
        document.getElementById('dBnName').innerText = info.bn || '';
        document.getElementById('dDivision').innerText = info.division || '';
        document.getElementById('dArea').innerText = info.area || '';
        document.getElementById('dPop').innerText = info.population ? info.population.toLocaleString() : '';
        document.getElementById('dGeo').innerText = info.coordinates ? info.coordinates.join(', ') : '';
        document.getElementById('dUpazilaCount').innerText = info.upazilas || '0';
        
        // Upazila list html e add kora
        const list = document.getElementById('dUpazilaList');
        list.innerHTML = '';
        if(info.upazila_names) {
            info.upazila_names.forEach(name => {
                let li = document.createElement('li');
                li.textContent = name;
                list.appendChild(li);
            });
        }

        // 4. Data bosanor por side box ta open kora
        document.getElementById('infoPanel').classList.remove('closed');
    } else {
        // Jodi banan vul thake ba data na thake
        console.warn("Ei zilar data districts.json e pawa jayni:", clickedName);
    }
});

// Close button logic (Cross e click korle box bondho hobe)
document.getElementById('closePanel').addEventListener('click', () => {
    document.getElementById('infoPanel').classList.add('closed');
});
