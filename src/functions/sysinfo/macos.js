import { Command } from '@tauri-apps/plugin-shell';

export async function getSystemInfoMacOS() {
    let {cpu, memory, windowmanager, osInfo} = "";
    let cpuCmd = await Command.create('exec-sh', [
        '-c',
        'sysctl -n machdep.cpu.brand_string'
    ]).execute()
    cpu = cpuCmd.stdout.replace(/\n/g, "")
    let memoryCmd = await Command.create('exec-sh', [
        '-c',
        'sysctl -n hw.memsize'
    ]).execute()
    let memByteSize = parseInt(memoryCmd.stdout.replace(/\n/g, ""))
    let memSize = Math.round(memByteSize / 1024 / 1024 / 1024)
    memory = `${memSize} GB`
    windowmanager = "WindowServer (MacOS)"
    let osInfoCmd = await Command.create('exec-sh', [
        '-c',
        'sw_vers -productVersion'
    ]).execute()
    osInfo = "MacOS v" + osInfoCmd.stdout.replace(/\n/g, "")
    osInfo += "\n\nMacOS is not supported by better.game"
    return {cpu, memory, windowmanager, osInfo}
}