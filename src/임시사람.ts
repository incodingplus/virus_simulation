// class Heap<T>{
//     private arr: { score: number, data: T }[] = [];
//     constructor() { }
//     private heapifyInc(num: number): boolean {
//         if (num === 0) return true;
//         const arr = this.arr;
//         const pum = Math.floor(num / 2);
//         const cur = arr[num];
//         const nex = arr[pum];
//         if (cur.score < nex.score) {
//             arr[num] = nex;
//             arr[pum] = cur;
//             return this.heapifyInc(pum);
//         } else {
//             return true;
//         }
//     }

//     push(data: T, score: number) {
//         if (isNaN(score)) throw Error('score 숫자를 쓰세요');
//         const num = this.arr.push({ data, score }) - 1;
//         return this.heapifyInc(num);
//     }

//     private heapifyDec(num = 0): boolean {
//         const n2 = (num + 1) * 2;
//         const n1 = n2 - 1;
//         const arr = this.arr;
//         const cur = arr[num];
//         const nex1 = arr[n1];
//         const nex2 = arr[n2];
//         if (nex2) {
//             let pick: number;
//             if (nex2.score > nex1.score) {
//                 pick = n1;
//             } else {
//                 pick = n2;
//             }
//             const nex = arr[pick];
//             if (nex.score < cur.score) {
//                 arr[pick] = cur;
//                 arr[num] = nex;
//                 return this.heapifyDec(pick);
//             }
//             return true;
//         } else if (nex1) {
//             if (nex1.score < cur.score) {
//                 arr[n1] = cur;
//                 arr[num] = nex1;
//             }
//             return true;
//         } else {
//             return true;
//         }
//     }
//     pop() {
//         if (this.isEmpty()) return null;
//         const arr = this.arr;
//         const now = arr[0];
//         const cur = arr.pop();
//         if (arr.length !== 0) {
//             arr[0] = cur;
//             this.heapifyDec();
//         }
//         return now.data;
//     }
//     isEmpty() {
//         if (this.arr.length === 0) return true;
//         return false;
//     }
// }


// // =======================================================================================================================================================================
// // =======================================================================================================================================================================


// import { pointData, lineData } from './roadPoint';
// import { arriveClick } from './variable'
// import { P_inf } from './constants';
// import { NodeBuilderFlags } from 'typescript';

// type pd = {
//     name: string;
//     latlng: kakao.maps.LatLng;
//     lines: number[];
// }
// type ld = {
//     road_id: number;
//     linePath: kakao.maps.LatLng[];
//     points: number[];
// }
// type heapT = {
//     data: number;
//     score: number;
//     pre: number;
// }
// type rd = {
//     locNum: number;
//     clc: kakao.maps.Circle;
//     lineNum: number;
// }

// const red: rd = {
//     locNum: null,
//     clc: null,
//     lineNum: null
// }

// export let per_click: boolean = false;
// export let per_arrive: boolean = false;

// export function init(map: kakao.maps.Map) {
//     red.locNum = Math.floor(Math.random() * pointData.length);

//     const circle = new kakao.maps.Circle({
//         center: pointData[red.locNum].latlng, // 원의 중심좌표
//         radius: 20, // 미터 단위의 원의 반지름
//         strokeOpacity: 0, // 선의 불투명도 1에서 0 사이의 값이며 0에 가까울수록 투명
//         fillColor: 'red', // 채우기 색깔
//         fillOpacity: 1 // 채우기 불투명도
//     });
    
//     red.clc = circle;

//     kakao.maps.event.addListener(circle, 'click', function (mouseEvent) {
//         if (!per_click) {
//             P_inf.style.display = 'block';
//             P_inf.style.filter = 'opacity(100%)'
//             per_click = true;
//         }
//         console.log(per_click);
//     })

//     circle.setMap(map)
//     let lineNum: number;
//     let nexNum: number;
//     function autoMoving(circle: kakao.maps.Circle, speed: number, lineId: number, from: kakao.maps.LatLng) {
//         const followRoad = () => {
//             let index = 0;
//             let i = 0;
//             let n: 1 | -1 = null;
//             const fx = from.getLat();
//             const fy = from.getLng();
//             const fl_x = lineData[lineId].linePath[i].getLat();
//             const fl_y = lineData[lineId].linePath[i].getLng();
//             const result = (((fx - fl_x) ** 2 + (fy - fl_y) ** 2) ** 0.5);
//             const check = () => {
//                 if (n == 1) {
//                     return i >= lineData[lineId].linePath.length - 1;
//                 } else {
//                     return i <= 0;
//                 }
//             }
//             if (result <= 0.0002) {
//                 i = 0
//                 n = 1;
//             } else {
//                 i = lineData[lineId].linePath.length - 1;
//                 n = -1;
//             }
//             const moving1road = () => {
//                 const prex = lineData[lineId].linePath[i].getLng();
//                 const prey = lineData[lineId].linePath[i].getLat();
//                 const nexx = lineData[lineId].linePath[i + n].getLng();
//                 const nexy = lineData[lineId].linePath[i + n].getLat();
//                 const dist = ((nexx - prex) ** 2 + (nexy - prey) ** 2) ** 0.5 * speed;
//                 const X = (index * nexx + (dist - index) * prex) / dist;
//                 const Y = (index * nexy + (dist - index) * prey) / dist;
//                 const position = new kakao.maps.LatLng(Y, X);
//                 circle.setPosition(position);
//                 // console.log('error')
//                 map.setCenter(circle.getPosition());
//                 index++;

//                 if (index >= dist) {
//                     index = 0;
//                     i += n;
//                     if (check()) {
//                         if (!per_click) {
//                             findmove();
//                         }
//                         per_arrive = true;
//                         return;
//                     }
//                 }
//                 requestAnimationFrame(moving1road);
//             };
//             moving1road();
//         }
//         followRoad();
//     }
//     const findmove = () => {
//         per_arrive = false;
//         const from = pointData[red.locNum]; // start point
//         const lines = from.lines.concat();
//         for (let i = 0; i < lines.length; i++) {
//             const temp = Math.floor(Math.random() * (lines.length - i)) + i;
//             const val = lines[i];
//             lines[i] = lines[temp];
//             lines[temp] = val;
//         }
//         for (let i of lines) {
//             lineNum = i;
//             const picks = lineData[lineNum].points.filter(v => v !== red.locNum); // 시작점 반대 points
//             if (!picks.length) {
//                 continue;
//             }
//             nexNum = picks[Math.floor(picks.length * Math.random())]; // 도착할 point number
//             const speed = 30000;
//             autoMoving(circle, speed, lineNum, from.latlng);
//             red.locNum = Number(nexNum);
//             break;
//         }
//     }

//     findmove();

//     document.onkeyup = (e: any) => {
//         if (per_click) {
//             if (e.keyCode == 27) {
//                 P_inf.style.display = 'none';
//                 P_inf.style.filter = 'opacity(0%)'
//                 per_click = false;
//                 console.log(per_click);
//                 findmove();
//             }
//         }
//     }
// }


// // =======================================================================================================================================================================
// // =======================================================================================================================================================================


// export function move2ClickedPlace(arrivePoint: number, map: kakao.maps.Map, arriveLocation: kakao.maps.LatLng) {
//     console.log(`선택지점: ${arrivePoint}`);
//     moveStart(red.clc, red.locNum);

//     function findPath(startPoint: number) {
//         const r = startPoint;

//         const findWay = (start: heapT, goal: number): [number[], Map<number, heapT>] => {
//             const history: Map<number, heapT> = new Map<number, heapT>();
//             const heap = new Heap<heapT>();
//             let data = start;
//             history.set(data.data, data);
//             const goalLocation = arriveLocation;
//             const goalx = goalLocation.getLat();
//             const goaly = goalLocation.getLng();

//             // 도착전까지
//             while (goal != data.data) {
//                 const currentPointId = data.data;
//                 const currentPointData = pointData[currentPointId];
//                 const currentPointConnectedLines = currentPointData.lines;
//                 // 현재 포인트에 연결된 다음 포인트들 중 방문하지 않은 point를 heap에 넣어준다.
//                 for (const lineId of currentPointConnectedLines) {
//                     const [nextPointId] = lineData[lineId].points.filter(v => v !== currentPointId);
//                     if (nextPointId == null || history.has(nextPointId)) {
//                         continue;
//                     }

//                     const polyline = new kakao.maps.Polyline({
//                         path: lineData[lineId].linePath
//                     })

//                     const nowX = red.clc.getPosition().getLat();
//                     const nowY = red.clc.getPosition().getLng();
//                     const lengthFromStartToFinish = ((nowX - goalx) ** 2 + (nowY - goaly) ** 2) ** 0.5;

//                     const roadLength = polyline.getLength();
//                     heap.push({
//                         data: nextPointId,
//                         pre: currentPointId,
//                         score: roadLength + data.score + lengthFromStartToFinish
//                     }, roadLength + data.score + lengthFromStartToFinish)
//                 }

//                 // heap에 있는 후보중 가장 괜찮은 애를 뽑아온다.
//                 data = heap.pop();
//                 history.set(data.data, data);
//                 // 현재 포인트에서 다시 위 과정 반복
//             }
//             // 도착까지 경로 다 찾음.

//             // history에서 도착 포인트를 가져온다.
//             let goalPoint = history.get(goal);
//             const total = goalPoint.score;

//             const list: number[] = [];
//             while (goalPoint.pre !== -1) {
//                 const prevPointId = goalPoint.pre;
//                 list.push(goalPoint.data);
//                 goalPoint = history.get(prevPointId);
//             }
//             list.push(r);
//             list.reverse();
//             return [list, history];
//         }
//         return findWay({ data: r, score: 0, pre: -1 }, arrivePoint);
//     };

//     function moveStart(circle: kakao.maps.Circle, startPoint: number) {
//         per_arrive = false;
//         const codes = findPath(startPoint);
//         const way = codes[0];
//         let wayCount: number = 0;
//         const lineId: number[] = [];
//         const speed = 30000;
//         console.log(`way: ${way}`);
//         autoMoving(pointData[way[wayCount]].latlng);

//         function autoMoving(from: kakao.maps.LatLng) {
//             let lineIdCount:number = 0;
//             for (wayCount; wayCount < way.length - 1; wayCount++) {
//                 for (let p = 0; p < pointData[way[wayCount]].lines.length - 1; p++) {
//                     const checkLine:number = pointData[way[wayCount]].lines[p];
//                     if (lineData[checkLine].points.includes(way[wayCount]) && lineData[checkLine].points.includes(way[wayCount + 1])) {
//                         lineId.push(checkLine);
//                         break;
//                     }
//                 }
//             }
//             wayCount = 0;
//             console.log(`lineId: ${lineId}`);
//             const followRoad = () => {
//                 // console.log(pointData[way[wayCount]])
//                 wayCount++;
//                 let index = 0;
//                 let i = 0;
//                 let n: 1 | -1 = null;
//                 const fx = from.getLat();
//                 const fy = from.getLng();
//                 const fl_x = lineData[lineId[lineIdCount]].linePath[i].getLat();
//                 const fl_y = lineData[lineId[lineIdCount]].linePath[i].getLng();
//                 const result = (((fx - fl_x) ** 2 + (fy - fl_y) ** 2) ** 0.5);
//                 const check = () => {
//                     if (n == 1) {
//                         return i >= lineData[lineId[lineIdCount]].linePath.length - 1;
//                     } else {
//                         return i <= 0;
//                     }
//                 }
//                 if (result <= 0.0002) {
//                     i = 0;
//                     n = 1;
//                     // console.log('경우1')
//                 } else {
//                     i = lineData[lineId[lineIdCount]].linePath.length - 1;
//                     n = -1;
//                     // console.log('경우2')
//                 }
//                 const moving1road = () => {
//                     const prex = lineData[lineId[lineIdCount]].linePath[i].getLng();
//                     const prey = lineData[lineId[lineIdCount]].linePath[i].getLat();
//                     const nexx = lineData[lineId[lineIdCount]].linePath[i + n].getLng();
//                     const nexy = lineData[lineId[lineIdCount]].linePath[i + n].getLat();
//                     const dist = ((nexx - prex) ** 2 + (nexy - prey) ** 2) ** 0.5 * speed;
//                     const X = (index * nexx + (dist - index) * prex) / dist;
//                     const Y = (index * nexy + (dist - index) * prey) / dist;
//                     const position = new kakao.maps.LatLng(Y, X);
//                     // console.log(prex, prey, nexx, nexy, i, n, index, dist);
//                     circle.setPosition(position);
//                     map.setCenter(circle.getPosition());
//                     // console.log (index, dist)
//                     index++;
//                     if (index >= dist) {
//                         // console.log(index, dist)
//                         index = 0;
//                         i += n;
//                         if (check()) {
//                             // console.log(`return${lineIdCount}`);
//                             if(lineIdCount > lineId.length - 2){
//                                 return;
//                             }else{
//                                 lineIdCount++;
//                                 from = pointData[way[wayCount]].latlng;
//                                 followRoad();
//                             }
//                             return;
//                         }
//                     }
//                     requestAnimationFrame(moving1road);
//                 };
//                 // console.log(`lineIdCount: ${lineIdCount} (움직임 시작)`)
//                 moving1road();
//             }
//             followRoad();
//             per_arrive = true;
//             return;
//         }
//         red.locNum = arrivePoint;
//         return red.locNum;
//     }
// }