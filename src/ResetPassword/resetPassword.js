"use strict";

window.addEventListener("DOMContentLoaded", () => {
    // Reset Password
    const firstPasswordInput = document.querySelector(".firstInput"),
        secondPasswordInput = document.querySelector(".secondInput"),
        resetForm = document.querySelector(".resetForm");

    let params = new URL(document.location).searchParams;

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

    function bindNewPassword(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            let obj = {};

            if (firstPasswordInput.value === secondPasswordInput.value) {
                obj.password = firstPasswordInput.value;
            } else {
                alert("Incorrect password, try again");
            }
            obj.token = params.get("uid");

            resetPassword(`${AUTH_URL}/account/reset-password`)
                .then(() => {
                    alert("Password succesfully reset");
                    location.replace("../../index.html");
                })
                .catch((error) => alert(error));
        });
    }

    bindNewPassword(resetForm);
});
