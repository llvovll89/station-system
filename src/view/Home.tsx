import { Route, Routes } from "react-router-dom";
import styled from "styled-components";
import { Login } from "./login/Login";
import { Join } from "./join/Join";
import { NotFoundPage } from "./404/404";

const HomeSection = styled.section`
    width: 100vw;
    min-height: 100vh;
    overflow: hidden;
`

export const Home = () => {
    return (
        <HomeSection>
            <Routes>
                <Route path="/" element={<Login />} />
                <Route path="*" element={<NotFoundPage />} />
                <Route path="/join" element={<Join />} />
                {/* <Route path="/main" element={<Main />} /> */}
            </Routes>
        </HomeSection>
    )
}