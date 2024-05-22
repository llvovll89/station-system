import styled from "styled-components"
import theme from "../../../styles/theme"
import { Button } from "../../../components/button/Button"
import { IoClose } from "react-icons/io5"
import { useEffect } from "react"
import axios from "axios"
import { MISSION } from "../../../constant/http"

const MissionListWrap = styled.section`
    width: 300px;
    height: 100vh;
    position: absolute;
    left: 65px;
    top: 0;
    background-color: ${theme.color.black};

    & header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        color: ${theme.color.white};
        border-bottom: 1px solid rgba(255, 255, 255, 0.33);

        h1 {
            padding-left: 12px;
        }

        button {
            width: 52px;
        }
    }
`

interface MissionListProps {
    toggleMission: () => void;
}

export const MissionList = ({ toggleMission }: MissionListProps) => {
    const getMission = async () => {

        try {
            const response = await axios.get(MISSION);
            const data = await response.data;

            console.log(data);
        } catch (err) {
            console.log(err);
        }
    }

    useEffect(() => {
        getMission();
    }, []);

    return (
        <MissionListWrap>
            <header>
                <h1>미션 리스트</h1>

                <Button type={"button"} onClick={toggleMission}>
                    <IoClose />
                </Button>
            </header>
        </MissionListWrap>
    )
}