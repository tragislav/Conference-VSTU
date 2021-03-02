"use strict";

window.addEventListener("DOMContentLoaded", () => {
    // Registration
    const regForm = document.querySelector("#regForm"),
        submitBtn = regForm.querySelector("#submitBtn"),
        emailInput = regForm.querySelector("#emailInput"),
        passwordInputFirst = regForm.querySelector("#passwordInput1"),
        passwordInputSecond = regForm.querySelector("#passwordInput2"),
        regURL = `${AUTH_URL}/account`;

    async function regPOST(url, json) {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json;charset=utf-8",
            },
            body: JSON.stringify(json),
        });
        let result = await response.json();
        if (response.status === 200) {
            openDialog();
        } else {
            alert(`Something wrong, please try again`);
        }
    }

    submitBtn.addEventListener("click", (e) => {
        e.preventDefault();

        let demoRequest = {
            roles: [
                {
                    id: "5a34fff5-5aab-4793-8007-bb4a4b6a6c4d",
                },
            ],
        };
        demoRequest.email = emailInput.value;
        if (passwordInputFirst.value === passwordInputSecond.value) {
            demoRequest.password = passwordInputFirst.value;
        } else {
            alert("Password mismatch");
        }

        regPOST(regURL, demoRequest);
    });

    // Open Modal
    const modal = document.querySelector(".modal");
    const modalCloseBtn = document.querySelector("#modalToIndex");

    function openDialog() {
        modal.classList.add("show");
        modal.classList.remove("hide");
        document.body.style.overflow = "hidden";
    }
    function closeDialog() {
        modal.classList.add("hide");
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }

    modalCloseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closeDialog();
        backToIndex();
    });

    // Back to Sign In page
    const btnToIndex = document.querySelector("#toIndex");

    function backToIndex() {
        window.location.replace("../../index.html");
    }

    btnToIndex.addEventListener("click", (e) => {
        e.preventDefault();
        backToIndex();
    });
});
