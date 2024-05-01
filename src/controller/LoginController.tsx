import { User } from "../model/User"

export const LoginController = () => {
    const submitLogin = (user: User) => {
        console.log(user);
    }

    return (
        <section>
            <h1>컨트롤러</h1>
        </section>
    )
}