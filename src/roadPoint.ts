import { map } from "./setting_map";
import { arriveClick } from "./variable";
import { Warning_alert } from "./constants";
import { _per_click, _per_arrive } from "./person"
import { move2ClickedPlace_before } from "./main_control";

export const pointData:{
    name:string;
    latlng:kakao.maps.LatLng;
    lines:number[];
}[] = [];
export const lineData: {
    road_id: number;
    linePath: kakao.maps.LatLng[];
    points:number[];
}[] = [];

type Point = { 
    type: "Feature"; 
    properties: {
        NODE_ID: string;
        NODE_TYPE: string;
        NODE_NAME: string;
        TURN_P:string;
        REMARK: null 
    };
    geometry: { 
        type: "Point";
        coordinates: [ number, number ]
    }
}
type road = {
    type: "Feature";
    properties: {
        LINK_ID: string;
        F_NODE: string;
        T_NODE: string;
        LANES: number;
        ROAD_RANK: string;
        ROAD_TYPE: string;
        ROAD_NO: string;
        ROAD_NAME: string;
        ROAD_USE: string;
        MULTI_LINK: string;
        CONNECT: string;
        MAX_SPD: number;
        REST_VEH: string;
        REST_W: number;
        REST_H: number;
        LENGTH: number;
        REMARK: null
    };
    geometry: {
        type: "LineString";
        coordinates: [number, number][]
    };
}

export async function init(){
    const res1 = await fetch('./data/ansanzone_point.txt');
    const res2 = await fetch('./data/ansanzone_road.txt');
    const txt1= await res1.text();
    const txt2 = await res2.text();
    const arr1 = txt1.split('\n').filter(v => v.trim()).map(v => (JSON.parse(v) as Point).geometry.coordinates);
    const arr2 = txt2.split('\n').filter(v => v.trim()).map(v => (JSON.parse(v) as road).geometry.coordinates);

    for(let i = 0; i < arr1.length; i++){
        pointData.push({
            name: `${i}`,
            latlng: new kakao.maps.LatLng(arr1[i][1] - 0.0027781231371076888, arr1[i][0] + 0.002080213816618034),
            lines:[]
        });
    }
    for(let j = 0; j < arr2.length; j++){
        const linePath_:kakao.maps.LatLng[] = [];
        for(let n = 0; n < arr2[j].length; n++){
            linePath_.push(new kakao.maps.LatLng(arr2[j][n][1] - 0.0027781231371076888, arr2[j][n][0] + 0.002080213816618034))
        }
        lineData.push({
            road_id: j,
            linePath: linePath_,
            points:[]
        });
    }

    
    for(let i = 0; i < pointData.length; i++){
        for(let j = 0; j < lineData.length; j++){
            let px:number = pointData[i].latlng.getLat();
            let py:number = pointData[i].latlng.getLng();
            let l_lastX:number = lineData[j].linePath[lineData[j].linePath.length - 1].getLat();
            let l_lastY:number = lineData[j].linePath[lineData[j].linePath.length - 1].getLng();
            let l_fstX:number = lineData[j].linePath[0].getLat();
            let l_fstY:number = lineData[j].linePath[0].getLng();
            if(Math.sqrt(Math.pow(px - l_fstX, 2) + Math.pow(py - l_fstY, 2)) < 0.0002 || Math.sqrt(Math.pow(px - l_lastX, 2) + Math.pow(py - l_lastY, 2)) < 0.0002){
                pointData[i].lines.push(lineData[j].road_id)
                lineData[j].points.push(i);
            }
        }
    }

    console.log(pointData, lineData)
    for(let i of pointData) {
        displayPoint(i)
    }
    for(let j of lineData){
        displayLine(j)
    }
}

function displayPoint(arr:typeof pointData[0]){
    const circle = new kakao.maps.Circle({
        center: arr.latlng,
        radius: 10,
        strokeWeight: 0,
        fillColor: '#A2FF99',
        fillOpacity: 0.5,
        zIndex: 1000
    });
    
    const customOverlay = new kakao.maps.CustomOverlay({
        position: arr.latlng,
        content: arr.name
    });
    
    kakao.maps.event.addListener(circle, 'mouseover', function(mouseEvent) {
        customOverlay.setContent(`<div class='area'>${arr.name}</div>`);
        customOverlay.setPosition(mouseEvent.latLng);
        // customOverlay.setMap(map);
    });
    kakao.maps.event.addListener(circle, 'mouseout', function() {
        customOverlay.setMap(null);
    });
    kakao.maps.event.addListener(circle, 'mousemove', function(mouseEvent) {
        customOverlay.setPosition(mouseEvent.latLng);
    });
    kakao.maps.event.addListener(circle, 'click', function() {
        if(_per_click){
            if(_per_arrive){
                arriveClick.location = circle.getPosition();
                move2ClickedPlace_before(Number(arr.name), arriveClick.location);
            }else{
                console.log("It's moving now")
            }
        }
    });
    circle.setMap(map);
}

function displayLine(arr: typeof lineData[0]){
    const line = new kakao.maps.Polyline({
        path: arr.linePath,
        strokeWeight: 2,
        strokeColor: 'black',
        strokeOpacity: 0.2,
        strokeStyle: 'solid'
    });
    line.setMap(map)
}