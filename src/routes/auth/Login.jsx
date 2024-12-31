import {useEffect, useState} from "react";
import { fetch } from '@tauri-apps/plugin-http';

function Login() {
    const [logged, setLogged] = useState(false);
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [loggingIn, setLoggingIn] = useState(false);

    useEffect(() => {
        if(localStorage.getItem("token")) {
            setLogged(true);
            window.location.href = "/home";
            return;
        }
    }, []);

    async function login(e) {
        e.preventDefault();
        if(loggingIn) {
            return;
        }
        setLoggingIn(true);
        const url = "https://better.game/api/sign-in"
        const data = {
            "username": username,
            "password": password
        }
        const res = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(data)
        });
        const token = await res.text();
        if(token === "wrong password") {
            setError("Incorrect password");
            setLoggingIn(false);
            return;
        }
        if(token === "no such user") {
            setError("User not found");
            setLoggingIn(false);
            return;
        }
        localStorage.setItem("username", username);
        localStorage.setItem("token", token);
        setLogged(true);
        window.location.href = "/home";
    }

    return (
        <div className={"bg-[#1e1e1e] text-white h-screen flex justify-center items-center"}>
            <div>
                <h1 className={"text-2xl font-bold"}>Login</h1>
                {error && (
                    <p className={"text-red-500 mt-2"}>{error}</p>
                )}
                <form className={"mt-4"} onSubmit={login}>
                    <label className={"block"}>
                        Username
                        <input type={"text"} className={"bg-[#2a2a2a] p-2 text-white w-full mt-2"}
                               onChange={(e) => setUsername(e.target.value)} />
                    </label>
                    <label className={"block mt-4"}>
                        Password
                        <input type={"password"} className={"bg-[#2a2a2a] p-2 text-white w-full mt-2"}
                               onChange={(e) => setPassword(e.target.value)} />
                    </label>
                    {loggingIn ? (
                        <button
                            className={"bg-[#2a2a2a] hover:bg-[#3a3a3a] transition duration-200 mt-4 py-2 px-4 rounded cursor-not-allowed"}>
                            Logging in...
                        </button>
                    ) : (
                        <button
                            className={"bg-[#2a2a2a] hover:bg-[#3a3a3a] transition duration-200 mt-4 py-2 px-4 rounded"}>
                            Login
                        </button>
                    )}
                </form>
            </div>
        </div>
    );
}

export default Login;