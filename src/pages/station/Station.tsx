import { NaverMap } from "../../components/Maps"

export const Station = () => {
    return (
        <section>
            <h1>스테이션 페이지</h1>
            <NaverMap latitude={35.87772056157816} longitude={128.6110784825801} width="100%" height="500px" />
        </section>
    )
}