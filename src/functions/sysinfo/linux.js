import { Command } from '@tauri-apps/plugin-shell';

export async function getSystemInfoLinux() {
    let {cpu, gpu, memory, windowmanager, osInfo} = "";
    let cpuCmd = await Command.create('exec-sh', [
        '-c',
        'lscpu | grep "Model name:" | cut -d ":" -f2'
    ]).execute()
    cpu = cpuCmd.stdout.replace(/\n/g, "")
    cpu = cpu.replace(/^\s+/g, "")
    let gpuCmd = await Command.create('exec-sh', [
        '-c',
        'lspci | grep VGA | cut -d ":" -f3'
    ]).execute()
    gpu = gpuCmd.stdout.replace(/\n/g, "")
    gpu = gpu.replace(/^\s+/g, "")
    let memoryCmd = await Command.create('exec-sh', [
        '-c',
        'free -h | grep Mem | awk \'{print $2}\''
    ]).execute()
    memory = `${parseInt(memoryCmd.stdout.split("Gi")[0])+1} GB`
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
    return {cpu, gpu, memory, windowmanager, osInfo}
}