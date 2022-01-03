export interface People {
    position: {
        x: number,
        y: number
    }
    circle: kakao.maps.Circle,
    color: string,
    infection: boolean,
    die: boolean,
    deathRate: number,
    infectionRate: number,
    locNum: number,
    per_click: boolean,
    per_arrive: boolean,
    lineNum: number;
    nexNum: number;
    mask: boolean;
    goToHospital_: boolean;
    hvToGoHospital: boolean;
    nearestHospital: {
        distance:number,
        entrance:number,
        hospitalNumber:number
    }[]
}

export interface AreaType {
    
}

export interface numP {
    wholePer: number,
    Infectious: number,
    Recovered: number,
    deadPer: number
}