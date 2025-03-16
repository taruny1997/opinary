"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPoll = createPoll;
exports.embedPoll = embedPoll;
//update poll options in UI & local storage when poll options are edited
function updateLsData(data, pollId, optionsLength) {
    let res = [];
    for (let i = 0; i < optionsLength; i++) {
        if (i < (data === null || data === void 0 ? void 0 : data.length)) {
            res.push(data[i]);
        }
        else {
            res.push(0);
        }
    }
    localStorage.setItem(pollId, JSON.stringify(res));
    return res;
}
function createPoll(pollId, pollQuestion, pollOptions) {
    const containerEl = document.createElement("div");
    containerEl.classList.add("main-container");
    //get local storage data
    const currLocStorageData = JSON.parse(localStorage.getItem(pollId) || "[]");
    //evaluate existing votes data
    const storedVotes = currLocStorageData
        ? currLocStorageData.length === pollOptions.length
            ? currLocStorageData
            : updateLsData(currLocStorageData, pollId, pollOptions.length)
        : Array(pollOptions.length).fill(0);
    //to track user action, refresh on page reload
    let actionHistory = [];
    //to vote or undo user action
    function updatePoll(index, type) {
        if (type === "add") {
            storedVotes[index]++;
            actionHistory = [...actionHistory, ...[{ pollId: pollId, index: index }]];
        }
        else {
            storedVotes[index]--;
            actionHistory = actionHistory.filter((x) => x.pollId !== pollId);
        }
        localStorage.setItem(pollId, JSON.stringify(storedVotes));
        renderPoll();
    }
    //update UI after user action
    function renderPoll() {
        containerEl.innerHTML = "";
        const questionEl = document.createElement("h2");
        questionEl.textContent = pollQuestion;
        containerEl.appendChild(questionEl);
        const totalVotes = storedVotes.reduce((a, b) => a + b, 0);
        //get current user vote data from memory
        const userVotedData = actionHistory === null || actionHistory === void 0 ? void 0 : actionHistory.find((x) => x.pollId === pollId);
        if (userVotedData) {
            const resultsContainer = document.createElement("div");
            resultsContainer.setAttribute("id", `${pollId}_results`);
            resultsContainer.classList.add("mt-2");
            pollOptions.forEach((option, index) => {
                const percentage = totalVotes
                    ? (storedVotes[index] / totalVotes) * 100
                    : 0;
                const resultBar = document.createElement("div");
                resultBar.classList.add("result-bar");
                resultBar.setAttribute("id", `${pollId}_result_bar_${index}`);
                const progressBar = document.createElement("div");
                progressBar.setAttribute("id", `${pollId}_progress_bar_${index}`);
                progressBar.style.width = `${percentage}%`;
                progressBar.classList.add("progress-bar");
                const resultText = document.createElement("span");
                resultText.textContent = `${option}: ${storedVotes[index]} (${percentage.toFixed(1)}%) ${(userVotedData === null || userVotedData === void 0 ? void 0 : userVotedData.index) === index ? "\u2705" : ""}`;
                resultText.classList.add("result-text");
                resultBar.appendChild(progressBar);
                resultBar.appendChild(resultText);
                resultsContainer.appendChild(resultBar);
            });
            containerEl.appendChild(resultsContainer);
        }
        else {
            pollOptions.forEach((option, index) => {
                const optionButtonEl = document.createElement("button");
                optionButtonEl.textContent = option;
                optionButtonEl.classList.add("option-button");
                optionButtonEl.onclick = () => updatePoll(index, "add");
                containerEl.appendChild(optionButtonEl);
            });
        }
        const footerContainer = document.createElement("div");
        footerContainer.classList.add("flex", "justify-between", "mt-2");
        //show vote count if any user has voted
        if (totalVotes > 0) {
            const totalVotesEl = document.createElement("span");
            totalVotesEl.textContent = `${totalVotes} ${totalVotes > 1 ? "votes" : "vote"}`;
            totalVotesEl.style.color = "#a8a8a8";
            footerContainer.appendChild(totalVotesEl);
        }
        //show undo button once user has chosen an option
        if (userVotedData) {
            const undoBtnEl = document.createElement("button");
            undoBtnEl.textContent = "Undo";
            undoBtnEl.classList.add("undo-btn");
            undoBtnEl.onclick = () => updatePoll(userVotedData.index, "remove");
            footerContainer.appendChild(undoBtnEl);
        }
        containerEl.appendChild(footerContainer);
    }
    renderPoll();
    return containerEl;
}
function embedPoll(selector, polls) {
    const targetContainerEl = document.querySelector(selector);
    if (targetContainerEl) {
        // get unique polls
        let uniquePolls = polls === null || polls === void 0 ? void 0 : polls.reduce((acc, curr) => {
            if (!acc.some((item) => item.pollId === curr.pollId)) {
                acc.push(curr);
            }
            return acc;
        }, []);
        //render polls
        uniquePolls.forEach(({ pollId, pollQuestion, pollOptions }) => {
            targetContainerEl.appendChild(createPoll(pollId, pollQuestion, pollOptions));
        });
    }
}
