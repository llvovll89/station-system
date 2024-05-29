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
    altitude: number
    speed: number
    angle: number
    fov: number
    droneAngle: number
    overlapX: number
    overlapY: number
}
