interface IPoll {
  pollId: string;
  pollQuestion: string;
  pollOptions: string[];
}

interface IActionHistory {
  pollId: string;
  index: number;
}

//update poll options in UI & local storage when poll options are edited
function updateLsData(data: number[], pollId: string, optionsLength: number) {
  let res: number[] = [];
  for (let i = 0; i < optionsLength; i++) {
    if (i < data?.length) {
      res.push(data[i]);
    } else {
      res.push(0);
    }
  }
  localStorage.setItem(pollId, JSON.stringify(res));
  return res;
}

function createPoll(
  pollId: string,
  pollQuestion: string,
  pollOptions: string[]
): HTMLElement {
  const containerEl = document.createElement("div");
  containerEl.setAttribute("id", `#${pollId}`);
  containerEl.classList.add("main-container");

  //get local storage data
  const currLocStorageData: number[] | undefined = JSON.parse(
    localStorage.getItem(pollId) || "[]"
  );

  //evaluate existing votes data
  const storedVotes: number[] = currLocStorageData
    ? currLocStorageData.length === pollOptions.length
      ? currLocStorageData
      : updateLsData(currLocStorageData, pollId, pollOptions.length)
    : Array(pollOptions.length).fill(0);

  //to track user action, refresh on page reload
  let actionHistory: IActionHistory[] = [];

  //to vote or undo user action
  function updatePoll(index: number, type: string): void {
    if (type === "add") {
      storedVotes[index]++;
      actionHistory = [...actionHistory, ...[{ pollId: pollId, index: index }]];
    } else {
      storedVotes[index]--;
      actionHistory = actionHistory.filter(
        (x: IActionHistory) => x.pollId !== pollId
      );
    }
    localStorage.setItem(pollId, JSON.stringify(storedVotes));
    renderPoll();
  }

  //update UI after user action
  function renderPoll(): void {
    containerEl.innerHTML = "";

    const questionEl = document.createElement("h2");
    questionEl.textContent = pollQuestion;
    containerEl.appendChild(questionEl);

    const totalVotes: number = storedVotes.reduce((a, b) => a + b, 0);
    //get current user vote data from memory
    const userVotedData: IActionHistory | undefined = actionHistory?.find(
      (x: IActionHistory) => x.pollId === pollId
    );

    if (userVotedData) {
      const resultsContainer = document.createElement("div");
      resultsContainer.setAttribute("id", `${pollId}_results`);
      resultsContainer.classList.add("mt-2");
      pollOptions.forEach((option, index) => {
        const percentage: number = totalVotes
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
        resultText.textContent = `${option}: ${
          storedVotes[index]
        } (${percentage.toFixed(1)}%) ${
          userVotedData?.index === index ? "\u2705" : ""
        }`;
        resultText.classList.add("result-text");

        resultBar.appendChild(progressBar);
        resultBar.appendChild(resultText);
        resultsContainer.appendChild(resultBar);
      });
      containerEl.appendChild(resultsContainer);
    } else {
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
      totalVotesEl.textContent = `${totalVotes} ${
        totalVotes > 1 ? "votes" : "vote"
      }`;
      totalVotesEl.classList.add("total-vote");
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

function embedPoll(selector: string, polls: IPoll[]): void {
  const targetContainerEl = document.querySelector(selector);

  if (targetContainerEl) {
    // get unique polls
    let uniquePolls = polls?.reduce((acc: IPoll[], curr: IPoll) => {
      if (!acc.some((item: IPoll) => item.pollId === curr.pollId)) {
        acc.push(curr);
      }
      return acc;
    }, []);

    //render polls
    uniquePolls.forEach(({ pollId, pollQuestion, pollOptions }) => {
      targetContainerEl.appendChild(
        createPoll(pollId, pollQuestion, pollOptions)
      );
    });
  }
}

declare global {
  interface Window {
    embedPoll: typeof embedPoll;
  }
}
window.embedPoll = embedPoll;

export { createPoll, embedPoll };
