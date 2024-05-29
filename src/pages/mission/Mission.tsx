import { MissionWrap } from './MissionStyle'
import { Button } from '../../components/button/Button'
import { CreateMissionWrap } from './createmission/CreateMissionStyle'
import { MissionDto } from '../../dto/MissionDto'
import { MissionType } from '../../constant/type'
import { VscGitPullRequestCreate } from 'react-icons/vsc'

interface MissionProps {
    isCreateMission: boolean
    isCreateStart: boolean
    setIsCreateMission: React.Dispatch<React.SetStateAction<boolean>>
    setIsCreateStart: (value: boolean) => void
    setSelectMission: React.Dispatch<React.SetStateAction<string | MissionType>>
    setMissionData: React.Dispatch<React.SetStateAction<MissionDto>>
    missionData: MissionDto
    selectMission: string | MissionType
}

export const Mission = ({
    isCreateMission,
    setSelectMission,
    setMissionData,
    setIsCreateMission,
    setIsCreateStart,
    missionData,
    selectMission,
    isCreateStart,
}: MissionProps) => {
    const toggleCreateMission = () => {
        setSelectMission('')
        setMissionData((prev: MissionDto) => ({
            ...prev,
            name: '',
            type: 0,
        }))
        setIsCreateMission((prev) => !prev)
    }

    const selectMissionType = (type: string) => {
        setSelectMission((prev) => (prev === type ? '' : type))
    }

    const submitCreateMission = () => {
        if (!missionData.name || !selectMission) {
            alert('빈 값 없이 선택해 주시기 바랍니다.')
        } else {
            setIsCreateStart(true)
            setIsCreateMission((prev) => !prev)
        }
    }

    const missionInProgress = () => {
        alert('미션 진행중입니다, 종료 후 실행해 주세요.')
    }

    return (
        <MissionWrap>
            {isCreateMission && (
                <CreateMissionWrap>
                    <article className="container">
                        <header>
                            <h1>미션생성</h1>
                            <Button
                                type="button"
                                text="X"
                                onClick={toggleCreateMission}
                            />
                        </header>

                        <div className="mission_name">
                            <label>미션 이름</label>
                            <input
                                type="text"
                                onChange={(e) =>
                                    setMissionData({
                                        ...missionData,
                                        name: e.target.value,
                                    })
                                }
                                placeholder="mission name..."
                            />
                        </div>

                        <article className="grid">
                            <p>미션 타입</p>

                            <div className="grid">
                                <Button
                                    className={
                                        selectMission === 'wayline'
                                            ? 'wayline'
                                            : ''
                                    }
                                    onClick={() => selectMissionType('wayline')}
                                    type="button"
                                    text="웨이라인"
                                />
                                <Button
                                    className={
                                        selectMission === 'region'
                                            ? 'region'
                                            : ''
                                    }
                                    onClick={() => selectMissionType('region')}
                                    type="button"
                                    text="지역"
                                />
                            </div>
                        </article>

                        <footer>
                            <Button
                                text="닫기"
                                type="button"
                                onClick={toggleCreateMission}
                            />
                            <Button
                                className={
                                    missionData.name && selectMission
                                        ? 'isSubmit'
                                        : ''
                                }
                                text="생성"
                                type="button"
                                onClick={submitCreateMission}
                            />
                        </footer>
                    </article>
                </CreateMissionWrap>
            )}

            {isCreateStart ? (
                <Button
                    className="create_mission isActive"
                    type="button"
                    onClick={missionInProgress}
                >
                    <VscGitPullRequestCreate />
                </Button>
            ) : (
                <Button
                    onClick={toggleCreateMission}
                    type="button"
                    className="create_mission"
                >
                    <VscGitPullRequestCreate />
                </Button>
            )}
        </MissionWrap>
    )
}
