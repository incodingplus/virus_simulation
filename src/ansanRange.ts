import { ANSANrange } from './constants'

// 지도에 표시할 다각형을 생성합니다
var polygon = new kakao.maps.Polygon({
    path: ANSANrange,
    strokeWeight: 3,
    strokeColor: '#000000',
    strokeOpacity: 0.8,
    fillOpacity: 0
});

export function init(map: kakao.maps.Map){
    // polygon.setMap(map)
}