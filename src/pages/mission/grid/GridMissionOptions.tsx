import styled from 'styled-components'
import { AreaOptions } from '../../../constant/type'
import theme from '../../../styles/theme'
import { Button } from '../../../components/button/Button'
import { MissionDto } from '../../../dto/MissionDto'
// import { useEffect } from 'react'

const GridMissionOptionsWrap = styled.section`
    min-width: 400px;
    padding: 1rem;
    position: absolute;
    top: 16px;
    left: 460px;
    transform: translateX(-460xp);
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
        justify-content: space-between;
        gap: 0.35rem;

        & .submit,
        & .reset_btn {
            background-color: ${theme.color.primary};
            border-radius: 5px;
        }
    }
`

interface GridMissionOptionsProps {
    areaOptions: AreaOptions
    setAreaOptions: React.Dispatch<React.SetStateAction<AreaOptions>>
    submitGridMission: () => void
    missionData: MissionDto
    setMissionData: React.Dispatch<React.SetStateAction<MissionDto>>
    resetGridMission: () => void
    // createWays: () => void
}

export const GridMissionOptions = ({
    areaOptions,
    setAreaOptions,
    submitGridMission,
    missionData,
    setMissionData,
    resetGridMission,
    // createWays,
}: GridMissionOptionsProps) => {
    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = event.target
        setAreaOptions((prev) => ({ ...prev, [name]: Number(value) }))
    }

    // useEffect(() => {
    //     createWays()
    // }, [areaOptions])

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
                            setMissionData({
                                ...missionData,
                                name: e.target.value,
                            })
                        }
                    />
                </div>
                <div>
                    <label htmlFor="angle">앵글 ({areaOptions.angle})</label>
                    <input
                        type="range"
                        id="angle"
                        value={areaOptions.angle}
                        onChange={handleChange}
                        min={'0'}
                        max={'360'}
                    />
                </div>
                <div>
                    <label htmlFor="longitudinalRedundancy">
                        종중복도 ({areaOptions.longitudinalRedundancy}) %
                    </label>
                    <input
                        value={areaOptions.longitudinalRedundancy}
                        onChange={handleChange}
                        type="range"
                        min={'10'}
                        max={'90'}
                        id="longitudinalRedundancy"
                    />
                </div>
                <div>
                    <label htmlFor="transverseRedundancy">
                        횡 중복도 ({areaOptions.transverseRedundancy}) %
                    </label>
                    <input
                        value={areaOptions.transverseRedundancy}
                        onChange={handleChange}
                        type="range"
                        min={'10'}
                        max={'90'}
                        id="transverseRedundancy"
                    />
                </div>
                <div>
                    <label htmlFor="altitude">
                        고도 ({areaOptions.droneAltitude}) m
                    </label>
                    <input
                        value={areaOptions.droneAltitude}
                        onChange={handleChange}
                        min={'50'}
                        max={'1000'}
                        type="range"
                        id="altitude"
                    />
                </div>
            </div>
            <div className="btns">
                <Button
                    type="button"
                    onClick={resetGridMission}
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
        </GridMissionOptionsWrap>
    )
}
