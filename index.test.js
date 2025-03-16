const { createPoll, embedPoll } = require("./index");

describe("createPoll", () => {
  test("should create a poll with question and options", () => {
    const pollId = "poll1";
    const pollQuestion = "What is your favorite color?";
    const pollOptions = ["Red", "Blue", "Green"];

    const pollElement = createPoll(pollId, pollQuestion, pollOptions);

    expect(pollElement).toBeInstanceOf(HTMLElement);
    expect(pollElement.querySelector("h2").textContent).toBe(pollQuestion);

    const buttons = pollElement.querySelectorAll(".option-button");
    expect(buttons.length).toBe(pollOptions.length);
    pollOptions.forEach((option, index) => {
      expect(buttons[index].textContent).toBe(option);
    });
  });

  test("should update votes correctly", () => {
    const pollId = "poll2";
    const pollQuestion = "Favorite food?";
    const pollOptions = ["Pizza", "Burger", "Pasta"];

    const pollElement = createPoll(pollId, pollQuestion, pollOptions);
    const buttons = pollElement.querySelectorAll(".option-button");

    expect(buttons.length).toBe(pollOptions.length);
    buttons[0].click();

    const storedVotes = JSON.parse(localStorage.getItem(pollId));
    expect(storedVotes).toEqual([1, 0, 0]);
  });

  test("should display the correct total votes count when votes exist", () => {
    const pollId = "poll7";
    const pollQuestion = "Favorite fruit?";
    const pollOptions = ["Apple", "Banana", "Orange"];

    const pollElement = createPoll(pollId, pollQuestion, pollOptions);
    const button = pollElement.querySelector(".option-button");
    button.click();

    const totalVotesEl = pollElement.querySelector(".total-vote");
    expect(totalVotesEl).toBeTruthy();
    expect(totalVotesEl.textContent).toBe("1 vote");
  });

  test("should allow undoing a vote correctly", () => {
    const pollId = "poll3";
    const pollQuestion = "Best programming language?";
    const pollOptions = ["JavaScript", "Python", "Java"];

    const pollElement = createPoll(pollId, pollQuestion, pollOptions);
    const buttons = pollElement.querySelectorAll(".option-button");
    buttons[0].click();

    let storedVotes = JSON.parse(localStorage.getItem(pollId));
    expect(storedVotes).toEqual([1, 0, 0]);

    const undoButton = pollElement.querySelector(".undo-btn");
    expect(undoButton).toBeTruthy();
    undoButton.click();

    storedVotes = JSON.parse(localStorage.getItem(pollId));
    expect(storedVotes).toEqual([0, 0, 0]);
  });
});

describe("embedPoll", () => {
  beforeEach(() => {
    document.body.innerHTML = "<div id='poll-container'></div>";
  });

  test("should embed unique polls", () => {
    const polls = [
      {
        pollId: "poll1",
        pollQuestion: "Question 1?",
        pollOptions: ["Yes", "No"],
      },
      { pollId: "poll2", pollQuestion: "Question 2?", pollOptions: ["A", "B"] },
      {
        pollId: "poll1",
        pollQuestion: "Duplicate Question 1?",
        pollOptions: ["Yes", "No"],
      },
    ];

    embedPoll("#poll-container", polls);

    const container = document.querySelector("#poll-container");
    expect(container.children.length).toBe(2);
  });

  test("should do nothing if target container does not exist", () => {
    document.body.innerHTML = "<div></div>";
    const polls = [
      {
        pollId: "poll1",
        pollQuestion: "Question?",
        pollOptions: ["Yes", "No"],
      },
    ];

    embedPoll("#non-existent-container", polls);

    expect(document.querySelector("#poll1")).toBeNull();
  });
});
