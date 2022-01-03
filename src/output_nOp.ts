import { NumOfPeople } from './constants'

const S_show = document.querySelector<HTMLButtonElement>('#S_show');
const I_show = document.querySelector<HTMLButtonElement>('#I_show');
const R_show = document.querySelector<HTMLButtonElement>('#R_show');
const D_show = document.querySelector<HTMLButtonElement>('#D_show');

function numPshow(){
    S_show.innerHTML = `${NumOfPeople.wholePer}`;
    I_show.innerHTML = `${NumOfPeople.Infectious}`;
    R_show.innerHTML = `${NumOfPeople.Recovered}`;
    D_show.innerHTML = `${NumOfPeople.deadPer}`;
}

export{ numPshow }