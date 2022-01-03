import { Chart, registerables } from 'chart.js'
import { menuBtn_click, variable, time_DHS } from './variable'
import { NumOfPeople, lineDiv, lineGraph, lineGraph_btn, save_btn } from './constants'
import { setting } from "./main";

Chart.register(...registerables);
const arr = ['wholePer', 'Infectious', 'Recovered', 'deadPer'];
export function init(){
    const lineC = new Chart(lineGraph, {
        type: 'line',
        data: {
            datasets: [{
                label: 'S',
                type: 'line',
                data: [],
                backgroundColor: 'rgba(99, 255, 132, 0.2)',
                borderColor: 'rgba(99, 255, 132, 1)',
                order: 2,
                tension: 0.4
            }, {
                label: 'I',
                data: [],
                backgroundColor: 'rgba(255, 99, 132, 0.2)',
                borderColor: 'rgba(255, 99, 132, 1)',
                type: 'line',
                order: 1,
                tension: 0.4
            }, {
                label: 'R',
                data: [],
                backgroundColor: 'rgba(255, 206, 86, 0.2)',
                borderColor: 'rgba(255, 206, 86, 1)',
                type: 'line',
                order: 3,
                tension: 0.4
            }, {
                label: 'D',
                data: [],
                backgroundColor: 'rgba(100, 100, 100, 0.2)',
                borderColor: 'rgba(100, 100, 100, 1)',
                type: 'line',
                order: 4,
                tension: 0.4
            }],
            labels: []
        },
        options: {
            responsive: false,
            scales: {
                y: {
                    beginAtZero: true,
                    min: 0,
                    max: NumOfPeople.wholePer + NumOfPeople.Infectious
                }
            },
            elements: {
                point: {
                    borderWidth: 0,
                    borderColor: 'transparent'
                }
            },
            interaction: {
                intersect: false
            }
        }
    });
    
    lineC.hide(0);
    let i = 0;
    let n:number = null;
    let snd = 0;
    setInterval(()=>{
        n = time_DHS.min % 10;
        if(n == 0 && snd !== Math.floor(time_DHS.min / 10)){
            snd = Math.floor(time_DHS.min / 10);
            updateChart(lineC)
        }
        if(menuBtn_click.main == false){
            lineDiv.style.display = 'none';
            lineC.hide(0)
            menuBtn_click.line = false;
        }
    }, 60)

    lineGraph_btn.addEventListener('click', function(){
        if(menuBtn_click.line == false){
            lineDiv.style.display = 'block';
            lineDiv.style.zIndex = lineDiv.style.zIndex + 1;
            lineC.show(0)
            menuBtn_click.bar = false;
            menuBtn_click.line = true;
        }else{
            lineDiv.style.display = 'none';
            lineC.hide(0)
            lineDiv.style.zIndex = '150';
            menuBtn_click.line = false;
        }
    });
    if(menuBtn_click.main == true){
        lineDiv.style.display = 'none';
        lineC.hide(0)
        lineDiv.style.zIndex = '150';
        menuBtn_click.line = false;
    }
    
    function updateChart(chart: Chart<"line", number[], string>) {
        chart.data.labels.push(`T${i++}`);
        chart.data.datasets.forEach((dataset, index) => {
            dataset.data.push(NumOfPeople[arr[index]]);
        });
        chart.update();
    }

    type wldData = {
        wldname: string;
        population: number;
        lineGraph: Chart;
    }
    
    const worldData:wldData[] = [];
    
    let worldNumber = 1;
    
    save_btn.onclick = () =>{
        worldData[worldNumber] = {
            wldname: setting.worldname,
            population: setting.np,
            lineGraph: lineC
        }
        console.log(worldData[worldNumber])
        worldNumber++;
    }
}
