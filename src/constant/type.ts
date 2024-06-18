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
    droneAngle: number
    horizontalRedundancy: number
    verticalRedundancy: number
    photoWidthRatio: number
    photoHeightRatio: number
}

export interface OverlayType {
    startMarker?: naver.maps.Marker | null
    endMarker?: naver.maps.Marker | null
    takeoffPolyLine?: naver.maps.Polyline | null
    wayLine?: naver.maps.Polyline
    polygon?: naver.maps.Polygon | null
    guideLine?: naver.maps.Polyline | null
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

export interface MissionStateItem {
    mainPoints: naver.maps.LatLng[]
    distance: number
    areaSize: number
}
