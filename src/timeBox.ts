import { variable, time_DHS } from './variable'
import { timebox, Square, clock } from './constants'

let num = 0;
export function init(){
    variable.set1 = setInterval(time, variable.speedValue1);
}

function time(){
    if(variable.movingStart == true){
        Square.style.backgroundColor = '#c9fe71';

        time_DHS.min++;
        num += timebox.offsetWidth / 1440;
        if(time_DHS.min >= 60){
            time_DHS.hour++;
            time_DHS.min = 0;
            if(time_DHS.hour >= 24){
                time_DHS.date++;
                num = timebox.offsetWidth;
                time_DHS.hour = 0;
            }
        }
        let d = String(time_DHS.date);
        let h = String(time_DHS.hour);
        let s = String(time_DHS.min);
    
        Square.style.width = `${num}px`;
        if(num > timebox.offsetWidth){
            num = 0;
        }
        
        clock.innerHTML = `${d.padStart(2, '0')} / ${h.padStart(2, '0')} / ${s.padStart(2, '0')}`;
    }else{
        Square.style.backgroundColor = '#fe7371';
    }
}

export { time }