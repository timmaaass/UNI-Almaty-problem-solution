[00:44, 04.04.2026] Тима: // data.js
const incidents = [
    {id:1, area:'Алмалинский', type_incident:'Кража', victims:'Азамат Нурланов', offender:'Ильяс Каримов', time_police_reaction:12, time:'01:12', date:'2026-04-03'},
    {id:2, area:'Бостандыкский', type_incident:'ДТП', victims:'Диана Касымова', offender:'Тимур Бекенов', time_police_reaction:8, time:'02:45', date:'2026-04-03'},
    {id:3, area:'Ауэзовский', type_incident:'Грабеж', victims:'Руслан Ахметов', offender:'Кирилл Иванов', time_police_reaction:15, time:'03:20', date:'2026-04-03'},
    {id:4, area:'Медеуский', type_incident:'Мошенничество', victims:'Мадина Оспанова', offender:'Максим Петров', time_police_reaction:20, time:'04:05', date:'2026-04-03'},
    {id:5, area:'Жетысуский', type_incident:'Хулиганство', victims:'Ал…
[00:44, 04.04.2026] Тима: document.addEventListener("DOMContentLoaded", () => {
    updateStats(incidents);
    updateTable(incidents);
    initMap(incidents);
    initCharts(incidents);
});

// Координаты районов Алматы
const areaCoords = {
    'Алмалинский': [43.2389, 76.9158],
    'Бостандыкский': [43.2155, 76.8950],
    'Ауэзовский': [43.2200, 76.8300],
    'Медеуский': [43.2380, 76.9580],
    'Жетысуский': [43.2800, 76.9400],
    'Турксибский': [43.3200, 76.9600],
    'Алатауский': [43.2850, 76.8400],
    'Наурызбайский': [43.1900, 76.8100]
};

function updateStats(data) {
    document.getElementById('total-incidents').innerText = data.length;

    let totalTime = 0;
    let areaCounts = {};

    data.forEach(inc => {
        totalTime += inc.time_police_reaction;
        areaCounts[inc.area] = (areaCounts[inc.area] || 0) + 1;
    });

    let avgTime = (totalTime / data.length).toFixed(1);
    document.getElementById('avg-reaction').innerText = avgTime;

    let topArea = Object.keys(areaCounts).reduce((a,b) => areaCounts[a]>areaCounts[b]?a:b);
    document.getElementById('top-area').innerText = topArea.toUpperCase();

    let risk = avgTime > 12 ? "ВЫСОКИЙ" : "СРЕДНИЙ";
    let riskEl = document.getElementById('risk-level');
    riskEl.innerText = risk;
    riskEl.style.color = risk==="ВЫСОКИЙ"? "#f85149":"#c88c0b";
}

function updateTable(data) {
    const tbody = document.getElementById("table-body");
    tbody.innerHTML = ""; 

    data.forEach(inc => {
        let tagColor = "blue";
        if(inc.type_incident==="Кража"||inc.type_incident==="Грабеж") tagColor="red";
        if(inc.type_incident==="Нападение") tagColor="yellow";
        if(inc.type_incident==="Пожар") tagColor="orange";

        const tr = document.createElement("tr");
        tr.innerHTML = `
            <td>${inc.time}</td>
            <td>${inc.area}</td>
            <td><span class="type-tag ${tagColor}">${inc.type_incident}</span></td>
            <td>${inc.victims} / ${inc.offender}</td>
            <td>${inc.time_police_reaction} мин</td>
        `;
        tbody.appendChild(tr);
    });
}

function initMap(data) {
    const map = L.map('map').setView([43.2389, 76.9158], 11);
    L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png').addTo(map);

    let heatPoints = data.map(inc => {
        let baseCoords = areaCoords[inc.area] || [43.2389,76.9158];
        let lat = baseCoords[0]+(Math.random()-0.5)*0.01;
        let lng = baseCoords[1]+(Math.random()-0.5)*0.01;
        return [lat,lng,1];
    });

    L.heatLayer(heatPoints,{radius:25,blur:15,maxZoom:12,gradient:{0.4:'green',0.6:'yellow',1.0:'red'}}).addTo(map);
}

const ctx = document.getElementById('incidentChart').getContext('2d');

// Подсчитаем количество инцидентов по типам
const counts = {};
incidents.forEach(i => counts[i.type] = (counts[i.type] || 0) + 1);

const chart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: Object.keys(counts),
        datasets: [{
            label: 'Количество инцидентов',
            data: Object.values(counts),
            backgroundColor: ['#ffff99','#ff9999','#99ccff','#cccccc']
        }]
    },
    options: {
        responsive: true,
        plugins: {
            legend: { display: false },
            title: { display: true, text: 'Распределение инцидентов по типам' }
        }
    }
});

function initCharts(data) {
    const ctx = document.getElementById('typeChart').getContext('2d');
    let typeCounts = {};
    data.forEach(inc => { typeCounts[inc.type_incident]=(typeCounts[inc.type_incident]||0)+1; });

    new Chart(ctx, {
        type:'doughnut',
        data:{
            labels:Object.keys(typeCounts),
            datasets:[{data:Object.values(typeCounts), backgroundColor:['#388bfd','#f85149','#d29922','#f0883e','#238636','#a371f7'], borderWidth:0}]
        },
        options:{plugins:{legend:{position:'right',labels:{color:'#c9d1d9'}}}}
    });
}