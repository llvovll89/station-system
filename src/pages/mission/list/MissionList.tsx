import styled from 'styled-components'
import theme from '../../../styles/theme'
import { Button } from '../../../components/button/Button'
import { IoClose } from 'react-icons/io5'
import { useEffect } from 'react'
import axios from 'axios'
import { MISSION } from '../../../constant/http'
import { mockMission } from '../../station/Mock'
import { CiEdit } from 'react-icons/ci'
import { MdOutlineDelete } from 'react-icons/md'

const MissionListWrap = styled.section`
    width: 325px;
    height: 100vh;
    position: absolute;
    left: 64px;
    top: 0;
    background-color: ${theme.color.subBlack};

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

    & .container {
        padding: 0.5rem;

        & .content {
            display: flex;
            flex-direction: column;
            gap: 0.8rem;

            & .mission {
                background-color: ${theme.color.white};
                padding: 0.5rem 0.7rem;
                border-radius: 4px;

                & header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;

                    & .mission_name {
                        color: ${theme.color.black};
                    }

                    & .content_actios {
                        display: flex;
                        align-items: center;
                    }

                    button {
                        width: 36px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        cursor: pointer;
                    }
                }
            }
        }
    }
`

interface MissionListProps {
    toggleMission: () => void
}

export const MissionList = ({ toggleMission }: MissionListProps) => {
    const getMission = async () => {
        try {
            const response = await axios.get(MISSION, { withCredentials: true })
            const data = await response.data

            console.log(data)
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        // mission 요청 에러가 나서 막아둠
        getMission()
    }, [])

    return (
        <MissionListWrap>
            <header>
                <h1>미션</h1>

                <Button type={'button'} onClick={toggleMission}>
                    <IoClose />
                </Button>
            </header>

            <article className="container">
                <div className="content">
                    {mockMission.map((mission) => (
                        <ul className="mission" key={mission.seq}>
                            <header>
                                <p className="mission_name">{mission.name}</p>
                                <div className="content_actios">
                                    <button>
                                        <CiEdit />
                                    </button>
                                    <button>
                                        <MdOutlineDelete />
                                    </button>
                                </div>
                            </header>
                            <p>
                                {mission.type === 0 ? '웨이포인트' : '그리드'}{' '}
                                미션
                            </p>
                        </ul>
                    ))}
                </div>
            </article>
        </MissionListWrap>
    )
}
