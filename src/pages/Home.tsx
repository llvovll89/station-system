import * as route from '../constant/Routes'
import styled from 'styled-components'
import { Route, Routes } from 'react-router-dom'
import { Login } from './login/Login'
import { Join } from './join/Join'
import { NotFoundPage } from './404/404'
import { Main } from './main/Main'
import { Schedule } from './schedule/Schedule'

const HomeSection = styled.section`
    width: 100vw;
    min-height: 100vh;
    overflow: hidden;
`

export const Home = () => {
    // const showHeaderRoutes = [
    //     // route.MISSION,
    //     // route.STATION,
    //     route.MAIN,
    // ];

    // const shouldShowHeader = showHeaderRoutes.includes(pathname);

    return (
        <HomeSection>
            {/* {shouldShowHeader && <Header />} */}

            <Routes>
                <Route path={route.LOGIN} element={<Login />} />
                <Route path={route.JOIN} element={<Join />} />
                <Route path={route.MAIN} element={<Main />} />
                <Route path={route.NOTFOUND} element={<NotFoundPage />} />
            </Routes>
        </HomeSection>
    )
}
