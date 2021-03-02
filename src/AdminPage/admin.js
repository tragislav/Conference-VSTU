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
                                item.id
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
                }
            });

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
