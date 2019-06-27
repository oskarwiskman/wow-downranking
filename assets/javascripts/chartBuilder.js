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
var hesChart;
var hpmeChart;
var hpsChart;

function buildLineChart(chart, target, title, datasets, labels, xLabel, yLabel){
    var ctx = document.getElementById(target).getContext('2d');
    if (chart) {
        chart.destroy();
    }
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
            },
            hover: {
                mode: 'nearest',
                intersect: true
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
    return chart;
}

function buildSpellCharts(spellData){
    buildHESChart(spellData);
    buildHpSChart(spellData);
    buildHpMEChart(spellData);
}


function buildHESChart(spellData){
    const healingPowerRange = range(0, 2000, 100);
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
    const healingPowerRange = range(0, 2000, 100);
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
    const healingPowerRange = range(0, 2000, 100);
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


