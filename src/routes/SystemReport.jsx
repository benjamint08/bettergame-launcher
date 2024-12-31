import { platform } from '@tauri-apps/plugin-os';
import {useEffect, useState} from "react";

// import {getSystemInfoLinux} from "../functions/sysinfo/linux";
import {getSystemInfoMacOS} from "../functions/sysinfo/macos";

function SystemReport() {
    const [systemReport, setSystemReport] = useState("");
    const [os, setOs] = useState("");

    useEffect(() => {
        async function doReport() {
            let {cpu, memory, windowmanager, osInfo} = "";
            const currentPlatform = platform();
            setOs(currentPlatform);
            if(currentPlatform === "macos") {
                let systemInfo = await getSystemInfoMacOS();
                cpu = systemInfo.cpu;
                memory = systemInfo.memory;
                windowmanager = systemInfo.windowmanager;
                osInfo = systemInfo.osInfo;
            }
            if(osInfo === "") {
                setSystemReport("Unsupported OS");
                return;
            }
            setSystemReport(`CPU: ${cpu}\nMemory: ${memory}\nWindow Manager: ${windowmanager}\nOS: ${osInfo}`);
        }
        doReport();
    }, []);

    return (
        <>
            <h1 className={"text-2xl font-bold"}>System Report</h1>
            <p>This is used so the developers can see what system you are using in case of any errors.</p>
            <pre className={"bg-[#2a2a2a] p-4 text-white mt-4"}>{systemReport}</pre>
        </>
    );
}

export default SystemReport;