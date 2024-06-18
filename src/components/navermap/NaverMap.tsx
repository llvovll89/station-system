import { useEffect, useRef, useState } from 'react'
import useGeoLocation from '../../hooks/useGeoLocation'
import { WaypPointMission } from '../../pages/mission/weapoint/WayPointMission'
import styled from 'styled-components'
import { GridMission } from '../../pages/mission/list/grid/GridMission'
import { MissionDto } from '../../dto/MissionDto'
import { CreateMission } from '../../pages/mission/createmission/CreateMission'
import { Button } from '../button/Button'
import { VscActivateBreakpoints } from 'react-icons/vsc'
import theme from '../../styles/theme'
import { MissionStateItem } from '../../constant/type'

const MapWrap = styled.section`
    position: relative;
    width: 100vw;
    min-height: 100vh;

    & #map {
        width: 100vw;
        height: 100vh;
    }

    & .distance {
        position: absolute;
        left: 50%;
        transform: translateX(-50%);
        top: 12px;
        color: ${theme.color.subWhite};
        background-color: ${theme.color.black};
        padding: 0.5rem 1rem;
    }

    .create_mission_btn {
        position: absolute;
        top: 12px;
        right: 12px;
        z-index: 1;
        width: 52px;
        height: 52px;
        background-color: ${(props) => props.theme.color.subBlack};
    }

    & .wayline_marker {
        width: 24px;
        height: 24px;
        display: flex;
        align-items: center;
        justify-content: center;
        color: ${theme.color.white};
        background-color: ${theme.color.primary};
        border-radius: 5px;
        border: 1px solid ${theme.color.subWhite};
    }
`

export const Map = () => {
    const [map, setMap] = useState<naver.maps.Map | null>(null)
    const [mapType, setMapType] = useState<naver.maps.MapTypeId>(
        naver.maps.MapTypeId.NORMAL
    )
    const [missionState, setMissionState] = useState<MissionStateItem>({
        mainPoints: [],
        distance: 0,
        areaSize: 0,
    })

    const [missionData, setMissionData] = useState<MissionDto>({
        seq: 0,
        name: '',
        type: 0,
        mainPoint: { latitude: 0, longitude: 0 },
        transverseRedundancy: 0,
        longitudinalRedundancy: 0,
        points: [],
        angle: 70,
        createdAt: '',
        updatedAt: '',
    })

    const { lat, lng } = useGeoLocation().coordinates
    const mapElement = useRef(null)
    const currentPosition = new naver.maps.LatLng(lat, lng)

    const mapTypeChange = (mapType: naver.maps.MapTypeId) => {
        setMapType(mapType)
        map?.setMapTypeId(mapType)
    }

    const resetMap = () => {
        map?.refresh(false)
    }

    const props = () => ({
        map,
        missionState,
        setMissionState,
    })

    useEffect(() => {
        if (!mapElement.current || !naver) return

        const location = new naver.maps.LatLng(35.8774, 128.6107)
        const mapOptions = {
            center: location,
            zoom: 17,
            zoomControl: false,
            mapDataControl: false,
            scaleControl: false,
        }

        setMap(new naver.maps.Map(mapElement.current, mapOptions))
    }, [mapType])

    return (
        <MapWrap>
            <div id="map" className="map" ref={mapElement}></div>
            {missionState.distance > 0 && (
                <div className="distance">{missionState.distance}</div>
            )}
            {/* <Button
                onClick={setCreateMission}
                type="button"
                className="create_mission_btn"
            >
                <VscActivateBreakpoints />
            </Button> */}

            {/* <CreateMission />  */}

            {map && (
                <>
                    <WaypPointMission
                        map={map}
                        missionState={missionState}
                        setMissionState={setMissionState}
                    />
                    <GridMission
                        map={map}
                        missionState={missionState}
                        setMissionState={setMissionState}
                    />
                </>
            )}
        </MapWrap>
    )
}
