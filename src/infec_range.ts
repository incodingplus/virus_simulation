import { Person } from './person'
import { NumOfPeople } from './constants'
import { peoples, variable } from './variable'
import { numPshow } from './output_nOp';

export function init(){
    variable.set2 = setInterval(fun, variable.speedValue2)
}

function fun(){
    if(variable.movingStart == true){
        for(let i = 0; i < peoples.length; i++){
            for(let j = 0; j < peoples.length; j++){
                if(peoples[i].infection == true && peoples[j].infection == false){
                    const p1x = peoples[i].position.x;
                    const p1y = peoples[i].position.y;
                    const p2x = peoples[j].position.x;
                    const p2y = peoples[j].position.y;
    
                    let result = Math.sqrt(Math.pow(p1x - p2x, 2) + Math.pow(p1y - p2y, 2));
                    if(result < 0.001){
                        per(peoples[j].infectionRate, peoples[j])
                    }
                }
            }
        }
    }
}

function per(n: number, peo: Person){
    let rand = Math.random();
    let num = n/100;
    if(rand <= num){
        peo.changeColor();
        NumOfPeople.Infectious++;
        NumOfPeople.wholePer--;
        numPshow();
    }
}

export { fun }