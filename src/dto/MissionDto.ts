import { Point } from '../constant/type'

export interface MissionDto {
    seq?: number
    name: string
    type: number | string
    mainPoint: Point // 아직 무슨 타입일지
    createdAt?: string
    updatedAt?: string
    transverseRedundancy?: number
    longitudinalRedundancy?: number
    points: Point[]
    angle?: number
    ways: Point[]
}

// export interface CreateMissionDto {

// }
