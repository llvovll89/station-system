enum StationStatus {
    idle = 0,
    running = 1,
}

export interface StationDto {
    seq: number
    name: string
    latitude: number
    longitude: number
    status: StationStatus
    createdAt: Date
    drone: Drone
}

export interface Drone {
    seq: number
    name: string
    latitude: number
    longitude: number
}
