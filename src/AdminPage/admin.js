"use strict";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (token) {
    if (role != "ADMIN") {
        window.location.href = "../../index.html";
        localStorage.clear();
    } else {
        window.addEventListener("DOMContentLoaded", () => {
            function clearBox(element) {
                document.querySelector(element).innerHTML = "";
            }
            // Get Topics
            const getAllTopics = async (url) => {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: token,
                    },
                });

                return response.json();
            };

            getAllTopics(`${MAIN_URL}/topics/getAll`).then((data) =>
                topicToSelect(data)
            );

            const selectTopic = document.querySelector(".selectTopic");

            function topicToSelect(data) {
                data.forEach((item) => {
                    selectTopic.append(new Option(item.name, item.id));
                });
            }

            // Get papers by topic

            const getPapers = async (url) => {
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: token,
                    },
                });

                if (!response.ok) {
                    throw new Error("Something wrong");
                }

                return response.json();
            };

            function getPapersByTopic() {
                selectTopic.addEventListener("change", (e) => {
                    e.preventDefault();

                    getPapers(
                        `${MAIN_URL}/papers/getByTopic/${selectTopic.value}`
                    ).then((data) => {
                        clearBox(".accordionPaper");
                        const content = data.content;
                        content.forEach((item) => {
                            addPaper(
                                item.title,
                                item.authors,
                                item.participationForm,
                                item.abstractFileIsUploaded,
                                item.fullPaperIsUploaded,
                                item.id,
                                item.ownerId
                            );
                        });
                    });
                });
            }

            getPapersByTopic();

            let paper = document.querySelector(".accordionPaper");

            paper.addEventListener("click", function (e) {
                let accordion = e.target.closest(".accordion");
                if (!accordion) return; // Клик был не внутри аккордеона? Прервать функцию.

                let panel = accordion.nextElementSibling;
                let isVisible =
                    (panel.style.display || getComputedStyle(panel).display) !=
                    "none";

                panel.style.display = isVisible ? "none" : "block";
            });

            paper.addEventListener("click", (e) => {
                let paperId = e.target.getAttribute("data-id");

                if (e.target.classList.contains("downloadAFile")) {
                    downloadFile(
                        `${MAIN_URL}/papers/download/abstractFile/${paperId}`
                    )
                        .then((response) => response.blob())
                        .then((blob) => {
                            const downloadUrl = window.URL.createObjectURL(
                                blob
                            );
                            const link = document.createElement("a");
                            link.href = downloadUrl;
                            link.setAttribute("download", "Abstract File");
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                        })
                        .catch((error) => alert(error));
                } else if (e.target.classList.contains("downloadFullFile")) {
                    downloadFile(
                        `${MAIN_URL}/papers/download/fullPaperFile/${paperId}`
                    )
                        .then((response) => response.blob())
                        .then((blob) => {
                            const downloadUrl = window.URL.createObjectURL(
                                blob
                            );
                            const link = document.createElement("a");
                            link.href = downloadUrl;
                            link.setAttribute("download", "Full Paper File");
                            document.body.appendChild(link);
                            link.click();
                            link.remove();
                        })
                        .catch((error) => alert(error));
                } else if (e.target.classList.contains("openInfoAboutAuthor")) {
                    const authorInfo = document.querySelector(".authorInfo");
                    const closeBtn = authorInfo.querySelector(".modal__close");

                    openModal(authorInfo);
                    getinfoAboutAuthors(`${MAIN_URL}/users/getInfo/${paperId}`)
                    .then((data) => {
                        createModalInfo(data);
                    })

                    closeBtn.addEventListener("click", () => {
                        closeModal(authorInfo);
                        clearBox(".userInfo");
                    })
                }
            });

            function addPaper(
                title,
                authors,
                participationForm,
                abstractFile,
                fullPaper,
                paperId,
                ownerId
            ) {
                const element = document.createElement("div");

                element.innerHTML = `
                    <button class="accordion">${title}</button>
                    <div class="panel">
                        <p>Authors: ${authors}</p>
                        <p>Participation Form: ${participationForm}</p>
                        <p>Abstract File: ${checkFile(abstractFile)}</p>
                        ${whatBtn(
                            abstractFile,
                            paperId,
                            "Abstract File",
                            "AFile"
                        )}
                        <p>Full Paper: ${checkFile(fullPaper)}</p>
                        ${whatBtn(
                            fullPaper,
                            paperId,
                            "Full Paper File",
                            "FullFile"
                        )}
                        <button data-id="${ownerId}" class="openInfoAboutAuthor">Check Info</button>
                    </div>
                `;

                paper.append(element);
            }

            const whatBtn = (file, id, name, className) => {
                if (file == true) {
                    return `<button data-id="${id}" class="download${className}">Download ${name}</button>
                    `;
                } else {
                    return `<div></div>`;
                }
            };

            const checkFile = (file) => {
                if (file == true) {
                    return "File uploaded";
                } else {
                    return "File is not uploaded";
                }
            };

            // Download File
            const downloadFile = async (url) => {
                let response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: token,
                    },
                    responseType: "blob",
                });

                if (!response.ok) {
                    throw new Error("Something wrong");
                }

                return response;
            };

            // Open modal with info about authors
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

            const getinfoAboutAuthors = async (url) => {
                let response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: token
                    }
                });

                return response.json();
            };

            const checkField = (field) => {
                return field == null || "" || undefined ? "No data found" 
                : field;
            };

            const createModalInfo = (data) => {
                const element = document.createElement("div");
                element.classList.add("userInfoDIV");

                element.innerHTML = `
                    Name:
                        <span>
                            ${data.name}
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
                        ${data.email}
                    </span>
                    <br>
                    `;
                document.querySelector(".userInfo").append(element);
            };

            // Exit button
            const exitBTN = document.querySelector(".exitBTN");

            function backToIndex() {
                window.location.replace("../../index.html");
                localStorage.clear();
            }

            exitBTN.addEventListener("click", (e) => {
                e.preventDefault();
                backToIndex();
            });
        });
    }
} else {
    window.location.href = "../../index.html";
    localStorage.clear();
}
