import {Link, Outlet, useLocation} from "react-router";
import {useEffect, useState} from "react";
import {fetch} from "@tauri-apps/plugin-http";
import { getVersion } from '@tauri-apps/api/app';

const routes = [{
    "name": "play",
    "path": "/home",
}, {
    "name": "settings",
    "path": "/home/settings",
}, {
    "name": "system report",
    "path": "/home/sysreport",
}, {
    "name": "credits",
    "path": "/home/credits",
}]

function HomeLayout() {
    const location = useLocation();
    const [currentRoute, setCurrentRoute] = useState(location.pathname);
    const [loggedIn, setLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [betterBucks, setBetterBucks] = useState(0);
    const [userSubscribed, setUserSubscribed] = useState(false);
    const [dataReady, setDataReady] = useState(false);

    const [appVersion, setAppVersion] = useState("0.0.0");

    useEffect(() => {
        setCurrentRoute(location.pathname);
        getVersion().then(version => {
            setAppVersion(version);
        });
        if(localStorage.getItem("token")) {
            setLoggedIn(true);
            setUsername(localStorage.getItem('username'));
            // this is to get better bucks
            let lastFetched;
            if(localStorage.getItem("date_last_fetched")) {
                lastFetched = new Date(localStorage.getItem("date_last_fetched"));
            } else {
                lastFetched = new Date() - 65000;
            }
            let now = new Date();
            if((now - lastFetched) >= 60000) {
                fetch(`https://better.game/api/account?username=${localStorage.getItem("username")}&auth=${localStorage.getItem("token")}`, {
                    method: "GET"
                }).then(res => res.json()).then(data => {
                    setBetterBucks(data["better-bucks"]);
                    localStorage.setItem("better-bucks", data["better-bucks"]);
                    localStorage.setItem("date_last_fetched", new Date());
                });
                fetch(`https://better.game/api/payment-subscription-status?username=${localStorage.getItem("username")}&auth=${localStorage.getItem("token")}`, {
                    method: "GET"
                }).then(res => {
                    if(res.status === 200) {
                        setUserSubscribed(true);
                        localStorage.setItem("subscribed", true);
                    } else {
                        setUserSubscribed(false);
                        localStorage.setItem("subscribed", false);
                    }
                    setDataReady(true);
                });
            } else {
                setBetterBucks(localStorage.getItem("better-bucks"));
                setUserSubscribed(localStorage.getItem("subscribed"));
                setDataReady(true);
            }
        }
    }, [location]);

    return (
        <div className="flex flex-col h-screen">
            <nav data-tauri-drag-region className="bg-[#1e1e1e] text-white p-4 border-b-2 flex justify-between items-center select-none">
                <h1 className="text-xl font-bold">better.game</h1>
                {!loggedIn && (
                    <Link to={"/login"}>
                        <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] transition duration-200 py-2 px-4 rounded">
                            login
                        </button>
                    </Link>
                )}
                {loggedIn && !dataReady && (
                    <p>loading...</p>
                )}
                {loggedIn && dataReady && (
                    <div className="flex items-center">
                        <p className="mr-4 font-bold">{username}</p>
                        <p className={"mr-4 " + (userSubscribed ? "text-green-500" : "text-red-500")}>
                            {userSubscribed ? "subscribed" : "not subscribed"}
                        </p>
                        <p className="mr-4">{betterBucks} better bucks</p>
                        <Link to={"/logout"}>
                            <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] transition duration-200 py-2 px-4 rounded">
                                logout
                            </button>
                        </Link>
                    </div>
                )}
            </nav>
            <div className="flex flex-1">
                <aside className="bg-[#1e1e1e] text-white w-1/4 border-r-2">
                    {routes.map((route, index) => (
                        <Link to={route.path} key={index}>
                            <button
                                className={"w-full pb-4 pt-4 px-4 text-start bg-[#1e1e1e] hover:bg-[#2a2a2a] transition duration-200"
                                + (currentRoute === route.path ? " bg-[#2a2a2a]" : "")
                            }>
                                {route.name}
                            </button>
                        </Link>
                    ))}
                    <p className="text-center mt-4">v{appVersion}</p>
                </aside>
                <main className="flex-1 p-4 bg-[#1e1e1e] text-white">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

export default HomeLayout;