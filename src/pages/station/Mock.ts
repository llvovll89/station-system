import { StationStatus } from '../../constant/type'
import { MissionDto } from '../../dto/MissionDto'
import { Station } from '../../dto/Station'

export const mockStation: Station[] = [
    {
        seq: 0,
        name: 'igis',
        position: {
            latitude: 35.87772056157816,
            longitude: 128.6110784825801,
        },
        dockSn: 123456,
        droneSn: 112234,
        description: 'igis station 입니다.',
        status: StationStatus.active,
    },
    {
        seq: 1,
        name: 'kht',
        position: {
            latitude: 37.87772056157816,
            longitude: 127.6110784825801,
        },
        dockSn: 2345643,
        droneSn: 332234,
        description: 'KHT의 station 입니다.',
        status: StationStatus.idle,
    },
    {
        seq: 2,
        name: 'kgh',
        position: {
            latitude: 34.87772056157816,
            longitude: 129.6110784825801,
        },
        dockSn: 554612,
        droneSn: 887944,
        description: 'KGH의 station 입니다.',
        status: StationStatus.error,
    },
]

export const mockMission: MissionDto[] = [
    {
        seq: 1,
        name: '첫번째 미션 입니다.',
        type: 0, // waypoint mission
        createdAt: new Date(),
        updatedAt: new Date(),
        transverseRedundancy: 0,
        longitudinalRedundancy: 0,
        points: [],
        angle: 70,
        mainPoint: {
            latitude: 0,
            longitude: 0,
        },
    },
    {
        seq: 2,
        name: '두번째 미션 입니다.',
        type: 1, // region mission
        createdAt: new Date(),
        updatedAt: new Date(),
        transverseRedundancy: 0,
        longitudinalRedundancy: 0,
        points: [],
        angle: 70,
        mainPoint: {
            latitude: 0,
            longitude: 0,
        },
    },
]
