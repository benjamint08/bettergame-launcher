import React, {useEffect, useState} from 'react';
import { exists, BaseDirectory, open } from '@tauri-apps/plugin-fs';
import { fetch } from '@tauri-apps/plugin-http';
import { Command } from '@tauri-apps/plugin-shell';

function Settings() {
    const [daemonExists, setDaemonExists] = useState(false);
    const [installingDaemon, setInstallingDaemon] = useState(false);

    useEffect(() => {
        async function checkDaemon() {
            setDaemonExists(await exists('bettergame-daemon', {baseDir: BaseDirectory.AppData}));
            if(daemonExists) {
                let daemonDateInstalled = localStorage.getItem("daemon_date_installed");
                if(daemonDateInstalled) {
                    let date = new Date(daemonDateInstalled);
                    let now = new Date();
                    if((now - date) >= 7200000) {
                        try {
                            await Command.create('exec-sh', [
                                '-c',
                                'ps aux | grep bettergame-dae | grep -v grep | awk \'{print $2}\' | xargs kill'
                            ]).execute();
                        } catch (e) {
                            console.log("no existing daemons found");
                        }
                        try {
                            await Command.create('exec-sh', [
                                '-c',
                                'rm -rf ~/.local/share/co.p3pr.bettergame-launcher/bettergame-daemon'
                            ]).execute();
                        } catch (e) {
                            console.log("no daemon found");
                        }
                        setDaemonExists(false);
                    }
                }
            }
        }
        checkDaemon();
    }, []);

    async function installDaemon() {
        setInstallingDaemon(true);
        const url = "https://better-game.network/daemon";
        const res = await fetch(url, {
            method: "GET"
        });
        const data = await res.arrayBuffer();
        const file = await open('bettergame-daemon', {
            write: true,
            create: true,
            baseDir: BaseDirectory.AppData
        });
        await file.write(data);
        await file.close();
        await Command.create('exec-sh', [
            '-c',
            'chmod +x ~/.local/share/co.p3pr.bettergame-launcher/bettergame-daemon'
        ]).execute();
        localStorage.setItem("daemon_date_installed", new Date().toString());
        setDaemonExists(true);
        setInstallingDaemon(false);
    }

    return (
        <>
            <h1 className={"text-2xl font-bold text-center"}>better.game launcher settings</h1>
            <div className={"text-center mt-4"}>
                <p>here you can change settings for the better.game launcher.</p>
                <p>if you are having issues, you can try restarting the daemon.</p>
            </div>
            <div className={"text-center mt-4"}>
                {!daemonExists && !installingDaemon && (
                    <>
                        <p>daemon does not exist</p>
                        <button className={"bg-[#2a2a2a] text-white p-2 rounded mt-2"} onClick={installDaemon}>install daemon</button>
                    </>
                )}
                {daemonExists && !installingDaemon && (
                    <>
                        <p>daemon exists at ~/.local/share/co.p3pr.bettergame-launcher</p>
                    </>
                )}
                {installingDaemon && (
                    <p className={"text-2xl font-bold"}>installing daemon, please do not exit!</p>
                )}
            </div>
        </>
    );
}

export default Settings;