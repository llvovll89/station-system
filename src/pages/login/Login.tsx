import { useEffect, useState } from 'react'
import { Input } from '../../components/Input'
import { Button } from '../../components/button/Button'
import { LoginWrap } from './LoginStyle'
import { Link, useNavigate } from 'react-router-dom'
import { AiOutlineLock, AiOutlineUser } from 'react-icons/ai'
import { LoginDto } from '../../dto/LoginDto'
import axios, { AxiosError, AxiosResponse } from 'axios'
import { timeOut } from '../../util/timeOut'
import { LOGIN } from '../../constant/http'
import * as routes from '../../constant/Routes'

interface LoginData {
    id?: string
    password?: string
}

export const Login = () => {
    const [loginData, setLoginData] = useState<LoginData>({
        id: '',
        password: '',
    })
    const [message, setMessage] = useState<{ failed: string; success: string }>(
        {
            failed: '',
            success: '',
        }
    )

    const navigate = useNavigate()

    const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (loginData.id && loginData.password) {
            e.preventDefault()

            try {
                const response: AxiosResponse = await axios.post(
                    LOGIN,
                    {
                        id: loginData.id,
                        password: loginData.password,
                    },
                    { withCredentials: true }
                )

                const data: LoginDto = await response.data

                if (response.status === 200) {
                    localStorage.setItem('user', data.id)
                    setMessage((prev) => ({
                        ...prev,
                        success: '로그인 성공! mission page로 이동합니다.',
                    }))

                    timeOut(2000, () => {
                        setMessage((prev) => ({
                            ...prev,
                            failed: '',
                            success: '',
                        }))
                        navigate(routes.MAIN)
                    })
                }
            } catch (error) {
                const err = error as AxiosError

                if (err?.response?.status === 401) {
                    setMessage((prev) => ({
                        ...prev,
                        failed: '로그인 실패, 비밀번호가 틀렸습니다. 다시 확인해 주세요.',
                    }))
                    timeOut(2000, () => {
                        setMessage((prev) => ({
                            ...prev,
                            failed: '',
                        }))
                        setLoginData(() => ({
                            password: '',
                        }))
                    })
                } else if (err?.response?.status === 404) {
                    setMessage((prev) => ({
                        ...prev,
                        failed: '로그인 실패, 없는 아이디 입니다. 다시 확인해 주세요.',
                    }))
                    timeOut(2000, () => {
                        setMessage((prev) => ({
                            ...prev,
                            failed: '',
                            success: '',
                        }))
                        setLoginData(() => ({
                            id: '',
                            password: '',
                        }))
                    })
                } else {
                    setMessage((prev) => ({
                        ...prev,
                        failed: '로그인 실패, 아이디 / 비밀번호를 잘못 입력하셨습니다.',
                    }))
                    timeOut(2000, () => {
                        setMessage((prev) => ({
                            ...prev,
                            failed: '',
                            success: '',
                        }))
                        setLoginData(() => ({
                            id: '',
                            password: '',
                        }))
                    })
                }
            }
        } else {
            setMessage((prev) => ({
                ...prev,
                failed: '로그인 실패, 빈칸없이 입력해주세요.',
            }))
            timeOut(2000, () => {
                setMessage((prev) => ({
                    ...prev,
                    failed: '',
                    success: '',
                }))
                setLoginData(() => ({
                    id: '',
                    password: '',
                }))
            })
        }
    }

    useEffect(() => {
        if (!localStorage.getItem('user')) {
            navigate('/')
        } else {
            navigate(routes.MAIN)
        }
    }, [])

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
                            <input
                                type="text"
                                name="login_id"
                                id="id"
                                className="id"
                                onChange={(e) => {
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
                                    })
                                }}
                            />

                            <AiOutlineLock />
                        </div>

                        <div className="center">
                            <input
                                type="checkbox"
                                className="checkbox"
                                id="login_check"
                            />
                            <label htmlFor="login_check">
                                로그인 상태 유지
                            </label>
                        </div>

                        {message.failed ||
                            (message.success && (
                                <span
                                    className={message.failed ? 'fail' : 'suc'}
                                >
                                    {message.failed || message.success}
                                </span>
                            ))}

                        <div className="btn-box">
                            <Button text="로그인" type="submit"></Button>
                        </div>
                    </form>
                </article>

                <ul className="bt_list">
                    <li>
                        <Link to="/join">회원가입</Link>
                    </li>
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
