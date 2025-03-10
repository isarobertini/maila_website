import React from "react";
import "@dotlottie/player-component"; // Import Lottie player

export const Loader = () => {
    return (
        <dotlottie-player
            src="https://lottie.host/433c8b31-7aca-4ac5-a398-17cd0dfde2b8/uLSfzzmvee.lottie"
            background="transparent"
            speed="1"
            style={{ width: "300px", height: "300px" }}
            loop
            autoplay
        ></dotlottie-player>
    );
};
