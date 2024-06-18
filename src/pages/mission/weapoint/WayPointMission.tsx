import { useEffect, useState } from 'react'
import { MissionStateItem, OverlayType } from '../../../constant/type'
import styled from 'styled-components'
import { Button } from '../../../components/button/Button'
import { VscActivateBreakpoints } from 'react-icons/vsc'
import theme from '../../../styles/theme'

interface WaypPointMissionProps {
    map: naver.maps.Map
    missionState: MissionStateItem
    setMissionState: React.Dispatch<React.SetStateAction<MissionStateItem>>
}

const WaypointWrap = styled.section`
    position: absolute;
    top: 76px;
    right: 12px;
    z-index: 1;
    width: 52px;
    height: 52px;
    background-color: ${(props) => props.theme.color.subBlack};
    border-radius: 5px;
    boxs-shadow: ${theme.boxShadow?.lg};
`

export const WaypPointMission = ({
    map,
    missionState,
    setMissionState,
}: WaypPointMissionProps) => {
    const [markers, setMarkers] = useState<naver.maps.Marker[]>([])
    const [mainPoints, setMainPoints] = useState<naver.maps.LatLng[]>([])
    const [wayLines, setWayLines] = useState<naver.maps.LatLng[]>([])
    const [overlay, setOverlay] = useState<OverlayType>({
        guideLine: new naver.maps.Polyline({
            map,
            path: [],
            strokeColor: '#ff005e',
            strokeWeight: 4,
            strokeStyle: [4, 4],
            strokeOpacity: 0.7,
        }),
        wayLine: new naver.maps.Polyline({
            map,
            path: [],
            strokeColor: '#0CF395',
            strokeOpacity: 1,
            strokeWeight: 5,
        }),
    })

    const resetData = () => {
        setMarkers((m) => {
            return m.map((marker) => {
                marker.setMap(null)
                return marker
            })
        })

        setMarkers([])
        setMainPoints([])
        setWayLines([])
        setOverlay({
            guideLine: new naver.maps.Polyline({
                map,
                path: [],
                strokeColor: '#ff005e',
                strokeWeight: 4,
                strokeStyle: [4, 4],
                strokeOpacity: 0.7,
            }),
            wayLine: new naver.maps.Polyline({
                map,
                path: [],
                strokeColor: '#0CF395',
                strokeOpacity: 1,
                strokeWeight: 5,
            }),
        })
    }

    const createWayPointMission = () => {
        const markerArr: naver.maps.Marker[] = [],
            mainPointsArr: naver.maps.LatLng[] = []
        const setWayPoint = naver.maps.Event.addListener(
            map,
            'click',
            (e: { coord: naver.maps.LatLng }) => {
                const path =
                    overlay.wayLine?.getPath() as naver.maps.ArrayOfCoords
                path.push(e.coord)
                setMainPoints((prev) => [...prev, e.coord])
                setWayLines((prev) => [...prev, e.coord])
                mainPoints.push(e.coord)

                setMissionState((prev) => ({
                    ...prev,
                    mainPoints: [...missionState.mainPoints, ...mainPointsArr],
                }))
                const wayPointPolyline: naver.maps.Polyline = overlay.wayLine

                const marker = new naver.maps.Marker({
                    map,
                    position: e.coord,
                    draggable: true,
                    icon: {
                        content: `<div class='wayline_marker'>${mainPoints.length}</div>`,
                        anchor: new naver.maps.Point(12, 12),
                    },
                })

                markerArr.push(marker)
                setMarkers((prev) => [...prev, marker])
                dragResize(markerArr, marker)

                const endWayPointMission = naver.maps.Event.addListener(
                    markerArr[markerArr.length - 1],
                    'click',
                    () => {
                        if (mainPoints.length > 0) {
                            overlay.guideLine?.setMap(null)
                            setMissionState((prev) => ({
                                ...prev,
                                distance: wayPointPolyline.getDistance(),
                            }))

                            // naver.maps.Event.removeListener(mouseDragEvent)
                            naver.maps.Event.removeListener(endWayPointMission)
                            naver.maps.Event.removeListener(setWayPoint)
                        }
                    }
                )
            }
        )
    }

    const dragResize = (
        markersArr: naver.maps.Marker[],
        marker: naver.maps.Marker
    ) => {
        const resizeEvent = naver.maps.Event.addListener(
            marker,
            'drag',
            (e: { coord: naver.maps.LatLng }) => {
                const index = markersArr.indexOf(marker)
                if (index !== -1) {
                    mainPoints[index] = e.coord
                    overlay.wayLine?.setPath(mainPoints)
                }
            }
        )
    }

    useEffect(() => {
        resetData()
    }, [])

    return (
        <WaypointWrap>
            <Button onClick={createWayPointMission} type="button">
                <VscActivateBreakpoints />
            </Button>
        </WaypointWrap>
    )
}
