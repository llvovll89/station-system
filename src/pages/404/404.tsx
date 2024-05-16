import { NotFoundPageComponent } from "./404Styles"
import NotFoundImage from "../../assets/image/404/404.png"
import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const NotFoundPage = () => {
    const navigate = useNavigate();
    
    useEffect(() => {
        setTimeout(() => {
            navigate("/");
        }, 3000);
    }, [navigate]);

    return (
        <NotFoundPageComponent>
            <article>
                <div>
                    <img src={NotFoundImage} alt="404" />
                </div>

                <div className="sub_body">
                    <h1>404 Not Found Page</h1>
                    <div className="text">
                        <span>잘못된 URL이 입력 되었습니다.</span>
                        <span>정상적인 주소를 다시 요청해 주시기 바랍니다.</span>
                        <span>3초 후 자동으로 로그인 페이지로 이동합니다.</span>
                    </div>
                </div>
            </article>
        </NotFoundPageComponent>
    )
}