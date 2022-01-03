import { AreaType } from './types'
import { areaData } from './main';
import { areas, arriveClick, peoples } from './variable';
import { NumOfPeople } from './constants';
import { Person } from './person';
export class Area implements AreaType {
    rectangle: kakao.maps.Rectangle;
    // customOverlay: kakao.maps.CustomOverlay;
    checkingPeople;
    static count = 0;
    static flag = false;
    static all:Area[] = [];
    containPeople = 0;
    static boundNumber_: number;
    infecRate: number;
    constructor(map: kakao.maps.Map, boundNumber: number){
        const rectangelBounds = new kakao.maps.LatLngBounds(areaData[boundNumber].path[0], areaData[boundNumber].path[1]);

        this.rectangle = new kakao.maps.Rectangle({
            bounds: rectangelBounds, // 그려질 사각형의 영역정보입니다
            strokeWeight: 1, // 선의 두께입니다
            strokeColor: '#FF3DE5', // 선의 색깔입니다
            strokeOpacity: 0, // 선의 불투명도 입니다 1에서 0 사이의 값이며 0에 가까울수록 투명합니다
            strokeStyle: 'shortdashdot', // 선의 스타일입니다
            fillColor: 'white', // 채우기 색깔입니다
            fillOpacity: 0 // 채우기 불투명도 입니다
        });

        const customOverlay = new kakao.maps.CustomOverlay({
            position: new kakao.maps.LatLng(0, 0),
            content: String(this.containPeople)
        });

        kakao.maps.event.addListener(this.rectangle, 'mouseover', function (mouseEvent) {
            customOverlay.setContent(`<div class="area-2">${Area.all[boundNumber].containPeople}</div>`);
            customOverlay.setPosition(mouseEvent.latLng);
            customOverlay.setMap(map);
        });
        kakao.maps.event.addListener(this.rectangle, 'mouseout', function () {
            customOverlay.setMap(null);
        });
        kakao.maps.event.addListener(this.rectangle, 'mousemove', function (mouseEvent) {
            customOverlay.setPosition(mouseEvent.latLng);
        });
        kakao.maps.event.addListener(this.rectangle, 'click', function () {
            customOverlay.setContent(`<div class="area">${Area.all[boundNumber].containPeople}</div>`);
        })

        this.rectangle.setMap(map)
        this.checkingPeople = undefined;
        Area.all.push(this);
        Area.boundNumber_ = boundNumber;
    }

    static disappearance(){
        this.flag = false;
        for(let i of this.all){
            i.rectangle.setOptions({ fillOpacity: 0, strokeOpacity: 0 })
            // Area.checkInfecPeople();
        }
    }

    static appearance(){
        this.flag = true;
        for(let i of this.all){
            i.rectangle.setOptions({ fillOpacity: 0.2, strokeOpacity: 0.5 })
        }
    }
    
    static render(){
        if(this.flag){
            if(this.count < 300){
                this.count ++;
            } else{
                this.count = 0;
                for(let i of this.all){
                    i.containPeople = 0;
                    i.rectangle.setOptions({ fillColor: 'white'})
                }
                for(let i of peoples){
                    if(i.infection){
                        i.discrimination();
                    }
                }
                for(let i = 0; i < this.all.length; i++){
                    if(this.all[i].containPeople > 0){
                        this.checkInfecPeople(i)
                    }
                }
            }
        }
        requestAnimationFrame(this.render.bind(this))
    }

    static checkInfecPeople(result?:number){
        const temporaryRate = NumOfPeople.wholePer / 60;
        const infecRate = this.all[result].containPeople / temporaryRate * 100;
        if (infecRate > 80) {
            this.all[result].rectangle.setOptions({ fillColor: 'red' })
        } else if (infecRate > 60) {
            this.all[result].rectangle.setOptions({ fillColor: '#ff3b3b' })
        } else if (infecRate > 40) {
            this.all[result].rectangle.setOptions({ fillColor: '#ff5f5f' })
        } else if (infecRate > 20) {
            this.all[result].rectangle.setOptions({ fillColor: '#ff8a8a' })
        } else if(infecRate > 0){
            this.all[result].rectangle.setOptions({ fillColor: '#FF8AEF' })
        }
    }
}