import { Point } from '../constant/type'

export interface MissionDto {
    seq?: number
    name: string
    type: number | string
    mainPoint: Point[] // 아직 무슨 타입일지
    createdAt?: Date | string
    updatedAt?: Date | string
    transverseRedundancy?: number
    longitudinalRedundancy?: number
    points?: { latitude: number; longitude: number }[]
    angle?: number
    ways: Point[]
}
