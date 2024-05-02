import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MissionWrap } from "./MissionStyle";

export const Mission = () => {
    const navigate = useNavigate();
    const [userLocalData, setUserLocalData] = useState<string>("");
    const [kakaoMap, setKaKaoMap] = useState<null>(null);
    const mapContainer = useRef<HTMLDivElement>(null);
 
    useEffect(() => {
        if(localStorage.getItem("id")) {
            setUserLocalData(JSON.stringify(localStorage.getItem("id")));
        } else {
            navigate('/');
        }
    }, [navigate, userLocalData]);

    // const script = document.createElement("script");
    // script.async = true;
    // script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false`;
    // document.head.appendChild(script);

    // script.onload = () => {
    //     if(window.kakao && window.kakao.maps) { 
    //         window.kakao.maps.load(() => {
    //             const mapOptions = {
    //                 center: new window.kakao.maps.LatLng(37.5665, 126.9780), 
    //                 level: 5
    //             };

    //             const map = new window.kakao.maps.Map(mapContainer.current, mapOptions);
    //             setKaKaoMap(map);
    //         })
    //     }
    // }

useEffect(() => {
    let script = document.querySelector(`script[src="${src}"]`);
    // if(!script) {
    //     script = document.createElement("script"); //script태그를 추가해준다.
    //     script.async = true; //다운로드 완료 즉시 실행
    //     script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${import.meta.env.VITE_KAKAO_API_KEY}&autoload=false`; //script의 실행 src
    //    document.head.appendChild(script)
    // }


    // return () => {
    //     document.head.removeChild(script);
    // };
}, []);

    return (
        <MissionWrap>
            <h1>미션 페이지</h1>

            <div id="map" ref={mapContainer} style={{width: "500px", height: "500px"}}></div>
        </MissionWrap>
    )
};