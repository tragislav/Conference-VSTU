"use strict";

window.addEventListener("DOMContentLoaded", () => {
    // Autorization
    const authForm = document.querySelector("#signIn");
    const authURL = `${AUTH_URL}/token`;

    const message = {
        loading: "Loading",
        success: "Thank you",
        failure: "Failure",
    };

    const sendToken = async (url, headers, data) => {
        let response = await fetch(url, {
            method: "POST",
            headers: headers,
            body: data,
        });

        if (!response.ok) {
            throw new Error("Введены некорректные данные. Попробуйте ещё раз.");
        }

        return response.json();
    };

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

            sendToken(url, headers, formData)
                .then((data) => {
                    statusMessage.textContent = message.success;

                    setTimeout(() => {
                        statusMessage.remove();
                    }, 4000);
                    localStorage.setItem(
                        "token",
                        data.token_type.concat(" ").concat(data.access_token)
                    );
                    const i = data.roles[0];

                    switch (i) {
                        case "USER":
                            localStorage.setItem("role", "USER");
                            window.location.href =
                                "./src/PersonalArea/personalArea.html";
                            break;
                        case "ADMIN":
                            localStorage.setItem("role", "ADMIN");
                            window.location.href = "./src/AdminPage/admin.html";
                            break;
                    }
                })
                .catch((error) => {
                    alert(error);
                    statusMessage.textContent = message.failure;
                    setTimeout(() => {
                        statusMessage.remove();
                    }, 4000);
                })
                .finally(() => {
                    form.reset();
                });
        });
    }

    getToken(authForm, authURL);

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
    const forgetPassUrl = `${AUTH_URL}/account/drop-password`;

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
                alert("try again");
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
