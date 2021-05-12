const colors = [
                'rgba(255, 99, 132, 0.8)',
                'rgba(54, 162, 235, 0.8)',
                'rgba(255, 206, 86, 0.8)',
                'rgba(75, 192, 192, 0.8)',
                'rgba(153, 102, 255, 0.8)',
                'rgba(255, 159, 64, 0.8)',
                'rgba(205, 250, 250, 0.8)',
                'rgba(75, 192, 75, 0.8)',
                'rgba(97, 125, 125, 0.8)',
                'rgba(252, 252, 252, 0.8)',
                'rgba(255, 209, 219, 0.8)',
                'rgba(221, 99, 255, 0.8)',
                'rgba(128, 99, 105, 0.8)'
                ]
const healingPowerRange = range(0, 1500, 100);
var hesChart;
var hpmeChart;
var hpsChart;
var radarChart;

function buildRadarChart(chart, target, datasets) {
    var ctx = document.getElementById(target).getContext('2d');
    if (chart) {
        chart.destroy();
    }
    chart = new Chart(ctx, {
        type: 'radar',
        data: datasets,
        options: {
            scale: {
                ticks: {
                    display: false,
                    min: 0,
                    max: 10,
                    step: 0.001
                },
                pointLabels: {
                    fontSize: 18,
                    fontColor: "#E7BA00;"
                }
            }
        }
    });
    return chart;
}

function buildLineChart(chart, target, title, datasets, labels, xLabel, yLabel){
    var ctx = document.getElementById(target).getContext('2d');
    if (chart) {
        clearData(chart);
        setData(chart, labels, datasets);
        return chart;
    } else {
        chart = new Chart(ctx, {
            type: 'line',
            data: {
                labels: labels,
                datasets: datasets
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                title: {
                    display: true,
                    text: title,
                    fontColor: '#E7BA00',
                    fontSize: 18,
                    fontFamily: 'Friz Quadrata'
                },
                tooltips: {
                    mode: 'index',
                    intersect: false,
                    hover: {
                        mode: 'nearest',
                        intersect: true
                    }
                },
                scales: {
                    xAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: xLabel,
                            fontColor: '#7facf4',
                            fontFamily: 'Friz Quadrata'
                        }
                    }],
                    yAxes: [{
                        display: true,
                        scaleLabel: {
                            display: true,
                            labelString: yLabel,
                            fontColor: '#7facf4',
                            fontFamily: 'Friz Quadrata'
                        }
                    }]
                }
            }
        });
    }
    return chart;
}

function clearData(chart) {
    chart.data.labels.pop();
    chart.data.datasets.forEach((dataset) => {
        dataset.data.pop();
    });
    chart.update();
}

function setData(chart, labels, datasets) {
    chart.data.labels = labels;
    chart.data.datasets = datasets;
    chart.update();
}

function buildSpellCharts(spellData){
    buildHESChart(spellData);
    buildHpSChart(spellData);
    buildHpMEChart(spellData);
}

function buildCompareRadarChart(spellNames, classNames, ranks) {
    let spellData;
    let datasets = [];
    let healingPower = getHealingPower();

    let healing = [];
    let mana = [];
    let hpme = [];
    let hps = [];
    let hes = [];
    let name = [];
    for(let i = 0; i < spellNames.length; i++){
        spellData = getCachedSpellData(classNames[i], spellNames[i]);
        name[i] = spellData.name;
        ranks[i] = Math.min(Math.max(ranks[i], 0), spellData.ranks.length);
        healing[i] = calculatePower(healingPower, spellData, ranks[i]);
        mana[i] = calculateCost(healingPower, spellData, ranks[i]);
        hpme[i] = calculatePowerPerMana(healingPower, spellData, ranks[i]);
        hps[i] = calculatePowerPerSecond(healingPower, spellData, ranks[i]);
        hes[i] = calculateHES(hpme[i], hps[i]);
    }

    healing = healing.map(x => roundNumber(x/Math.max(...healing), 3) * 10);
    mana = mana.map(x => 1 - x/Math.max(...mana));
    mana = mana.map(x => roundNumber((x +  (1 - Math.max(...mana))), 3) * 10);
    hpme = hpme.map(x => roundNumber(x/Math.max(...hpme), 3) * 10);
    hps = hps.map(x => roundNumber(x/Math.max(...hps), 3) * 10);
    hes = hes.map(x => roundNumber(x/Math.max(...hes), 3) * 10);

    for(let i = 0; i < spellNames.length; i++){    
        datasets.push({   
            label: `${name[i]} (Rank ${ranks[i]})`,
            backgroundColor: colors[i].replace('0.8', '0.2'),
            borderColor: colors[i],
            data: [
                healing[i],
                mana[i],
                hpme[i],
                hps[i],
                hes[i]
            ]
        })
    }
    let compareData = {
            labels: ["Healing", "Mana cost", "HpME", "HpS", "HES"],  
            datasets: datasets
        }; 
    radarChart = buildRadarChart(radarChart, 'radar-chart', compareData);
}


function buildHESChart(spellData){
    let datasets = [];
    for(r = 0; r < spellData.ranks.length; r++){
        let data = [];
        for(i = 0; i < healingPowerRange.length; i++){
            let HpS = calculatePowerPerSecond(healingPowerRange[i], spellData, r+1);
            let HpME = calculatePowerPerMana(healingPowerRange[i], spellData, r+1);
            let HES = calculateHES(HpME, HpS);
            data.push(roundNumber(HES, 3));
        }

        datasets.push(
            {
                label: `Rank ${spellData.ranks[r].rank}`,
                fill: false,
                backgroundColor: colors[r],
                borderColor: colors[r],
                data: data
            }
        );
    }

    datasets = normalizeDatasets(datasets);
    hesChart = buildLineChart(hesChart, 'hes-chart', 'Normalized HES over Healing Power', datasets, healingPowerRange, 'Healing Power', 'Healing Efficiency Score');
}

function buildHpSChart(spellData){
    let datasets = [];
    for(r = 0; r < spellData.ranks.length; r++){
        let data = [];
        for(i = 0; i < healingPowerRange.length; i++){
            let HpS = calculatePowerPerSecond(healingPowerRange[i], spellData, r+1);
            data.push(roundNumber(HpS, 3));
        }

        datasets.push(
            {
                label: `Rank ${spellData.ranks[r].rank}`,
                fill: false,
                backgroundColor: colors[r],
                borderColor: colors[r],
                data: data
            }
        );
    }
    hpsChart = buildLineChart(hpsChart, 'hps-chart', 'HpS over Healing Power', datasets, healingPowerRange, 'Healing Power', 'Healing per Second');
}

function buildHpMEChart(spellData){
    let datasets = [];
    for(r = 0; r < spellData.ranks.length; r++){
        let data = [];
        for(i = 0; i < healingPowerRange.length; i++){
            let HpME = calculatePowerPerMana(healingPowerRange[i], spellData, r+1);
            data.push(roundNumber(HpME, 3));
        }

        datasets.push(
            {
                label: `Rank ${spellData.ranks[r].rank}`,
                fill: false,
                backgroundColor: colors[r],
                borderColor: colors[r],
                data: data
            }
        );
    }
    hpmeChart = buildLineChart(hpmeChart, 'hpme-chart', 'HpME over Healing Power', datasets, healingPowerRange, 'Healing Power', 'Healing per Mana Efficiency');
}


