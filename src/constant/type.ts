export enum MissionType {
    wayline = 0,
    region = 1,
}

export enum ActiveType {
    none = 0,
    mission = 1,
    station = 2,
}

export interface AreaOptions {
    droneAltitude: number
    speed: number
    angle: number
    fov: number
    droneAngle: number
    horizontalRedundancy: number
    verticalRedundancy: number
    photoWidthRatio: number
    photoHeightRatio: number
}

export enum StationStatus {
    idle = '대기중',
    active = '실행중',
    error = '에러발생',
}

export interface Point {
    latitude: number
    longitude: number
}
