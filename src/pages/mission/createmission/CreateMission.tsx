import { CreateMissionWrap } from './CreateMissionStyle'
import { Button } from '../../../components/button/Button'

interface CreateMissionProps {
    // setSelectMission: React.Dispatch<React.SetStateAction<string>>
}

export const CreateMission = () => {
    return (
        <CreateMissionWrap>
            <article className="container">
                <header>
                    <h1>미션생성</h1>
                    <Button
                        type="button"
                        text="X"
                        // onClick={closeCreateMission}
                    />
                </header>

                <article className="grid">
                    <p>미션 타입</p>

                    <div className="grid">
                        <Button
                            // className={
                            //     selectMission === 'wayline' ? 'wayline' : ''
                            // }
                            // onClick={() => selectMissionType('wayline')}
                            type="button"
                            text="웨이라인"
                        />
                        <Button
                            // className={
                            //     selectMission === 'region' ? 'region' : ''
                            // }
                            // onClick={() => selectMissionType('region')}
                            type="button"
                            text="지역"
                        />
                    </div>
                </article>

                <footer>
                    <Button
                        text="닫기"
                        type="button"
                        // onClick={closeCreateMission}
                    />
                    <Button
                        text="생성"
                        type="button"
                        // onClick={submitCreateMission}
                    />
                </footer>
            </article>
        </CreateMissionWrap>
    )
}
