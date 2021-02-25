"use strict";
const token = localStorage.getItem("token");
const role = localStorage.getItem("role");

if (token) {
    if (role != "ADMIN") {
        window.location.href = "../../index.html";
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

            getAllTopics(`http://localhost:8080/topics/getAll`).then((data) =>
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

                    console.log(selectTopic.value);
                    getPapers(
                        `http://localhost:8080/papers/getByTopic/${selectTopic.value}`
                    ).then((data) => {
                        console.log(`Hi, we have ${data.totalElements} papers`);
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

            function download(dataurl, filename) {
                let a = document.createElement("a");
                a.href = dataurl;
                a.setAttribute("download", filename);
                a.click();
            }

            paper.addEventListener("click", (e) => {
                let paperId = e.target.getAttribute("data-id");

                if (e.target.classList.contains("downloadAFile")) {
                    // download(
                    //     `http://localhost:8080/papers/download/abstractFile/${paperId}`,
                    //     "rec"
                    // );
                    downloadFile(
                        `http://localhost:8080/papers/download/abstractFile/${paperId}`
                    ).then(() => {
                        console.log("hello");
                    });
                } else if (e.target.classList.contains("downloadFullFile")) {
                    downloadFile(
                        `http://localhost:8080/papers/download/fullPaperFile/${paperId}`
                    ).then(() => {
                        console.log("hello");
                    });
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
                const response = await fetch(url, {
                    method: "GET",
                    headers: {
                        Authorization: token,
                    },
                });

                if (!response.ok) {
                    throw new Error("Something wrong");
                }
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
}
