import { useEffect, useRef, useState } from "react"
import { Input } from "../../components/Input";
import { Button } from "../../components/button/Button";
import { LoginWrap } from "./LoginStyle";
import { Link, useNavigate } from "react-router-dom";
import { AiOutlineLock, AiOutlineUser } from "react-icons/ai";
import { LoginDto } from "../../dto/LoginDto";
import axios from "axios";

interface LoginData {
    id: string;
    password: string;
}

export const Login = () => {
    const [loginData, setLoginData] = useState<LoginData>({
        id: "",
        password: "",
    });
    const [failedMsg, setFailedMsg] = useState<string>("");
    const [localUserData, setLocalUserData] = useState<string>("");

    const loginIdRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (loginData.id && loginData.password) {
            e.preventDefault();

            try {
                const response = await axios.post("http://13.124.113.180:8080/login", {
                    id: loginData.id,
                    password: loginData.password,
                });

                const data: LoginDto = await response.data;

                if (response.status === 200) {
                    localStorage.setItem('user', data.id);
                    navigate("/mission");
                }
            } catch (error) {
                console.error(error);
                setFailedMsg("로그인 실패, id / password를 잘못 입력 하셨습니다.");

                setLoginData(() => ({
                    id: "",
                    password: "",
                }));

                if (loginIdRef) {
                    loginIdRef.current.focus();
                }

                setTimeout(() => {
                    setFailedMsg("");
                }, 2000);
            }
        } else {
            setFailedMsg("로그인 실패, id / password를 둘 다 입력해 주시기 바랍니다.");

            setTimeout(() => {
                setFailedMsg("");
            }, 2000);
        }
    }

    useEffect(() => {
        if (localStorage.getItem("user")) {
            setLocalUserData(JSON.stringify(localStorage.getItem("user")));
            navigate("/mission");
        } else {
            setLocalUserData("");
        }
    }, [localUserData, navigate]);


    return (
        <LoginWrap>
            <article className="content">
                <header className="logo_box">
                    <h1>STATION-SYSTEM</h1>
                </header>

                <article>
                    <form onSubmit={onSubmit}>
                        <div>
                            <label htmlFor="id">아이디</label>
                            <input type="text" ref={loginIdRef} name="login_id" id="id" className="id" onChange={(e) => {
                                setLoginData({
                                    ...loginData,
                                    id: e.target.value,
                                })
                            }}
                                value={loginData.id}
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

                        <div className="center">
                            <input type="checkbox" className="checkbox" id="login_check" />
                            <label htmlFor="login_check">로그인 상태 유지</label>
                        </div>

                        {failedMsg && <span className="fail">{failedMsg}</span>}

                        <div className="btn-box">
                            <Button text="로그인" type="submit"></Button>
                        </div>
                    </form>
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