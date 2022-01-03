import { numP } from './types'
import { numPshow } from './output_nOp'

export const ANSANrange = [ // 안산시 범위 다각형
    new kakao.maps.LatLng(37.34536601340117, 126.7833366872930),
    new kakao.maps.LatLng(37.35239803210191, 126.8064317710519),
    new kakao.maps.LatLng(37.34918610614613, 126.8269359139766),
    new kakao.maps.LatLng(37.33741173896692, 126.8628928729008),
    new kakao.maps.LatLng(37.33331815195747, 126.8766215596434),
    new kakao.maps.LatLng(37.29995866705562, 126.8917447303047),
    new kakao.maps.LatLng(37.28129194168943, 126.8600178364447),
    new kakao.maps.LatLng(37.28130541929755, 126.8354696387777),
    new kakao.maps.LatLng(37.29512443086514, 126.7833116904543),
    new kakao.maps.LatLng(37.32416999356896, 126.7671055736911),
];

//움직임 범위 제한
export const ANSANvector = [
    { x: 0.0230950837589, y: 0.00703201870074 },
    { x: 0.0205041429247, y: -0.00321192595578 },
    { x: 0.0359569589242, y: -0.01177436717921 },
    { x: 0.0137286867426, y: -0.00409358700945 },
    { x: 0.0151231706613, y: -0.03335948490185 },
    { x: -0.03172689386, y: -0.01866672536619 },
    { x: -0.024548197667, y: 0.00001347760812 },
    { x: -0.0521579483234, y: 0.01381901156759 },
    { x: -0.0162061167632, y: 0.02904556270382 },
    { x: 0.02119601983221, y: 0.02904556270382 }
]

export const MOVE_PARAMS = {
    'w': {
        vx: 0.00003,
        vy: 0
    },
    's': {
        vx: -0.00003,
        vy: 0
    },
    'a': {
        vx: 0,
        vy: -0.00003
    },
    'd': {
        vx: 0,
        vy: 0.00003
    }
}

export const _NumOfPeople: numP = {
    wholePer: 800,
    Infectious: 0,
    Recovered: 0,
    deadPer: 0
}

export const NumOfPeople = new Proxy(
    _NumOfPeople, {
    get: function (target, name) {
        return target[name]
    },
    set: function (target, name, value) {
        target[name] = value
        if (name == 'wholePer' || name == 'Infectious' || name == 'Recovered' || name == 'deadPer') {
            numPshow()
        }
        return true;
    }
})

export const timeset = document.querySelector<HTMLDivElement>('#timeset');
export const timebox = document.querySelector<HTMLDivElement>('#timebox');
export const timeSpeed = document.querySelector<HTMLDivElement>('#timeSpeed');
export const mylocate = document.querySelector<HTMLDivElement>('.mylocate');
export const Warning_alert = document.querySelector<HTMLButtonElement>('.Waring_alert');
export const virus_infection = document.querySelector<HTMLDivElement>('#virus_infection');
export const P_inf = document.querySelector<HTMLDivElement>('#P_inf');
export const Square = document.querySelector<HTMLDivElement>('#Square');
export const clock = document.querySelector<HTMLDivElement>('#clock');


export const barDiv = document.querySelector<HTMLDivElement>('#barDiv');
export const barGraph = document.querySelector<HTMLCanvasElement>('#barGraph');
export const barGraph_btn = document.querySelector<HTMLDivElement>('#barGraph_btn');
export const lineDiv = document.querySelector<HTMLDivElement>('#lineDiv');
export const lineGraph = document.querySelector<HTMLCanvasElement>('#lineGraph');
export const lineGraph_btn = document.querySelector<HTMLDivElement>('#lineGraph_btn');
export const save_btn = document.querySelector<HTMLDivElement>('#save_btn');

export const pol_mask = document.querySelector<HTMLInputElement>('#pol_mask');
export const pol_Isolation = document.querySelector<HTMLInputElement>('#pol_Isolation');
export const pol_prhbtOFgthr = document.querySelector<HTMLInputElement>('#pol_prhbtOFgthr');