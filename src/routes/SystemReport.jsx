import { platform } from '@tauri-apps/plugin-os';
import {useEffect, useState} from "react";

import {getSystemInfoLinux} from "../functions/sysinfo/linux";
import {getSystemInfoMacOS} from "../functions/sysinfo/macos";

function SystemReport() {
    const [systemReport, setSystemReport] = useState("");
    const [os, setOs] = useState("");

    useEffect(() => {
        async function doReport() {
            let {cpu, gpu, memory, windowmanager, osInfo} = "";
            const currentPlatform = platform();
            setOs(currentPlatform);
            let systemInfo;
            if(currentPlatform === "macos") {
                systemInfo = await getSystemInfoMacOS();
            }
            if(currentPlatform === "linux") {
                systemInfo = await getSystemInfoLinux();
            }
            cpu = systemInfo.cpu;
            if(systemInfo.gpu !== "") {
                gpu = systemInfo.gpu;
            }
            memory = systemInfo.memory;
            windowmanager = systemInfo.windowmanager;
            osInfo = systemInfo.osInfo;
            if(osInfo === "") {
                setSystemReport("Unsupported OS");
                return;
            }
            setSystemReport(`CPU: ${cpu}\n`);
            if(gpu !== "") {
                setSystemReport((prev) => prev + `GPU: ${gpu}\n`);
            }
            setSystemReport((prev) => prev + `Memory: ${memory}\nWindow Manager: ${windowmanager}\nOS: ${osInfo}`);
        }
        doReport();
    }, []);

    return (
        <>
            <h1 className={"text-2xl font-bold"}>system report</h1>
            <p>this is used so the developers can see what system you are using in case of any errors.</p>
            <pre className={"bg-[#2a2a2a] p-4 text-white mt-4"}>{systemReport}</pre>
        </>
    );
}

export default SystemReport;