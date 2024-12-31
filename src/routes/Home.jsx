import {isSupportedOS} from "../functions/isSupportedOS.js";
import {useEffect, useState} from "react";

function Home() {
    const [supportedOS, setSupportedOS] = useState(false);

    useEffect(() => {
        async function checkOS() {
            let supported = await isSupportedOS();
            setSupportedOS(supported);
        }
        checkOS();
    }, []);

    return (
        <>
            <h1 className={"text-2xl font-bold text-center"}>Play better.game</h1>

            {!supportedOS && (
                <p className={"text-center mt-4"}>
                    Your operating system is not supported. Please use Linux, and be better.
                </p>
            )}
        </>
    );
}

export default Home;