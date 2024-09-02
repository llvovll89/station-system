import { StationDto } from "../dto/Station";

export enum MissionType {
    wayline = 0,
    region = 1,
}

export enum ActiveType {
    none = 0,
    mission = 1,
    station = 2,
    schedule = 3,
}

export interface MissionOverlay {
    polygon: naver.maps.Polygon | null;
    polyline: naver.maps.Polyline | null;
}

export interface AreaOptions {
    droneAltitude: number;
    speed: number;
    angle: number;
    droneAngle: number;
    longitudinalRedundancy: number;
    transverseRedundancy: number;
    photoWidthRatio: number;
    photoHeightRatio: number;
}

export interface OverlayType {
    startMarker?: naver.maps.Marker | null;
    endMarker?: naver.maps.Marker | null;
    takeoffPolyLine?: naver.maps.Polyline | null;
    wayLine?: naver.maps.Polyline;
    polygon?: naver.maps.Polygon | null;
    guideLine?: naver.maps.Polyline | null;
}

export enum StationStatus {
    idle = "대기중",
    active = "실행중",
    error = "에러발생",
}

export interface Point {
    latitude: number;
    longitude: number;
    height: number;
}

export interface MissionStateItem {
    mainPoints: naver.maps.LatLng[];
    distance: number;
    areaSize: number;
}

export interface CreateStation {
    name: string;
    latitude: string;
    longitude: string;
    drone: {
        name: string;
        latitude: string;
        longitude: string;
    };
}

export interface DarkModeContextType {
    isDarkMode: boolean;
    toggleDarkMode: () => void;
}

export interface NaverMapContextType {
    map: naver.maps.Map | null;
    setMap: any;
}

export interface Schedule {
    completedAt: string;
    name: string;
    seq: number;
    startedAt: string;
    status: number;
    station: StationDto;
}

export interface WeatherDto {
    temperature: number;
    windSpeed: number;
    windDirection: number;
    humidity: number;
    skyCode: number;
    rainStatus: string;
}