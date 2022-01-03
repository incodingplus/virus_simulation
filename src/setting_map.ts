import { Person } from './person'
import { NumOfPeople } from './constants';
import { areas, peoples } from './variable';
import { Area } from './Area';

const resultDiv = document.querySelector<HTMLDivElement>('#ClickResultDiv');

export let map:kakao.maps.Map = null;

export function init(){
    const container = document.getElementById('map');
    let level56check:boolean = false;

    const options = { // 지도 기본 설정
        center: new kakao.maps.LatLng(37.32191655510652, 126.83084311183287), //지도의 중심좌표
        minLevel: 2,
        maxLevel: 6,  
        level: 3 //지도의 레벨(확대, 축소 정도)
    };
    
    map = new kakao.maps.Map(container, options);

    kakao.maps.event.addListener(map, 'click', function(mouseEvent) {
        // 클릭한 위도, 경도 정보 가져오기
        let latlng = mouseEvent.latLng;
        let lat = latlng.getLat();
        let lng = latlng.getLng();

        
        let message = `Lat: ${lat.toFixed(7)} \u00a0\u00a0 Lng: ${lng.toFixed(7)}`;

        resultDiv.innerHTML = `${message}`;
    });

    kakao.maps.event.addListener(map, 'zoom_changed', function() {
        const level = map.getLevel();
        if(level >= 6){
            level56check = true;
            set(0)
        }else if(level56check){
            set(1)
            level56check = false;
        }
    });

    return {
        map
    }
}

function set(e:0|1){
    if(e == 0){
        for(let i = 0; i < peoples.length; i++){
            peoples[i].disappearance()
        }
        Area.appearance();
    }else{
        for(let i = 0; i < peoples.length; i++){
            peoples[i].appearance()
        }
        Area.disappearance();
    }
}