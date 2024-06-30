import { StationDto } from './Station'

enum Status {
    idle = 0,
    running = 1,
}

export interface SchduleDto {
    seq: number
    name: string
    status: Status
    startedAt: string
    completedAt: string
    station: StationDto
}
