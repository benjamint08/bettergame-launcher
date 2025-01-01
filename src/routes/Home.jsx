import {isSupportedOS} from "../functions/isSupportedOS.js";
import {useEffect, useState} from "react";
import { exists, BaseDirectory } from '@tauri-apps/plugin-fs';
import {fetch} from "@tauri-apps/plugin-http";
import {Command} from "@tauri-apps/plugin-shell";

function Home() {
    const [daemonExists, setDaemonExists] = useState(false);
    const [allDataReady, setAllDataReady] = useState(false);
    const [daemonRunning, setDaemonRunning] = useState(false);
    const [daemonLogs, setDaemonLogs] = useState("");
    const [assetsReady, setAssetsReady] = useState(false);

    const [playing, setPlaying] = useState(false);
    const [mode, setMode] = useState("");

    async function killDaemon() {
        try {
            await Command.create('exec-sh', [
                '-c',
                'ps aux | grep bettergame-daemon | grep -v grep | awk \'{print $2}\' | xargs kill'
            ]).execute();
        } catch (e) {
            console.log("no existing daemons found");
        }
    }

    useEffect(() => {
        async function checkOS() {
            let supported = await isSupportedOS();
            if (!supported) {
                window.location.href = "/home/unsupported";
                return;
            }
        }

        checkOS();

        async function checkDaemon() {
            setDaemonExists(await exists('bettergame-daemon', {baseDir: BaseDirectory.AppData}));
            setAllDataReady(true);
        }
        checkDaemon();
    }, []);

    async function playOffline() {
        setPlaying(true);
        setMode("offline");
        await fetch(`http://localhost:8080/launch-offline`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                "auth": localStorage.getItem("token"),
                "username": localStorage.getItem("username")
            })
        })
        setTimeout(() => {
            setPlaying(false);
            setMode("");
        }, 20000);
    }

    async function playSolos() {
        setPlaying(true);
        setMode("solos");
        setTimeout(() => {
            setPlaying(false);
        }, 20000);
    }

    async function startDaemon() {
        // kill all existing daemons
        await killDaemon();
        setDaemonRunning(false);
        const dmn = await Command.create('exec-sh', [
            '-c',
            '~/.local/share/co.p3pr.bettergame-launcher/bettergame-daemon'
        ]);
        dmn.on('close', data => {
            console.log(`command finished with code ${data.code} and signal ${data.signal}`)
            setDaemonRunning(false);
        });
        dmn.stdout.on('data', line => console.log("DAEMON: " + line));
        dmn.stderr.on('data', line => console.log("DAEMON: " + line));

        await dmn.spawn();
        setDaemonRunning(true);
        setAssetsReady(false);
        setTimeout(async () => {
            const assetsReady = await fetch(`http://localhost:8080/fetch-assets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    "auth": localStorage.getItem("token"),
                    "username": localStorage.getItem("username")
                })
            });
            const data = await assetsReady.text();
            if(data.includes("fetch-assets")) {
                setAssetsReady(true);
            }
        }, 2000);
    }

    return (
        <div className={"text-center"}>
            <h1 className={"text-2xl font-bold"}>play better.game</h1>
            <p className={"mt-4"}>
                better.game is a game to play with your friends. it is currently in beta, so there may be bugs.
            </p>
            {allDataReady && !daemonExists && (
                <>
                    <p>daemon exists? no, go to settings to fix</p>
                </>
            )}
            {!daemonRunning && daemonExists && (
                <div className={"mt-2 text-2xl font-bold"}>
                    <p>daemon running? no. daemon must be running to play</p>
                    <button className={"bg-[#2a2a2a] text-white p-2 rounded mt-2"} onClick={startDaemon}>start daemon</button>
                </div>
            )}
            {daemonRunning && (
                <div className={"mt-2 text-2xl font-bold"}>
                    <p>daemon running? yes</p>
                    <button className={"bg-red-500 text-white p-2 text-sm rounded mt-2"} onClick={async() => {
                        await killDaemon();
                        setDaemonRunning(false);
                    }}>stop daemon</button>
                </div>
            )}
            {daemonRunning && !assetsReady && (
                <div className={"mt-2 text-2xl font-bold"}>
                    <p>assets ready? no</p>
                    <p>wait patiently</p>
                </div>
            )}
            {daemonRunning && assetsReady && !playing && (
                <div className={"mt-2 text-2xl font-bold flex-col flex"}>
                    <p>assets ready? yes</p>
                    <p>you can now play the game</p>
                    <div className={"w-full flex justify-center"}>
                        <button className={"bg-[#2a2a2a] text-white p-2 rounded mt-2"} onClick={playOffline}>play offline</button>
                        <button className={"bg-[#2a2a2a] text-white p-2 rounded mt-2 ml-2"} onClick={playSolos}>play solos</button>
                    </div>
                </div>
            )}
            {playing && (
                <div className={"mt-2 text-2xl font-bold"}>
                    <p>playing...</p>
                    <p>mode: {mode}</p>
                </div>
            )}
        </div>
    );
}

export default Home;