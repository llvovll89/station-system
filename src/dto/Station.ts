import { StationStatus } from '../constant/type'

export interface Station {
    seq: number
    name: string
    dockSn: number
    droneSn: number
    position: {
        latitude: number
        longitude: number
    }
    description: string
    status?: StationStatus
}
