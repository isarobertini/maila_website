import React from "react"
import { NavigationMenu } from "../common/navigationMenu"

export const Home = () => {
    return (
        <div
            className="min-h-screen bg-no-repeat bg-center"
            style={{
                backgroundImage: "url('/assets/bakground.png')",
                backgroundSize: "120% 120%",
            }}
        >
            <NavigationMenu />
            <h1 className="text-center">This is the home page</h1>
        </div>
    )
}

