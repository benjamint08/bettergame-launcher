import { Command } from '@tauri-apps/plugin-shell';

export async function getSystemInfoLinux() {
    let {cpu, memory, windowmanager, osInfo} = "";
    let cpuCmd = await Command.create('exec-sh', [
        '-c',
        'lscpu | grep "Model name:" | cut -d ":" -f2'
    ]).execute()
    cpu = cpuCmd.stdout.replace(/\n/g, "")
    let memoryCmd = await Command.create('exec-sh', [
        '-c',
        'free -h | grep Mem | awk \'{print $2}\''
    ]).execute()
    let memByteSize = parseInt(memoryCmd.stdout.replace(/\n/g, ""))
    let memSize = Math.round(memByteSize / 1024 / 1024 / 1024)
    memory = `${memSize} GB`
    let windowManagerCmd = await Command.create('exec-sh', [
        '-c',
        'echo $XDG_CURRENT_DESKTOP'
    ]).execute()
    windowmanager = windowManagerCmd.stdout.replace(/\n/g, "")
    let osInfoCmd = await Command.create('exec-sh', [
        '-c',
        'cat /etc/os-release | grep PRETTY_NAME | cut -d "=" -f2'
    ]).execute()
    osInfo = osInfoCmd.stdout.replace(/\n/g, "")
    return {cpu, memory, windowmanager, osInfo}
}