import { useState } from 'react'
import { OverlayType } from '../../../../constant/type'
import styled from 'styled-components'
import { Button } from '../../../../components/button/Button'
import { VscActivateBreakpoints } from 'react-icons/vsc'
import { TbAtom } from 'react-icons/tb'
import theme from '../../../../styles/theme'

interface GridMissionProps {
    map: naver.maps.Map
    missionData: MissionDto
}

const GridMissionWrap = styled.section`
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 1;
    width: 52px;
    height: 52px;
    background-color: ${(props) => props.theme.color.subBlack};
    border-radius: 5px;
    boxs-shadow: ${theme.boxShadow?.lg};
`

export const GridMission = ({ map }: GridMissionProps) => {
    const [markers, setMarkers] = useState<naver.maps.Marker[]>([])
    const [wayLines, setWayLines] = useState<naver.maps.LatLng[]>([])
    const [mainPoints, setMainPoints] = useState<naver.maps.LatLng[]>([])
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
        polygon: new naver.maps.Polygon({
            map,
            paths: [],
            strokeColor: '#0CF395',
            strokeOpacity: 1,
            strokeWeight: 5,
            fillColor: '#0CF395',
        }),
    })

    const createGridMission = () => {
        if (map) {
            const setGridMission = naver.maps.Event.addListener(
                map,
                'click',
                (e: { coord: naver.maps.LatLng }) => {
                    const mainPoints = []
                    mainPoints.push(e.coord)
                    setMainPoints((prev) => [...prev, e.coord])

                    const marker = new naver.maps.Marker({
                        map,
                        position: e.coord,
                        draggable: true,
                        icon: {
                            content: `<div className='marker'></div>`,
                            anchor: new naver.maps.Point(12, 18.5),
                        },
                    })
                    setMarkers((prev) => [...prev, marker])
                    polygonResize(marker)

                    const endPolygon = naver.maps.Event.addListener(
                        markers[markers.length - 1],
                        'click',
                        () => {
                            console.log('end')
                            naver.maps.Event.removeListener(setGridMission)
                        }
                    )
                }
            )
        }
    }

    const polygonResize = (marker: naver.maps.Marker) => {
        const resize = naver.maps.Event.addListener(
            marker,
            'drag',
            (e: { coord: naver.maps.LatLng }) => {
                console.log(e)
            }
        )
    }

    return (
        <GridMissionWrap>
            <Button
                type="button"
                className="create_grid_mission"
                onClick={() => alert('수정중...')}
            >
                <TbAtom />
            </Button>
        </GridMissionWrap>
    )
}
