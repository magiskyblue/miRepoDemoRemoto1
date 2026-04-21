import useAuthCookie from "./useAuthCookie";

export default function AppCookie() {
    const { token, login, logout } = useAuthCookie();

    return (
        <div>
            <h3>Auth con Cookie</h3>

            {token ? (
                <>
                    <p>Sesión activa</p>
                    <button onClick={logout}>
                        Logout
                    </button>
                </>
            ) : (
                <button onClick={login}>
                    Login
                </button>
            )}
        </div>
    );
}