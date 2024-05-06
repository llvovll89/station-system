import styled from "styled-components";
import { Route, Routes } from "react-router-dom";
import { Login } from "./login/Login";
import { Join } from "./join/Join";
import { NotFoundPage } from "./404/404";
import { Mission } from "./mission/Mission";

const HomeSection = styled.section`
    width: 100vw;
    min-height: 100vh;
    overflow: hidden;
`

export const Home = () => {
    return (
        <HomeSection>
            <Routes>
            <Route path="/" element={<Mission />} />

                {/* <Route path="/" element={<Login />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/join" element={<Join />} />
                <Route path="/mission" element={<Mission />} /> */}
            </Routes>
        </HomeSection>
    )
}