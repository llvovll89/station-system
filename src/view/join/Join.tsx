import { useState } from "react";
import { JoinWrap } from "./JoinStyle"
import { AiOutlineLeft, AiOutlineMail, AiOutlineUser } from "react-icons/ai";
import { Input } from "../../components/Input";
import { RiLockPasswordFill } from "react-icons/ri";
import { useNavigate } from "react-router-dom";
import { Button } from "../../components/Button";
import axios from "axios";
import { JoinDto } from "../../dto/JoinDto";

interface JoinData {
    id: string;
    name: string;
    password: string;
    confirmPassword: string;
}

export const Join = () => {
    const [joinData, setJoinData] = useState<JoinData>({
        id: "",
        name: "",
        password: "",
        confirmPassword: "",
    });
    const [failedMsg, setFailedMsg] = useState<string>("");

    const navigate = useNavigate();
    const prevSite = () => {
        navigate(-1);
    }

    const submitJoin = async () => {
        if (joinData.id && joinData.name && joinData.password && joinData.confirmPassword) {
            if (joinData.password!== joinData.confirmPassword) {
                setFailedMsg("비밀번호가 일치하지 않습니다.");
            } else {
                try {
                    const response = await axios.post("/api/sign-up", {
                        id: joinData.id,
                        name: joinData.name,
                        password: joinData.password
                    });

                    const data: JoinDto = await response.data;
                    console.log(data);

                    setFailedMsg("회원가입이 완료되었습니다.");
                } catch (error) {
                    console.error(error);
                    setJoinData(() => {
                        return {
                            id: "",
                            name: "",
                            password: "",
                            confirmPassword: "",
                        }
                    })
                }
            }
        } else {
            setFailedMsg("모든 항목을 입력해주세요.");
        }
    }

    return (
        <JoinWrap>
            <article className="content">
                <header>
                    <AiOutlineLeft onClick={prevSite}/>
                    <h1>회원가입</h1>
                </header>
                

                <section>
                    <form>
                        <div>
                            <label htmlFor="id">아이디(e-mail)</label>
                                <Input
                                    id="id"
                                    type="email"
                                    value={joinData.id}
                                    onChange={(e) => {
                                        setJoinData({
                                            ...joinData,
                                            id: e.target.value,
                                        });
                                    }}
                                />
                                <AiOutlineMail />
                        </div>
                        <div>
                            <label htmlFor="name">이름</label>
                                <Input
                                    id="name"
                                    type="text"
                                    value={joinData.name}
                                    onChange={(e) => {
                                        setJoinData({
                                            ...joinData,
                                            name: e.target.value,
                                        });
                                    }}
                                />
                                <AiOutlineUser />
                        </div>
                        <div>
                            <label htmlFor="password">비밀번호</label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={joinData.password}
                                    onChange={(e) => {
                                        setJoinData({
                                            ...joinData,
                                            password: e.target.value,
                                        });
                                    }}
                                />
                                <RiLockPasswordFill />
                        </div>
                        <div>
                            <label htmlFor="confirmPassword">비밀번호 확인</label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={joinData.confirmPassword}
                                    onChange={(e) => {
                                        setJoinData({
                                            ...joinData,
                                            confirmPassword: e.target.value,
                                        });
                                    }}
                                />
                                <RiLockPasswordFill />
                        </div>
                    </form>

                    <div className="bt_list">
                        <Button text="회원가입" type="submit" onClick={submitJoin}></Button>
                    </div>
                </section>
            </article>
        </JoinWrap>
    )
}