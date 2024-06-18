enum StationStatus {
    idle = 0,
    running = 1,
}

export interface Station {
    seq: number
    name: string
    latitude: number
    longitude: number
    status: StationStatus
    createdAt: Date
}

export interface Drone {
    seq: number
    name: string
    latitude: number
    longitude: number
}
