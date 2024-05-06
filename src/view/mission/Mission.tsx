import { MutableRefObject, useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MissionWrap } from "./MissionStyle";
import { KaKaoMap } from "../../components/Maps";
import { Button } from "../../components/Button";

declare global {
    interface Window {
        kakao: any;
    }
}

const mapStyle = {
    width: '100vw',
    height: '100vh'
};


interface pointState {
    title: string;
    latlng: kakao.maps.LatLng;
}


export const Mission = () => {
    const navigate = useNavigate();
    const [userLocalData, setUserLocalData] = useState<string>("");
    const [points, setPoints] = useState<pointState[]>([]);
    const [markers, setMarkers] = useState<kakao.maps.Marker[]>([]);
    const [maps, setMaps] = useState<null>(null);

    const mapRef = useRef<HTMLElement | null>(null);

    const initMap = () => {
        const container = document.getElementById("map");
        const options = {
            center: new window.kakao.maps.LatLng(37.483034, 126.902435),
            level: 2,
        };

        const map = new window.kakao.maps.Map(container as HTMLElement, options);
        (mapRef as MutableRefObject<any>).current = map;
        setMaps(map);
    };

    const setMarker = (title, lat, lng) => {
        return {
            title: title,
            latlng: new kakao.maps.LatLng(lat, lng),
        };
    }

    const getMission = () => {
        const center = new window.kakao.maps.LatLng(37.483034, 126.902435);
        const length = 0.01;
        const halfLength = length / 2;
        
        const newPoints = [
            ...points,
            setMarker('first', center.getLat() + halfLength, center.getLng() - halfLength),
            setMarker('second', center.getLat() + halfLength, center.getLng() - halfLength),
            setMarker('three', center.getLat() + halfLength, center.getLng() - halfLength),
            setMarker('three', center.getLat() + halfLength, center.getLng() - halfLength)
        ];

        setPoints(newPoints);
        
        points.forEach(point => {
            const marker = new window.kakao.maps.Marker({
                position: point.latlng,
            });

            marker.setMap(maps)
        });
    };

      function createPointsInsidePolygon(polygonCoords) {
        const points = [];
    
        // 다각형 내부 좌표 생성
        for (let i = 0; i < polygonCoords.length; i++) {
            for (let j = 0; j < overlapFactor; j++) {
                for (let k = 0; k < overlapFactor; k++) {
                    const lat = polygonCoords[i].getLat() + (polygonCoords[(i + 1) % polygonCoords.length].getLat() - polygonCoords[i].getLat()) * (j + 1) / (overlapFactor + 1);
                    const lng = polygonCoords[i].getLng() + (polygonCoords[(i + 3) % polygonCoords.length].getLng() - polygonCoords[i].getLng()) * (k + 1) / (overlapFactor + 1);
    
                    points.push(new kakao.maps.LatLng(lat, lng));
                }
            }
        }
    
        return points;
    }

    const getPolygon = () => {
        // 아래 coords 영역의 위 / 경도값은 랜덤으로
        const polygonCoords = [
            new kakao.maps.LatLng(37.483034, 126.902435),
            new kakao.maps.LatLng(37.483034, 126.902635),
            new kakao.maps.LatLng(37.483234, 126.902635),
            new kakao.maps.LatLng(37.483234, 126.902435)
        ];

        const polygonOptions = {
            path: polygonCoords, // 다각형을 구성하는 좌표 배열
            strokeWeight: 2, // 선 두께 설정
            strokeColor: '#555', // 선 색상 설정
            strokeOpacity: 0.8, // 선 투명도 설정
            fillColor: '#888', // 채우기 색상 설정
            fillOpacity: 0.5 // 채우기 투명도 설정
        };

        const polygon = new kakao.maps.Polygon(polygonOptions);
        polygon.setMap(maps);

        // 폴리곤 내부에 점 생성
        const points = createPointsInsidePolygon(polygonCoords);
        points.forEach(point => {
            const marker = new kakao.maps.Marker({
                position: point
            });
            marker.setMap(maps);
        });
    }   
    
    const startPaintMarkers = () => {
        if(maps) {
            kakao.maps.event.addListener(maps, 'click', function(e) {            
                const marker = new kakao.maps.Marker({
                    position: new kakao.maps.LatLng(e.latLng.Ma, e.latLng.La),
                })

                marker.setMap(maps);
            });
        }
    }


    useEffect(() => {
        if(localStorage.getItem("id")) {
            setUserLocalData(JSON.stringify(localStorage.getItem("id")));
        } else {
            navigate('/');
        }
    }, [navigate, userLocalData]);

    useEffect(() => {
        window.kakao.maps.load(() => initMap());
    }, [mapRef]);   

    return (
        <MissionWrap>
            <header>
              <h1>미션 페이지</h1>
              
              <div>
                <Button onClick={getMission} type="button" className="import_mission" text="랜덤미션"></Button>
                <Button onClick={getPolygon} type="button" className="import_mission" text="다각형그리기"></Button>
                <Button onClick={startPaintMarkers} type="button" className="import_mission" text="마커생성"></Button>
              </div>
            </header>

            <div id="map" style={mapStyle}></div>
        </MissionWrap>
    )
};