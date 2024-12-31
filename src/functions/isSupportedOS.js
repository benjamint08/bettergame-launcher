import { platform } from '@tauri-apps/plugin-os';

export async function isSupportedOS() {
    const currentPlatform = platform();
    if(currentPlatform === "linux") {
        return true;
    }
    return false;
}