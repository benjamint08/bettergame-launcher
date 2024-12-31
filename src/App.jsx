import {useEffect, useState} from "react";

function App() {
    useEffect(() => {
        window.location.href = "/home";
    }, []);

    return null;
}

export default App;
