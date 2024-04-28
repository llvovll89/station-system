import { useState } from "react"
import { Input } from "../../components/Input";
import { Button } from "../../components/Button";
import { LoginWrap } from "./LoginStyle";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai";

interface LoginData {
    email: string;
    password: string;
}

export const Login = () => {
    const [loginData, setLoginData] = useState<LoginData>({
        email: "",
        password: "",
    });
    const [failedMsg, setFailedMsg] = useState<string>("");
    const navigate = useNavigate();

    const onClick = () => {
        if (loginData.email && loginData.password) {
            setFailedMsg("로그인 실패, 아이디 또는 비밀번호를 잘못 입력하셨습니다.");

            setTimeout(() => {
                setFailedMsg("");
                navigate("#");
            }, 1500);
        } else {
            setFailedMsg("로그인 실패, 아이디 또는 비밀번호를 잘못 입력하셨습니다.");

            setTimeout(() => {
                setFailedMsg("");
            }, 1500);
        }
    }

    return (
        <LoginWrap>
            <article className="content">
                <header className="logo_box">
                    <h1>STATION-SYSTEM</h1>
                </header>

                <article>
                    <form>
                        <div>
                            <label htmlFor="id">아이디</label>
                            <Input
                                id="id"
                                type="email"
                                value={loginData.email}
                                onChange={(e) => {
                                    setLoginData({
                                        ...loginData,
                                        email: e.target.value,
                                    });
                                }}
                            />

                            <AiOutlineUser />
                        </div>
                        <div className="password-box">
                            <label htmlFor="password">비밀번호</label>
                            <Input
                                id="password"
                                type="password"
                                value={loginData.password}
                                onChange={(e) => {
                                    setLoginData({
                                        ...loginData,
                                        password: e.target.value,
                                    });
                                }}
                            />

                            <AiOutlineLock />
                        </div>
                    </form>

                    <div className="center">
                        <input type="checkbox" className="checkbox" id="login_check" />
                        <label htmlFor="login_check">로그인 상태 유지</label>
                    </div>

                    {failedMsg && <span className="fail">{failedMsg}</span>}

                    <div className="btn-box">
                        <Button text="로그인" onClick={onClick}></Button>
                    </div>
                </article>

                <ul className="bt_list">
                    <li>
                        <Link to="/join">회원가입</Link></li>
                    <li>
                        <Link to="#">비밀번호 찾기</Link>
                    </li>
                    <li>
                        <Link to="#">아이디 찾기</Link>
                    </li>
                </ul>
            </article>
        </LoginWrap>
    )
}