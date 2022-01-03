import { People } from './types'
import { NumOfPeople, pol_mask, timeSpeed } from './constants'
import { variable, moveOpts, areas } from './variable'
import { pointData, lineData } from './roadPoint'
import { P_inf } from './constants';
import { NodeBuilderFlags } from 'typescript';
import { fun } from './infec_range'
import { hospital_data } from './hospital_data';
import { areaData, setting } from './main';
import { Area } from './Area';


export let _per_click: boolean = false;
export let _per_arrive: boolean = false;

type pd = {
    name: string;
    latlng: kakao.maps.LatLng;
    lines: number[];
}
type ld = {
    road_id: number;
    linePath: kakao.maps.LatLng[];
    points: number[];
}
type heapT = {
    data: number;
    score: number;
    pre: number;
    d: number;
}
type rd = {
    locNum: number;
    clc: kakao.maps.Circle;
    lineNum: number;
}

class Heap<T extends { score: number }>{
    arr = [];
    constructor() { }
    push(data: T) {
        const arr = this.arr;
        if (arr.length === 0) {
            arr.push(data);
            return 0;
        } else {
            const index = this.find(arr, 0, arr.length - 1, data.score);

            this.arr.splice(index, 0, data);
        }
    }
    pop(): T {
        return this.arr.shift();
    }
    private find(arr: T[], left = 0, right = -1, score: number): number {
        if (right === -1) {
            right = arr.length - 1;
        } else if (right - left <= 1) {
            if (arr[right].score <= score) return right + 1;
            else if (arr[left].score <= score) return left + 1;
            else return 0;
        }
        const mid = Math.floor((left + right) / 2);
        if (arr[mid].score <= score) left = mid;
        else right = mid;
        return this.find(arr, left, right, score);
    }
}


// =======================================================================================================================================================================
// =======================================================================================================================================================================

const speed_ = 50000;
export class Person implements People {
    circle: kakao.maps.Circle;
    position: People["position"];
    color: People["color"];
    infection: People["infection"];
    die: People["die"];
    deathRate: People['deathRate'];
    infectionRate: People['infectionRate'];
    locNum: People['locNum'];
    per_click: People['per_click'];
    per_arrive: People['per_arrive'];
    lineNum: People['lineNum'];
    nexNum: People['nexNum'];
    mask: People['mask'];
    goToHospital_: People['goToHospital_'];
    hvToGoHospital: People['hvToGoHospital'];
    nearestHospital: People['nearestHospital'];
    RecoveredCheck;

    constructor(map: kakao.maps.Map) {
        let loc: number = null;
        let randLocation: kakao.maps.LatLng = null;
        loc = Math.floor(Math.random() * pointData.length);
        randLocation = pointData[loc].latlng;

        this.circle = new kakao.maps.Circle({
            center: randLocation, // 원의 중심좌표
            radius: 5, // 미터 단위의 원의 반지름
            strokeColor: 'white',
            strokeWeight: 1,
            strokeOpacity: 0, // 선의 불투명도 1에서 0 사이의 값이며 0에 가까울수록 투명
            fillColor: 'green', // 채우기 색깔
            fillOpacity: 1,  // 채우기 불투명도
        });

        kakao.maps.event.addListener(this.circle, 'click', () => {
            if (!_per_click && !this.die) {
                _per_click = true;
                this.per_click = true;
                this.circle.setRadius(15);
            }

            P_inf.style.display = 'block';
            P_inf.innerHTML = `x: ${this.position.x}<br>y: ${this.position.y}<br>infection: ${this.infection}`;
            P_inf.style.filter = 'opacity(100%)';
            P_inf.style.transition = 'all 0.3s';
            setTimeout(() => {
                P_inf.style.filter = 'opacity(0%)';
                setTimeout(() => {
                    P_inf.style.display = 'none';
                    P_inf.style.transition = 'all 0s';
                }, 300)
            }, 1500);
        })

        document.addEventListener('keyup', e => {
            if (e.key == 'Escape' && this.per_click == true) {
                this.circle.setRadius(5);
                if (this.per_arrive) {
                    this.per_click = false;
                    _per_click = false;
                    moveOpts.check = false;
                    this.findmove();
                } else {
                    let a = setInterval(() => {
                        if (this.per_arrive) {
                            clearInterval(a);
                            if (this.hvToGoHospital) {
                                // console.log('병원');
                            } else {
                                // console.log('remove');
                                this.findmove();
                            }
                            this.per_click = false;
                            _per_click = false;
                            moveOpts.check = false;
                            return;
                        }
                    }, 60)
                }
            }
        })

        this.circle.setMap(map);

        this.position = { x: randLocation.getLng(), y: randLocation.getLat() };
        this.color = 'green';
        this.infection = false;
        this.infectionRate = 10;
        this.deathRate = 1;
        this.die = false;
        this.locNum = loc;
        this.per_click = false;
        this.per_arrive = false;
        this.lineNum = null;
        this.nexNum = null;
        this.mask = false;
        this.goToHospital_ = false;
        this.hvToGoHospital = false;
        this.nearestHospital = [];
        this.RecoveredCheck = false;
    }
    disappearance() {
        this.circle.setOptions({ fillOpacity: 0, strokeWeight: 0 })
    }

    appearance() {
        this.circle.setOptions({ fillOpacity: 100, strokeWeight: 1 })
    }

    discrimination() {
        if (this.infection) {
            const checkCirposition = this.circle.getPosition();
            const checkCirposition_x = checkCirposition.getLng(); // 사람좌표
            const checkCirposition_y = checkCirposition.getLat();
            const checkbounds = new kakao.maps.LatLngBounds(areaData[0].path[0], areaData[areaData.length - 1].path[1]);
            const checkresult: boolean = checkbounds.contain(checkCirposition)
            const start_ltX = 126.7770165389483 // 왼쪽위 x
            const start_ltY = 37.34541734164257 // 왼쪽위 y
            const end_rdX = 126.8788533379556 // 오른쪽아래 x
            const end_rdY = 37.29265678666862 // 오른쪽아래 y
            const x = (end_rdX - start_ltX) / 10;
            const y = (start_ltY - end_rdY) / 6;
            if (checkresult) {
                const areanumberx = Math.trunc((checkCirposition_x - start_ltX) / x)
                const areanumbery = Math.trunc((start_ltY - checkCirposition_y) / y)
                const result = areanumberx + areanumbery * 10
                Area.all[result].containPeople++;
            }
        }
    }

    changeColor() {
        if (this.color == 'green') {
            // if((this.circle as any).Eb.fillColor == 'rgb(0, 190, 0)'){
            //     // console.log('a')
            //     // this.findmove();
            //     // debugger;
            // }
            this.circle.setOptions({ fillColor: 'red' });
            this.color = 'red';
            if (setting.hospitalSystem) {
                this.hvToGoHospital = true;
                if(this.RecoveredCheck){
                    this.checkedInfection();
                    this.RecoveredCheck = false;
                }
            }
            this.infection = true;
            this.deathAlgorithm();
        } else {
            this.infection = false;
            this.color = 'green';
            this.circle.setOptions({ fillColor: 'rgb(0, 190, 0)' })
            this.infectionRate = 1;
            this.locNum = this.nearestHospital[0].entrance;
            this.hvToGoHospital = false;
        }
    }

    WearAMast_toggle() {
        if (pol_mask.checked) {
            this.circle.setOptions({ strokeOpacity: 100 });
            this.infectionRate == 1;
            this.mask = true;
        } else {
            this.circle.setOptions({ strokeOpacity: 0 });
            if (this.infectionRate != 1) {
                this.infectionRate = 10;
            } else {
                this.infectionRate == 1;
            }
            this.mask = false;
        }
    }

    // hospital_toggle(){
    //     if(this.goToHospital_){
    //         this.goToHospital_ = false;
    //         this.hvToGoHospital = false;
    //     }else{
    //         if(this.infection){
    //             this.hvToGoHospital = true;
    //         }
    //         this.checkedInfection();
    //         this.goToHospital_ = true;
    //     }
    // }

    goToHospital(arriveLocation: kakao.maps.LatLng, arrivePoint: number) {
        this.move2ClickedPlace(arrivePoint, arriveLocation);
    }

    checkedInfection() {
        const a = setInterval(() => {
            if (this.per_click) {
                // console.log(this.per_arrive, _per_arrive)
            }
            // if(this.infection){
            //     console.log(this.per_arrive, _per_arrive)
            // }
            if (this.infection && this.per_arrive && !this.per_click) {
                const per = (n: number) => {
                    let rand = Math.random();
                    let num = n / 100;
                    if (rand <= num) {
                        clearInterval(a)
                        for (let i = 0; i < hospital_data.length; i++) {
                            const hospital_entrance = hospital_data[i].entrance;
                            const goalx = pointData[hospital_entrance].latlng.getLat();
                            const goaly = pointData[hospital_entrance].latlng.getLng();
                            const nowX = this.circle.getPosition().getLat();
                            const nowY = this.circle.getPosition().getLng();
                            const lengthFromStartToFinish = ((nowX - goalx) ** 2 + (nowY - goaly) ** 2) ** 0.5;
                            this.nearestHospital.push({ distance: lengthFromStartToFinish, entrance: hospital_entrance, hospitalNumber: i })
                        }

                        this.nearestHospital.sort(function (a, b) {
                            return a.distance - b.distance;
                        });

                        // console.log(this.nearestHospital[0]);
                        if (this.nexNum == this.nearestHospital[0].entrance) {
                            this.quarantineInHospital();
                        }
                        this.goToHospital(pointData[this.nearestHospital[0].entrance].latlng, this.nearestHospital[0].entrance);
                        return;
                    } else {
                        // console.log('nope');
                        this.findmove();
                        this.hvToGoHospital = false;
                        this.NP_Hospital_count();
                    }
                }
                per(30);
            }
        }, 60)
    }

    NP_Hospital_count(){
        let count = 0;
        const a = setInterval(()=>{
            if(count >= 5){
                this.hvToGoHospital = true;
                clearInterval(a)
            }
            // console.log(count)
            count++;
        }, 1000)
    }

    quarantineInHospital() {
        this.circle.setOptions({ fillOpacity: 0 });
        // console.log(this.nearestHospital)
        hospital_data[this.nearestHospital[0].hospitalNumber].enteredPeople++;
        const maxTime = 20;
        const minTime = 15;
        let quarantineTime = Math.floor(Math.random() * (maxTime - minTime + 1)) + minTime;
        // console.log(`회복시간: ${quarantineTime}`)
        quarantineTime = 3;
        let a = setInterval(() => {
            if(variable.movingStart){
                quarantineTime--;
            }
            // console.log(quarantineTime)
            if (quarantineTime <= 0) {
                this.circle.setOptions({ fillOpacity: 100 });
                this.changeColor();
                // console.log(this.nearestHospital[0].entrance)
                hospital_data[this.nearestHospital[0].hospitalNumber].enteredPeople--;
                NumOfPeople.Recovered++;
                NumOfPeople.Infectious--;
                clearInterval(a);
                this.RecoveredCheck = true;
                this.findmove();
            }
        }, 1000)
    }

    deathAlgorithm() {
        if (this.infection) {
            let count = 0;
            // console.log('d')
            const a = setInterval(() => {
                if(variable.movingStart){
                    count++;
                }
                // console.log(count)
                if(!this.infection){
                    clearInterval(a);
                }
                if (count >= 20) {
                    this.Fper(this.deathRate, a);
                }
            }, 1000)
        }
    }
    Fper(per: number, a) {
        let rand = Math.random();
        let num = per / 100;
        if (rand <= num) {
            this.death();
            clearInterval(a)
            NumOfPeople.deadPer++;
        } else{
            if(this.deathRate < 100){
                this.deathRate++;
            }
            clearInterval(a)
            this.deathAlgorithm();
        }
    }
    death() {
        this.circle.setOptions({ fillColor: 'gray' });
        this.color = 'gray';
        this.die = true;
    }

    autoMoving(circle: kakao.maps.Circle, speed: number, lineId: number, from: kakao.maps.LatLng) {
        const followRoad = () => {
            let index = 0;
            let i = 0;
            let n: 1 | -1 = null;
            const fx = from.getLat();
            const fy = from.getLng();
            const fl_x = lineData[lineId].linePath[i].getLat();
            const fl_y = lineData[lineId].linePath[i].getLng();
            const result = (((fx - fl_x) ** 2 + (fy - fl_y) ** 2) ** 0.5);
            const check = () => {
                if (n == 1) {
                    return i >= lineData[lineId].linePath.length - 1;
                } else {
                    return i <= 0;
                }
            }
            if (result <= 0.0002) {
                i = 0
                n = 1;
            } else {
                i = lineData[lineId].linePath.length - 1;
                n = -1;
            }
            const moving1road = () => {
                if (variable.movingStart) {
                    const prex = lineData[lineId].linePath[i].getLng();
                    const prey = lineData[lineId].linePath[i].getLat();
                    const nexx = lineData[lineId].linePath[i + n].getLng();
                    const nexy = lineData[lineId].linePath[i + n].getLat();
                    let dist = ((nexx - prex) ** 2 + (nexy - prey) ** 2) ** 0.5 * speed;
                    if(dist === 0) dist = Number.EPSILON;
                    const X = (index * nexx + (dist - index) * prex) / dist;
                    const Y = (index * nexy + (dist - index) * prey) / dist;
                    const position = new kakao.maps.LatLng(Y, X);
                    this.position.x = position.getLng();
                    this.position.y = position.getLat();
                    circle.setPosition(position);
                    index++;
                    if (this.die) {
                        return;
                    }
                    if (index >= dist) {
                        index = 0;
                        i += n;
                        if (check()) {
                            this.per_arrive = true;
                            if (this.per_click) {
                                _per_arrive = true;
                            } else {
                                // if(this.infection){
                                //     console.log('findmove?')
                                // }
                                if (!this.hvToGoHospital) {
                                    this.findmove();
                                }
                            }
                            return;
                        }
                    }
                }
                requestAnimationFrame(moving1road);
            };
            moving1road();
        }
        followRoad();
    }

    findmove() {
        this.per_arrive = false;

        const from = pointData[this.locNum]; // start point

        if (this.infection) {
            // console.log('findmove')
        }
        const lines = from.lines.concat();
        for (let i = 0; i < lines.length; i++) {
            const temp = Math.floor(Math.random() * (lines.length - i)) + i;
            const val = lines[i];
            lines[i] = lines[temp];
            lines[temp] = val;
        }

        for (let i of lines) {
            this.lineNum = i;
            const picks = lineData[this.lineNum].points.filter(v => v !== this.locNum); // 시작점 반대 points
            if (!picks.length) {
                continue;
            }
            this.nexNum = picks[Math.floor(picks.length * Math.random())]; // 도착할 point number
            const speed = speed_;
            this.autoMoving(this.circle, speed, this.lineNum, from.latlng);
            this.locNum = Number(this.nexNum);
            break;
        }
    }

    move2ClickedPlace(arrivePoint: number, arriveLocation: kakao.maps.LatLng) {
        // console.log(`선택지점: ${arrivePoint}`);
        const moveStart = (startPoint: number) => {
            this.per_arrive = false;
            _per_arrive = false;
            const codes = this.findPath(startPoint, arriveLocation, arrivePoint);
            const way = codes[0];
            let wayCount: number = 0;
            const lineId: number[] = [];
            const speed = speed_;
            // console.log(`way: ${way}`);

            const autoMoving = (from: kakao.maps.LatLng) => {
                let lineIdCount: number = 0;
                for (wayCount; wayCount < way.length - 1; wayCount++) {
                    for (let p = 0; p < pointData[way[wayCount]].lines.length; p++) {
                        const checkLine: number = pointData[way[wayCount]].lines[p];
                        if (lineData[checkLine].points.includes(way[wayCount]) && lineData[checkLine].points.includes(way[wayCount + 1])) {
                            lineId.push(checkLine);
                            break;
                        }
                    }
                }
                wayCount = 0;
                // console.log(`lineId: ${lineId}`);
                const followRoad = () => {
                    // console.log(pointData[way[wayCount]])
                    wayCount++;
                    let index = 0;
                    let i = 0;
                    let n: 1 | -1 = null;
                    const fx = from.getLat();
                    const fy = from.getLng();
                    const fl_x = lineData[lineId[lineIdCount]].linePath[i].getLat();
                    const fl_y = lineData[lineId[lineIdCount]].linePath[i].getLng();
                    const result = (((fx - fl_x) ** 2 + (fy - fl_y) ** 2) ** 0.5);
                    const check = () => {
                        if (n == 1) {
                            return i >= lineData[lineId[lineIdCount]].linePath.length - 1;
                        } else {
                            return i <= 0;
                        }
                    }
                    if (result <= 0.0002) {
                        i = 0;
                        n = 1;
                        // console.log('경우1')
                    } else {
                        i = lineData[lineId[lineIdCount]].linePath.length - 1;
                        n = -1;
                        // console.log('경우2')
                    }
                    const moving1road = () => {
                        if (variable.movingStart) {
                            const prex = lineData[lineId[lineIdCount]].linePath[i].getLng(); //현재 좌표 x
                            const prey = lineData[lineId[lineIdCount]].linePath[i].getLat(); //현재 좌표 y
                            const nexx = lineData[lineId[lineIdCount]].linePath[i + n].getLng(); //목표 좌표 x
                            const nexy = lineData[lineId[lineIdCount]].linePath[i + n].getLat(); //목표 좌표 y
                            const dist = ((nexx - prex) ** 2 + (nexy - prey) ** 2) ** 0.5 * speed; // 점과 점사이 거리에 speed를 곱
                            const X = (index * nexx + (dist - index) * prex) / dist; // 1:99, 2:98, 3:97 ...
                            const Y = (index * nexy + (dist - index) * prey) / dist;
                            const position = new kakao.maps.LatLng(Y, X);
                            // console.log(prex, prey, nexx, nexy, i, n, index, dist);
                            this.position.x = position.getLng();
                            this.position.y = position.getLat();
                            this.circle.setPosition(position);
                            // console.log (index, dist)
                            index++;
                            if (index >= dist) {
                                // console.log(index, dist)
                                if (this.die) {
                                    return;
                                }
                                index = 0;
                                i += n;
                                if (check()) {
                                    // console.log(`return${lineIdCount}`);
                                    if (lineIdCount > lineId.length - 2) {
                                        this.per_arrive = true;
                                        _per_arrive = true;
                                        if (this.hvToGoHospital && !_per_click) {
                                            // console.log(this.per_arrive, _per_arrive)
                                            this.quarantineInHospital()
                                        }
                                        this.locNum = arrivePoint;
                                        return;
                                    } else {
                                        lineIdCount++;
                                        from = pointData[way[wayCount]].latlng;
                                        followRoad();
                                    }
                                    return;
                                }
                            }
                            requestAnimationFrame(moving1road);
                        }
                    };
                    // console.log(`lineIdCount: ${lineIdCount} (움직임 시작)`)
                    moving1road();
                }
                followRoad();
                return;
            }
            autoMoving(pointData[way[wayCount]].latlng);
            return this.locNum;
        }
        if (arrivePoint !== this.locNum) {
            moveStart(this.locNum);
        } else {
            return;
        }
    }

    findPath(startPoint: number, arriveLocation: kakao.maps.LatLng, arrivePoint: number) {
        const r = startPoint;

        const findWay = (start: heapT, goal: number): [number[], Map<number, heapT>] => {
            const history = new Map<number, heapT>();
            const heap = new Heap<heapT>();
            let data = start;
            history.set(data.data, data);
            // console.log(history)
            // for(let [k, v] of Array.from(history)){
            //     console.log(k, v);
            // }
            // console.log(history.set(data.data, data))
            const goalLocation = arriveLocation;
            const goalx = goalLocation.getLat();
            const goaly = goalLocation.getLng();

            // 도착전까지
            while (goal != data.data) {
                const currentPointId: number = data.data;
                // console.log(currentPointId)
                const currentPointData = pointData[currentPointId];
                const currentPointConnectedLines = currentPointData.lines; // 현재 점의 이웃한 라인들
                // 현재 포인트에 연결된 다음 포인트들 중 방문하지 않은 point를 heap에 넣어준다.
                for (const lineId of currentPointConnectedLines) {
                    const [nextPointId] = lineData[lineId].points.filter(v => v !== currentPointId);
                    // console.log(heap)
                    // console.log(0, nextPointId)
                    // console.log(0, history)
                    if (!nextPointId || history.has(nextPointId)) {
                        // console.log(nextPointId, JSON.stringify(Array.from(history)))
                        // console.log(1, nextPointId)
                        // console.log(1, history)
                        continue;
                    }
                    // console.log(2, nextPointId)
                    // console.log(2, history)
                    // if(this.per_click){
                    //     console.count('a')
                    // }
                    const polyline = new kakao.maps.Polyline({
                        path: lineData[lineId].linePath
                    })

                    const nowX = this.circle.getPosition().getLat();
                    const nowY = this.circle.getPosition().getLng();
                    const lengthFromStartToFinish = ((nowX - goalx) ** 2 + (nowY - goaly) ** 2) ** 0.5;

                    const roadLength = polyline.getLength();
                    heap.push({
                        data: nextPointId,
                        pre: currentPointId,
                        score: data.d + lengthFromStartToFinish,
                        d: roadLength + data.d
                    });
                    // console.log(history)
                }
                data = heap.pop();
                while (history.has(data.data)) {
                    data = heap.pop()
                }
                history.set(data.data, data);
                // heap에 있는 후보중 가장 괜찮은 애를 뽑아온다.
                // console.log(2, nextPointId)
                // console.log(2, history)
                // 현재 포인트에서 다시 위 과정 반복
            }
            // 도착까지 경로 다 찾음.

            // history에서 도착 포인트를 가져온다.
            // for(let [k, v] of Array.from(history)){
            //     console.log(k, v);
            // }
            let goalPoint = history.get(goal);
            // console.log(goalPoint)
            // const total = goalPoint.score;
            const list: number[] = [];
            while (goalPoint.pre !== -1) {
                const prevPointId = goalPoint.pre;
                // console.log(prevPointId)
                list.push(goalPoint.data);
                goalPoint = history.get(prevPointId);
                // console.log(goalPoint)
            }
            list.push(r);
            list.reverse();
            return [list, history];
        }
        let a = findWay({ data: r, score: 0, pre: -1, d: 0 }, arrivePoint)
        // console.log(a[0])
        return a;
    };
}