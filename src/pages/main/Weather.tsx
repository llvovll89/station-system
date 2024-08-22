import styled from "styled-components";
import theme from "../../styles/theme";
import { WeatherDto } from "../../constant/type";
const WeatherWrap = styled.section`
    position: absolute;
    bottom: 12px;
    left: 50%;
    transform: translateX(-50%);
    background-color: rgba(31, 30, 37, 0.88);
    box-shadow: 1px 2px 3px rgba(0, 0, 0, 0.22);
    border-radius: 5px;
    padding: 1rem;
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
    color: ${theme.color.white};
    font-size: 14px;
    border-radius: 5px
    z-index: 100;
        

    & .forms {
        display: flex;
        flex-direction: column;
        gap: 0.25rem;

        & .inner {
            display: flex;
            align-items: center;
            justify-content: space-between;
        }

        & span {
            font-size: 12px;
        }
    }

    & .grid_temp {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 0.25rem;  

        & span {
            display: inline-block;
            padding: 0.25rem;
            font-size: 12px;
            border: 1px solid rgba(255,255,255,0.26);
            border-radius: 5px;
        }
    }
`

interface WeatherProps {
    coords: { latitude: number; longitude: number };
    weatherData: WeatherDto;
}

export const Weather = ({ coords, weatherData }: WeatherProps) => {
    return (
        <WeatherWrap>
            <h1>현재 날씨</h1>
            <div className="forms">
                <span>현재 위치</span>

                <div className="inner">
                    <span>위도</span>
                    <span>{coords.longitude}</span>
                </div>

                <div className="inner">
                    <span>경도</span>
                    <span>{coords.latitude}</span>
                </div>
            </div>

            <div className="grid_temp">
                <span>기온: {weatherData.temperature}</span>
                <span>바람속도: {weatherData.windSpeed}</span>
                <span>바람방향: {weatherData.windDirection}</span>
                <span>강수량: {weatherData.rainStatus}</span>
                {/* <span>{weatherData.skyCode}</span> */}
            </div>
        </WeatherWrap>
    )
}