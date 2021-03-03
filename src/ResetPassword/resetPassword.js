"use strict";

window.addEventListener("DOMContentLoaded", () => {
    // Reset Password

    const resetPassword = async (url, data) => {
        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: data,
        });

        if (!response.ok) {
            throw new Error("Incorrect data, try again");
        }

        return response.json();
    };

    function bindNewPassword(json) {}
});
