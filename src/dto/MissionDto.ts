export interface MissionDto {
    seq?: number;
    name: string;
    type: number | string;
    mainPoint: { latitude: number; longitude: number; }; // 아직 무슨 타입일지
    createdAt?: Date | string;
    updatedAt?: Date | string;
    transverseRedundancy?: number;
    longitudinalRedundancy?: number;
    points?: { latitude: number; longitude: number; }[];
    angle?: number;
}