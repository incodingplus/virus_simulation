import './index.css'
// import { NumOfPeople } from './constants'
export type settingType = {
    worldname: string,
    np: number,
    hospitalSystem: boolean,
    infecP: number
}
export const setting:settingType = {
    worldname: null,
    np: null,
    hospitalSystem: null,
    infecP: null
}

// worldname = prompt("What's the name of this world?", 'meta_1');
// np = Number(prompt(`How many people in ${worldname}`, '800'));
// infecP = Number(prompt(`How many infected people in ${worldname}`, '0'))
// hospitalSystem = confirm("Hospital System");
// NumOfPeople.wholePer = np;
// world_name.innerHTML = worldname;
// NumOfPeople.Infectious = infecP;
// location.href = './html/index.html';

const setComplete = document.querySelector<HTMLButtonElement>('#setComplete');
const set_worldname = document.querySelector<HTMLInputElement>('#set_worldname');
const set_numOfPeo = document.querySelector<HTMLSelectElement>('#set_numOfPeo');
const set_infecPeo = document.querySelector<HTMLInputElement>('#set_infecPeo');
const set_hospitalSystem = document.querySelector<HTMLInputElement>('#set_hospitalSystem');

let set_hospitalSystem_checked:boolean = false;

set_hospitalSystem.onclick = () =>{
    if(!set_hospitalSystem_checked){
        set_hospitalSystem.innerHTML = '병원 시스템 활성화';
        set_hospitalSystem.style.backgroundColor = 'rgb(225, 225, 225)';
        set_hospitalSystem_checked = true;
    }else{
        set_hospitalSystem.innerHTML = '병원 시스템 비활성화';
        set_hospitalSystem.style.backgroundColor = 'rgb(180, 180, 180)';
        set_hospitalSystem_checked = false;
    }
}
set_hospitalSystem.onmouseout = () =>{
    if(set_hospitalSystem_checked){
        set_hospitalSystem.style.backgroundColor = 'rgb(225, 225, 225)';
    }else{
        set_hospitalSystem.style.backgroundColor = 'rgb(180, 180, 180)';
    }
}
set_hospitalSystem.onmouseover = () =>{
    if(set_hospitalSystem_checked){
        set_hospitalSystem.style.backgroundColor = 'rgb(210, 210, 210)';
    }else{
        set_hospitalSystem.style.backgroundColor = 'rgb(165, 165, 165)';
    }
}
set_hospitalSystem.onmousedown = () =>{
    set_hospitalSystem.style.backgroundColor = 'rgb(150, 150, 150)';
}

setComplete.addEventListener('click', function(){
    locationHref();
});
document.onkeyup = e =>{
    if(e.key == 'Enter'){
        locationHref();
    }
}

function locationHref(){
    setting.worldname = set_worldname.value;
    setting.np = Number(set_numOfPeo.options[set_numOfPeo.selectedIndex].text) - Number(set_infecPeo.value);
    if(set_hospitalSystem_checked){
        setting.hospitalSystem = true;
    }else{
        setting.hospitalSystem = false;
    }
    setting.infecP = Number(set_infecPeo.value);
    
    location.href = `./main.html?json=${JSON.stringify(setting)}`
    // console.log(setting)
}