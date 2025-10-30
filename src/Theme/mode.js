import React, {useState, useEffect} from "react";
import { Sun, Moon} from 'lucide-react';

function Mode() {
    const [theme, setTheme] = useState("light");

    const togleTheme = () => {
        const newTheme = theme === "light" ? "dark" : "light";
        setTheme(newTheme);
        document.body.className = newTheme;
        localStorage.setItem("theme",newTheme);
    };

    useEffect(() => {
        const savedTheme = localStorage.getItem("theme") || "light";
        setTheme(savedTheme);
        document.body.className = savedTheme;
    },[]);

    return (
        <button className="theme-toggle" onClick={togleTheme}>
            {theme === "dark" ? <Sun size={20}/> : <Moon size={20} />}
        </button>
    )

}

export default Mode;