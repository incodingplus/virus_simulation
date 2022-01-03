import { timeSpeed } from './constants'
import { variable } from './variable'
import { MOVE_PARAMS } from './constants'
import { time } from './timeBox'
import { fun } from './infec_range'

let check = 0;

export function init(){
    timeSpeed.addEventListener('click', timeAcc);
}

function timeAcc(){
    clearInterval(variable.set1);
    clearInterval(variable.set2)
    if(check == 0){
        timeSpeed.style.color = '#f3c127';
        variable.speedValue1 = 60;
        variable.speedValue2 = 250;
        setmove(0.00006, -0.00006, -0.00006, 0.00006)
        variable.velRange = 0.0002;
        check = 1;
    }else if(check == 1){
        timeSpeed.style.color = '#fe7371';
        variable.speedValue1 = 10;
        variable.speedValue2 = 25;
        setmove(0.0006, -0.0006, -0.0006, 0.0006)
        variable.velRange = 0.0001;
        check = 2;
    }else{
        timeSpeed.style.color = 'white';
        variable.speedValue1 = 200; 
        variable.speedValue2 = 500;
        setmove(0.00003, -0.00003, -0.00003, 0.00003)
        variable.velRange = 0.00001;
        check = 0;
    }
    variable.set1 = setInterval(time, variable.speedValue1);
    variable.set2 = setInterval(fun, variable.speedValue2);
}

function setmove(w: number, s: number, a: number, d: number) {
    MOVE_PARAMS.w.vx = w;
    MOVE_PARAMS.s.vx = s;
    MOVE_PARAMS.a.vy = a;
    MOVE_PARAMS.d.vy = d;
}