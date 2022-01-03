import { map } from "./setting_map";

// // const place1_locate = [
// //     new kakao.maps.LatLng(37.32933536994017, 126.8293114615251),
// //     new kakao.maps.LatLng(37.32901483674477, 126.83519641257668),
// //     new kakao.maps.LatLng(37.323279071439586, 126.83469558904265),
// //     new kakao.maps.LatLng(37.32354054862002, 126.82848966738194),
// // ]
// // const place2_locate = [
// //     new kakao.maps.LatLng(37.32933536994017, 126.8293114615251),
// //     new kakao.maps.LatLng(37.32901483674477, 126.83519641257668),
// //     new kakao.maps.LatLng(37.323279071439586, 126.83469558904265),
// //     new kakao.maps.LatLng(37.32354054862002, 126.82848966738194),
// // ]

// export const roadData = [
//     {
//         name: '0',
//         latlng: new kakao.maps.LatLng(37.32139718805513, 126.82615349592524),
//         road:[3, 10]
//     },
//     {
//         name: '1',
//         latlng: new kakao.maps.LatLng(37.32129168640486, 126.82794759533225),
//         road:[10, 2, 9]
//     },
//     {
//         name: '2',
//         latlng: new kakao.maps.LatLng(37.31952549631158, 126.82783316198426),
//         road:[11, 3, 4, 5]
//     },
//     {
//         name: '3',
//         latlng: new kakao.maps.LatLng(37.31962644974966, 126.8260109102293),
//         road:[0, 2]
//     },
//     {
//         name: '4',
//         latlng: new kakao.maps.LatLng(37.3180746578312, 126.82771237325352),
//         road:[2, 7]
//     },
//     {
//         name: '5',
//         latlng: new kakao.maps.LatLng(37.31943326510669, 126.8294748798133),
//         road:[2, 6, 9]
//     },
//     {
//         name: '6',
//         latlng: new kakao.maps.LatLng(37.319371869951624, 126.8306426878406),
//         road:[5, 8]
//     },
//     {
//         name: '7',
//         latlng: new kakao.maps.LatLng(37.31716449441053, 126.82762983940111),
//         road:[4, 8]
//     },
//     {
//         name: '8',
//         latlng: new kakao.maps.LatLng(37.31700638361314, 126.83045056931475),
//         road:[6, 7]
//     },{
//         name: '9',
//         latlng: new kakao.maps.LatLng(37.32119951059542, 126.82962883868359),
//         road:[1, 5]
//     },{
//         name: '10',
//         latlng: new kakao.maps.LatLng(37.321339960218886, 126.82706747969368),
//         road:[0, 1, 11]
//     },{
//         name: '11',
//         latlng: new kakao.maps.LatLng(37.319569231194016, 126.82693051356355),
//         road:[2, 3, 10]
//     },
// ];


// const corner:kakao.maps.Circle[] = [];
// for (let i of roadData) {
//     displayArea(i)
// }

// function displayArea(arr:typeof roadData[0]){
//     const circle = new kakao.maps.Circle({
//         center: arr.latlng,
//         radius: 10,
//         strokeWeight: 3,
//         strokeColor: '#39DE2A',
//         strokeOpacity: 0.8,
//         fillColor: '#A2FF99',
//         fillOpacity: 0.5
//     });

//     const customOverlay = new kakao.maps.CustomOverlay({
//         position: arr.latlng,
//         content: arr.name
//     });

//     kakao.maps.event.addListener(circle, 'mouseover', function(mouseEvent) {
//         customOverlay.setContent(`<div class='area'>${arr.name}</div>`);
//         customOverlay.setPosition(mouseEvent.latLng); 
//         customOverlay.setMap(map);
//     });
//     kakao.maps.event.addListener(circle, 'mouseout', function() {
//         customOverlay.setMap(null);
//     });
    
//     kakao.maps.event.addListener(circle, 'mousemove', function(mouseEvent) {
//         customOverlay.setPosition(mouseEvent.latLng);
//     });

//     corner.push(circle)
// }

// export function init(map: kakao.maps.Map){
//     for(let i of corner){
//         i.setMap(map)
//     }
// }
