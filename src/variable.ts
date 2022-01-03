import { Area } from './Area';
import { Person } from './person'

export let moveOpts = {
    check: false,
    d: null
}

export let peoples: Person[] = [];
export let areas: Area[] = [];

export let variable = {
    movingStart: true,
    panto: false,
    speedValue1: 200,
    set1: null,
    speedValue2: 700,
    set2: null,
    velRange: 0.00001
}

export let menuBtn_click = {
    main: false,
    bar: false,
    line: false,
    save: false
}

export let time_DHS = {
    date: 0,
    hour: 0,
    min: 0
}

export let arriveClick: {
    location: kakao.maps.LatLng
} = {
    location: null
};