"use strict";

window.addEventListener("DOMContentLoaded", () => {
    // Autorization
    const authForm = document.querySelector("#signIn");
    const authURL = "http://192.168.50.26:8888/token";

    const message = {
        loading: "Loading",
        success: "Thank you",
        failure: "Failure",
    };

    getToken(authForm, authURL);

    async function getToken(form, url) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const statusMessage = document.createElement("div");
            statusMessage.classList.add("status");
            statusMessage.textContent = message.loading;
            form.append(statusMessage);

            const formData = new FormData(form);
            formData.append("grant_type", "password");

            let headers = {
                Authorization:
                    "Basic VlNUVV9DT05GRVJFTkNFX0NMSUVOVDpWU1RVX0NPTkZFUkVOQ0VfQ0xJRU5U",
            };

            let response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: formData,
            });

            let result = await response.json();
            if (response.status === 200) {
                statusMessage.textContent = message.success;
                form.reset();
                setTimeout(() => {
                    statusMessage.remove();
                }, 4000);
                localStorage.setItem(
                    "token",
                    result.token_type.concat(" ").concat(result.access_token)
                );
                window.location.href = "./src/PersonalArea/personalArea.html";
            } else {
                alert("Введены некорректные данные. Попробуйте ещё раз.");
                statusMessage.textContent = message.failure;
                setTimeout(() => {
                    statusMessage.remove();
                }, 4000);
            }
        });
    }

    // Go to Sign Up page
    const btnToSignUp = document.querySelector("#toSignUp");

    function goToSignUp() {
        window.location.replace("./src/Registration/registration.html");
    }

    btnToSignUp.addEventListener("click", (e) => {
        e.preventDefault();
        goToSignUp();
    });

    // Open Modal
    const modal = document.querySelector(".modal");

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

    modal.addEventListener("click", (e) => {
        if (e.target === modal || e.target.getAttribute("data-close") == "") {
            closeDialog();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.code === "Escape" && modal.classList.contains("show")) {
            closeDialog();
        }
    });

    // Forget Password
    const forgetPassBtn = document.querySelector("#forgetPassword");

    forgetPassBtn.addEventListener("click", (e) => {
        e.preventDefault();
        openDialog();
    });

    const forgetPassForm = document.querySelector("#resetPassword");
    const forgetPassUrl = "http://192.168.50.26:8888/account/drop-password";

    forgetPassword(forgetPassForm, forgetPassUrl);

    async function forgetPassword(form, url) {
        form.addEventListener("submit", async (e) => {
            e.preventDefault();

            const formData = new FormData(form);

            let headers = {
                Authorization:
                    "Basic VlNUVV9DT05GRVJFTkNFX0NMSUVOVDpWU1RVX0NPTkZFUkVOQ0VfQ0xJRU5U",
            };

            let response = await fetch(url, {
                method: "POST",
                headers: headers,
                body: formData,
            });

            if (response.status === 200) {
                showThanksModal();
            } else {
                console.log("try again");
            }
        });
    }

    function showThanksModal() {
        const prevModalDialog = document.querySelector(".modal__dialog");

        prevModalDialog.classList.add("hide");
        openDialog();

        const thanksModal = document.createElement("div");
        thanksModal.classList.add("modal__dialog");
        thanksModal.innerHTML = `
            <div class="modal__content">
                <div class="modal__close" data-close>×</div>
                <div class="modal__title">Письмо на вашу почту успешно отправлено</div>
            </div>
        `;

        document.querySelector(".modal").append(thanksModal);
        setTimeout(() => {
            thanksModal.remove();
            prevModalDialog.classList.add("show");
            prevModalDialog.classList.remove("hide");
            closeDialog();
        }, 4000);
    }
});
