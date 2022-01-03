import './main.css'
import { init as 지도설정 } from './setting_map'
import { init as 안산범위 } from './ansanRange'
import { init as html애니메이션 } from './side_menu'
import { init as mainControl } from './main_control'
import { init as 감염범위 } from './infec_range'
import { init as timebox } from './timeBox'
import { init as playerLocation } from './player_location'
import { init as 시간가속 } from './time_ACC'
import { init as 막대 } from './barGraph'
import { init as 선 } from './lineGraph'
import { init as roadpoint } from './roadPoint'
import { init as hospital } from './hospital_data'

// import { init as 임시사람 } from './임시사람'
import { NumOfPeople } from './constants'
import { settingType } from './index'
export const world_name = document.querySelector('#world_name');
export let setting:settingType = {
    worldname: null,
    np: null,
    infecP: null,
    hospitalSystem: null
}
type areaDataType = {
    ID?: string;
    path: kakao.maps.LatLng[];
}[]
export const areaData: areaDataType = []

async function init(){
    // console.log(NumOfPeople.wholePer, world_name.innerHTML, NumOfPeople.Infectious, setting.hospitalSystem)
    setting = JSON.parse(new URLSearchParams(location.search).get('json'));
    console.log(setting.worldname, setting.np, setting.infecP, setting.hospitalSystem)

    NumOfPeople.wholePer = setting.np;
    world_name.innerHTML = setting.worldname;
    NumOfPeople.Infectious = setting.infecP;

    const start_ltX = 126.7770165389483 // 왼쪽위 x
    const start_ltY = 37.34541734164257 // 왼쪽위 y
    const end_rdX = 126.8788533379556 // 오른쪽아래 x
    const end_rdY = 37.29265678666862 // 오른쪽아래 y

    const xn = 10;
    const yn = 6;
    
    const x = (end_rdX - start_ltX) / xn;
    const y = (start_ltY - end_rdY) / yn;
    let count:number = 0;
    for(let i = 0; i < yn; i++){
        for(let j = 0; j < xn; j++){
            areaData.push({
                ID: `${count}`,
                path: [new kakao.maps.LatLng(start_ltY - y * i, start_ltX + x * j), new kakao.maps.LatLng(start_ltY - y * (i+1), start_ltX + x * (j+1))]
            })
            count++;
        }
    }

    console.log(areaData)

    const { map } = 지도설정()
    안산범위(map)
    hospital(map)
    await roadpoint()
    html애니메이션()
    mainControl(map)
    // 임시사람(map)
    감염범위()
    timebox()
    playerLocation()
    시간가속()
    막대()
    선()
}

init()