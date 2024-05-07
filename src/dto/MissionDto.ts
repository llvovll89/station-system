import { Point } from "../constant/Point";

export interface MissionDto {
    seq: number;
    name: string;
    type: number;
    mainPoint: Point | null; // 아직 무슨 타입일지
    createdAt: Date | string;
    updatedAt: Date | string;
    transverseRedundancy?: number;
    longitudinalRedundancy?: number;
    points?: Point[];
    angle?: number;
}