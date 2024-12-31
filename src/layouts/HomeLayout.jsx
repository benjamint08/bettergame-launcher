import {Link, Outlet, useLocation} from "react-router";
import {useEffect, useState} from "react";

const routes = [{
    "name": "Play",
    "path": "/home",
}, {
    "name": "Settings",
    "path": "/home/settings",
}, {
    "name": "System Report",
    "path": "/home/sysreport",
}]

function HomeLayout() {
    const location = useLocation();
    const [currentRoute, setCurrentRoute] = useState(location.pathname);

    useEffect(() => {
        setCurrentRoute(location.pathname);
    }, [location]);

    return (
        <div className="flex flex-col h-screen">
            <nav className="bg-[#1e1e1e] text-white p-4 border-b-2 flex justify-between items-center">
                <h1 className="text-xl font-bold">better.game</h1>
                <Link to={"/login"}>
                    <button className="bg-[#2a2a2a] hover:bg-[#3a3a3a] transition duration-200 py-2 px-4 rounded">
                        Login
                    </button>
                </Link>
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
                </aside>
                <main className="flex-1 p-4 bg-[#1e1e1e] text-white">
                    <Outlet/>
                </main>
            </div>
        </div>
    );
}

export default HomeLayout;