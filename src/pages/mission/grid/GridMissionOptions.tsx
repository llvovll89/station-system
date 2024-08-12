import styled from "styled-components";
import { AreaOptions } from "../../../constant/type";
import theme from "../../../styles/theme";
import { Button } from "../../../components/button/Button";
import { MissionDto } from "../../../dto/MissionDto";

const GridMissionOptionsWrap = styled.section`
    min-width: 400px;
    padding: 1rem;
    position: absolute;
    top: 4px;
    left: 500px;
    background-color: ${(props) => props.theme.color.subBlack};
    color: ${(props) => props.theme.color.white};
    border-radius: 5px;
    box-shadow: 2px 5px 8px rgba(0, 0, 0, 0.33);
    display: flex;
    flex-direction: column;
    gap: 1rem;

    .content {
        display: flex;
        flex-direction: column;
        gap: 0.5rem;

        & div {
            width: 100%;
            display: flex;
            gap: 0.5rem;
            align-items: center;

            & label {
                width: 70%;
            }

            & input {
                border-radius: 5px;
                width: 100%;
                height: 32px;
                border: 1px solid ${theme.color.subWhite};
                padding: 0 0.75rem;
                color: ${theme.color.white};
                transition: all 0.15s ease-in-out;

                &:focus {
                    border: 1px solid ${theme.color.primary};
                    color: ${theme.color.primary};
                }
            }
        }
    }

    & .btns {
        display: flex;
        gap: 4px;
        flex-direction: column;

        & .top {
            display: flex;
            align-items: center;
            gap: 4px;
        }

        & button {
            width: 100%;    
            background-color: ${theme.color.primary};
            border-radius: 5px;
        }
    }
`;

interface GridMissionOptionsProps {
    areaOptions: AreaOptions;
    setAreaOptions: React.Dispatch<React.SetStateAction<AreaOptions>>;
    submitGridMission: () => void;
    missionData: MissionDto;
    setMissionData: React.Dispatch<React.SetStateAction<MissionDto>>;
    initMissionData: () => void;
    resetGridMission: () => void;
    endMission: () => void;
}

export const GridMissionOptions = ({
    areaOptions,
    endMission,
    setAreaOptions,
    submitGridMission,
    missionData,
    setMissionData,
    initMissionData,
    resetGridMission,
}: GridMissionOptionsProps) => {
    return (
        <GridMissionOptionsWrap>
            <div className="content">
                <div>
                    <label htmlFor="name">미션명</label>
                    <input
                        type="text"
                        id="name"
                        value={missionData.name}
                        onChange={(e) =>
                            setMissionData((prevData) => ({
                                ...prevData,
                                name: e.target.value,
                            }))
                        }
                    />
                </div>
                <div>
                    <label htmlFor="angle">앵글 ({areaOptions.angle})</label>
                    <input
                        type="range"
                        id="angle"
                        value={areaOptions.angle}
                        onChange={(e) =>
                            setAreaOptions((prevData) => ({
                                ...prevData,
                                angle: Number(e.target.value),
                            }))
                        }
                        min={"0"}
                        max={"360"}
                    />
                </div>
                <div>
                    <label htmlFor="longitudinalRedundancy">
                        종중복도 ({areaOptions.longitudinalRedundancy}) %
                    </label>
                    <input
                        value={areaOptions.longitudinalRedundancy}
                        onChange={(e) =>
                            setAreaOptions((prevData) => ({
                                ...prevData,
                                longitudinalRedundancy: Number(e.target.value),
                            }))
                        }
                        type="range"
                        min={"10"}
                        max={"90"}
                        id="longitudinalRedundancy"
                    />
                </div>
                <div>
                    <label htmlFor="transverseRedundancy">
                        횡 중복도 ({areaOptions.transverseRedundancy}) %
                    </label>
                    <input
                        value={areaOptions.transverseRedundancy}
                        onChange={(e) =>
                            setAreaOptions((prevData) => ({
                                ...prevData,
                                transverseRedundancy: Number(e.target.value),
                            }))
                        }
                        type="range"
                        min={"10"}
                        max={"90"}
                        id="transverseRedundancy"
                    />
                </div>
                <div>
                    <label htmlFor="altitude">
                        고도 ({areaOptions.droneAltitude}) m
                    </label>
                    <input
                        value={areaOptions.droneAltitude}
                        onChange={(e) =>
                            setAreaOptions({
                                ...areaOptions,
                                droneAltitude: Number(e.target.value),
                            })
                        }
                        min={"50"}
                        max={"500"}
                        type="range"
                        id="altitude"
                    />
                </div>
            </div>
            <div className="btns">
                <div className="top">
                    <Button
                        type="button"
                        onClick={() => {
                            initMissionData();
                            resetGridMission();
                        }}
                        className="reset_btn"
                    >
                        <span>초기화</span>
                    </Button>

                    <Button
                        className="submit"
                        onClick={submitGridMission}
                        type="button"
                    >
                        <span>저장하기</span>
                    </Button>
                </div>
                <Button className="end_btn" onClick={endMission} type="button">
                    생성종료
                </Button>
            </div>
        </GridMissionOptionsWrap>
    );
};
