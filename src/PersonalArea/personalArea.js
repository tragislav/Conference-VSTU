"use strict";

// TODO: ПОТОМ ЗАМЕНИТЬ ЛОКАЛХОСТ НА МАШИНУ РОМАНА!!!

window.addEventListener("DOMContentLoaded", () => {
    // Check Token
    const token = localStorage.getItem("token");
    setInterval(() => {
        if (!token) {
            window.location.replace("../../index.html");
        } else {
            console.log("We still have token, bro");
        }
    }, 60000);

    // Check User Info
    const checkURL = "http://localhost:8080/users/getInfo";

    const checkUserInfo = async (url) => {
        const response = await fetch(url, {
            headers: {
                Authorization: token,
            },
        });

        if (!response.ok) {
            openModal(modalInfo);
        }

        return response.json();
    };

    checkUserInfo(checkURL).then((data) => createUserInfo(data));

    const checkField = (field) => {
        return field == null || " " || "" ? "Данные не обнаружены" : field;
    };
    function createUserInfo(data) {
        const element = document.createElement("div");

        element.classList.add("userInfoDIV");

        element.innerHTML = `
            Name:
                <span>
                    ${data.name}
                </span>
                <br>
            Patronymic name:
                <span>
                    ${checkField(data.patronymic)}
                </span>
                <br>
            Surname: 
                <span>
                    ${data.surname}
                </span>
                <br>
            Affiliation:
                <span>
                    ${data.affiliation}
                </span>
                <br>
            Postal address of the institution:
                <span>
                    ${data.postAddress}
                </span>
                <br>
            Faculty:
                <span>
                    ${checkField(data.faculty)}
                </span> 
                <br>
            Department, laboratory:
                <span>
                    ${checkField(data.department)}
                </span>
                <br>
            Position:
                <span>
                    ${data.position}
                </span>
                <br>
            Academic Degree:
                <span>
                    ${data.academicDegree}
                </span>
                <br>
            Phone number:
                <span>
                    ${checkField(data.phone)}
                </span>
                <br>
            Email:
            <span>
                ${checkField(data.email)}
            </span>
            <br>
            `;
        document.querySelector(".userInfo .container").append(element);
    }

    // Modal for All
    function openModal(modal) {
        modal.classList.add("show");
        modal.classList.remove("hide");
        document.body.style.overflow = "hidden";
    }

    function closeModal(modal) {
        modal.classList.add("hide");
        modal.classList.remove("show");
        document.body.style.overflow = "";
    }

    // Open Modal Info
    const modalInfo = document.querySelector(".modalInfo");
    const modalInfoCloseBtn = document.querySelector("#modalToIndex");

    modalInfoCloseBtn.addEventListener("click", (e) => {
        e.preventDefault();
        closeModal(modalInfo);
        backToIndex();
    });

    // Send User Info
    const sendForm = document.querySelector("#sendInfo");

    bindUserInfo(sendForm);

    const sendUserData = async (url, data) => {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: token,
                "Content-type": "application/json",
            },
            body: data,
        });

        return response.json();
    };

    function bindUserInfo(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            formData.forEach((item) => {
                item.trim();
            });

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            sendUserData("http://localhost:8080/users/create", json)
                .then(() => {
                    location.reload();
                })
                .catch(() => {
                    console.log("Sosi biby");
                    form.reset();
                });
        });
    }

    // Open Modal Paper
    const modalPaper = document.querySelector(".modalPaper");
    const modalPaperOpenBtn = document.querySelector("#createPaperBtn");
    const modalPaperCloseBtn = document.querySelector("#modalPaperClose");

    modalPaperOpenBtn.addEventListener("click", () => {
        openModal(modalPaper);
    });

    modalPaperCloseBtn.addEventListener("click", () => {
        closeModal(modalPaper);
        location.reload();
    });

    // Get Topics
    const getAllTopics = async (url) => {
        const response = await fetch(url, {
            headers: {
                Authorization: token,
            },
        });

        return response.json();
    };

    getAllTopics("http://localhost:8080/topics/getAll").then((data) =>
        topicToSelect(data)
    );

    const selectTopic = document.querySelector(".selectTopic");

    function topicToSelect(data) {
        data.forEach((item) => {
            selectTopic.append(new Option(item.name, item.id));
        });
    }

    // Post papers
    const postPaperForm = document.querySelector(".createPaperForm");
    const inpAFile = document.getElementById("inpAFile");
    const inpFFile = document.getElementById("inpFFile");

    const postPaper = async (url, data) => {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: token,
                "Content-type": "application/json",
            },
            body: data,
        });

        if (!response.ok) {
            throw new Error("sosao");
        }

        return response.json();
    };

    function bindPostPaper(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();

            const formData = new FormData(form);
            formData.append("aFile", inpAFile.files[0]);
            formData.append("fullFile", inpFFile.files[0]);

            const json = JSON.stringify(Object.fromEntries(formData.entries()));

            postPaper("http://localhost:8080/papers/create", json).then(
                (data) => {
                    form.reset();
                    console.log("great");
                    // TODO: ОБЯЗАТЕЛЬНО ПЕРЕДЕЛАТЬ ПОТОМ!
                    // addFile(
                    //     `http://localhost:8080/papers/upload/abstractFile/${data.id}`,
                    //     formData
                    // ).then(() => {
                    //     console.log("Nice Cock");
                    // });
                    // addFile(
                    //     `http://localhost:8080/papers/upload/fullPaperFile/${data.id}`,
                    //     formData
                    // ).then(() => {
                    //     console.log("Awsome Dick");
                    // });
                }
            );
        });
    }

    bindPostPaper(postPaperForm);

    // Add  File
    const addFile = async (url, data) => {
        let response = await fetch(url, {
            method: "POST",
            headers: {
                Authorization: token,
            },
            body: data,
        });

        if (!response.ok && response.status != 400) {
            throw new Error("Something wrong with upload File");
        }
        if (response.status == 400) {
            throw new Error("Файл уже добавлен!");
        }

        return response.status;
    };

    // User Info Modal
    const modalUserInfo = document.querySelector(".modalUserInfo");
    const modalUserInfoCloseBtn = document.querySelector(
        "#modalUserInfoCloseBtn"
    );

    modalUserInfoCloseBtn.addEventListener("click", () => {
        closeModal(modalUserInfo);
    });

    // Update User Info
    const changeUserInfoForm = document.querySelector(".changeUserInfoForm"),
        changeInputs = changeUserInfoForm.querySelectorAll("input");

    const updateUserInfo = async (url, data) => {
        let response = await fetch(url, {
            method: "PUT",
            headers: {
                Authorization: token,
                "Content-type": "application/json",
            },
            body: data,
        });

        if (!response.ok) {
            throw new Error(`Could not fetch ${url}, status: ${res.status}`);
        }

        return response.json();
    };

    function bindUpdateUserInfo(form) {
        form.addEventListener("submit", (e) => {
            e.preventDefault();
            let obj = {};
            changeInputs.forEach((item) => {
                if (item.value != "") {
                    obj[item.name] = item.value;
                }
            });

            const json = JSON.stringify(obj);

            updateUserInfo("http://localhost:8080/users/update", json)
                .then(() => {
                    console.log("Great!");
                    form.reset();
                    location.reload();
                })
                .catch(() => {
                    console.log("Not Great, something wrong!");
                    form.reset();
                });
        });
    }

    bindUpdateUserInfo(changeUserInfoForm);

    // Get Owned Paper
    const getOwnedPaper = async (url) => {
        const response = await fetch(url, {
            headers: {
                Authorization: token,
            },
        });

        return response.json();
    };

    getOwnedPaper("http://localhost:8080/papers/getOwned").then((data) => {
        getOwnedPaper(
            `http://localhost:8080/papers/getOwned?size=${data.totalElements}`
        ).then((data) => {
            console.log(`Hi, we have ${data.totalElements} papers`);
            const content = data.content;
            content.forEach((item) => {
                addPaper(
                    item.title,
                    item.authors,
                    item.participationForm,
                    item.abstractFileIsUploaded,
                    item.fullPaperIsUploaded,
                    item.id
                );
            });
        });
    });

    // Open Acordion With Paper Info
    // TODO: We will fix it
    let paper = document.querySelector(".accordionPaper");

    paper.addEventListener("click", function (e) {
        let accordion = e.target.closest(".accordion");
        if (!accordion) return; // Клик был не внутри аккордеона? Прервать функцию.

        let panel = accordion.nextElementSibling;
        let isVisible =
            (panel.style.display || getComputedStyle(panel).display) != "none";

        panel.style.display = isVisible ? "none" : "block";
    });

    paper.addEventListener("click", (e) => {
        let paperId = e.target.getAttribute("data-id");

        if (e.target.classList.contains("deletePaper")) {
            let i = confirm("Вы уверены, что хотите удалить доклад?");
            if (i) {
                deletePaper(
                    `http://localhost:8080/papers/delete/${paperId}`
                ).then(() => {
                    alert("Доклад успешно удалён");
                    location.reload();
                });
            }
        } else if (e.target.classList.contains("uploadAFile")) {
            openModal(modalAddAFile);
            localStorage.setItem("paperId", paperId);
        } else if (e.target.classList.contains("uploadFullFile")) {
            openModal(modalAddFullFile);
            localStorage.setItem("paperId", paperId);
        } else if (e.target.classList.contains("deleteAFile")) {
            let i = confirm("Вы уверены, что хотите удалить Abstract File?");
            if (i) {
                deletePaper(
                    `http://localhost:8080/papers/delete/abstractFile/${paperId}`
                ).then(() => {
                    alert("Abstract File успешно удалён");
                    location.reload();
                });
            }
        } else if (e.target.classList.contains("deleteFullFile")) {
            let i = confirm("Вы уверены, что хотите удалить Full Paper File?");
            if (i) {
                deletePaper(
                    `http://localhost:8080/papers/delete/fullPaperFile/${paperId}`
                ).then(() => {
                    alert("Full Paper File успешно удалён");
                    location.reload();
                });
            }
        }
    });

    // TODO: Put paper

    // Create Paper in Accordion
    function addPaper(
        title,
        authors,
        participationForm,
        abstractFile,
        fullPaper,
        paperId
    ) {
        const element = document.createElement("div");

        element.innerHTML = `
            <button class="accordion">${title}</button>
            <div class="panel">
                <p>Authors: ${authors}</p>
                <p>Participation Form: ${participationForm}</p>
                <p>Abstract File: ${checkFile(abstractFile)}</p>
                <p>Full Paper: ${checkFile(fullPaper)}</p>
                <button data-id="${paperId}" class="deletePaper">Delete paper</button>
                <button data-id="${paperId}" class="uploadAFile">Upload Abstract File</button>
                <button data-id="${paperId}" class="uploadFullFile">Upload Full Paper File</button>
                <button data-id="${paperId}" class="deleteAFile">Delete Abstract File</button>
                <button data-id="${paperId}" class="deleteFullFile">Delete Full Paper File</button>
                <button data-id="${paperId}" class="updatePaper">Update Paper</button>

            </div>
        `;

        paper.append(element);
    }

    const checkFile = (file) => {
        if (file == true) {
            return "Есть";
        } else {
            return "Нету";
        }
    };

    // Delete paper
    const deletePaper = async (url) => {
        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                Authorization: token,
            },
        });
    };

    // Upload Abstract File
    const modalAddAFile = document.querySelector(".modalAddAFile");
    const modalUploadAFileClose = modalAddAFile.querySelector(
        "#modalUploadAFileClose"
    );

    function bindAFile() {
        let AFileForm = document.querySelector(".AddAFile");
        let inputAFile = AFileForm.querySelector("#inpAbstractFile");
        AFileForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const path = localStorage.getItem("paperId");
            const formData = new FormData(AFileForm);
            formData.append("aFile", inputAFile.files[0]);

            addFile(
                `http://localhost:8080/papers/upload/abstractFile/${path}`,
                formData
            )
                .then(() => {
                    alert("Файл успешно загружен");
                })
                .catch((data) => {
                    alert(data);
                })
                .finally(() => {
                    AFileForm.reset();
                });
        });
    }

    bindAFile();

    modalUploadAFileClose.addEventListener("click", () => {
        closeModal(modalAddAFile);
        localStorage.removeItem("paperId");
        location.reload();
    });

    // Upload Full File
    const modalAddFullFile = document.querySelector(".modalAddFullFile");
    const modalUploadFullFileClose = document.querySelector(
        "#modalUploadFullFileClose"
    );

    modalUploadFullFileClose.addEventListener("click", () => {
        closeModal(modalAddFullFile);
        localStorage.removeItem("paperId");
        location.reload();
    });

    function bindFullFile() {
        let fullFileForm = document.querySelector(".AddFullFile");
        let inputFullFile = fullFileForm.querySelector("#inpFullFile");
        fullFileForm.addEventListener("submit", (e) => {
            e.preventDefault();

            const path = localStorage.getItem("paperId");
            const formData = new FormData(fullFileForm);
            formData.append("fullFile", inputFullFile.files[0]);

            addFile(
                `http://localhost:8080/papers/upload/fullPaperFile/${path}`,
                formData
            )
                .then(() => {
                    alert("Файл успешно загружен");
                })
                .catch((data) => {
                    alert(data);
                })
                .finally(() => {
                    fullFileForm.reset();
                });
        });
    }

    bindFullFile();

    // Change User Info
    const changeInfoBTN = document.querySelector("#changeInfo");

    changeInfoBTN.addEventListener("click", (e) => {
        e.preventDefault();
        openModal(modalUserInfo);
    });

    // Exit button
    const exitBTN = document.querySelector("#exitBTN");

    function backToIndex() {
        window.location.replace("../../index.html");
        localStorage.clear();
    }

    exitBTN.addEventListener("click", (e) => {
        e.preventDefault();
        backToIndex();
    });
});
