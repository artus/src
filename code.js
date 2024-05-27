const elements = {
  header: document.querySelector("header"),
  main: document.querySelector("main"),
};

class Questioning {
  constructor(set) {
    this.set = set;
    this.askedQuestions = [];
    this.solutions = set.solutions;
    this.history = [];
    this.score = 0;
    this.count = 0;
  }

  nextQuestion() {
    const questions = this.set.questions.filter(
      (question) => !this.askedQuestions.includes(question)
    );
    const question = questions[Math.floor(Math.random() * questions.length)];
    this.askedQuestions.push(question);
    return question;
  }

  answerQuestion(question, answer) {
    this.history.push({ question, answer });
    if (answer.correct) {
      this.score++;
    }
    this.count++;
  }
}

const displayHistory = (questioning) => {
  const title = document.createElement("h2");
  title.textContent = "History";

  // Reverse history so that most recent questions are displayed first
  const reversedHistory = [...questioning.history].reverse();

  for (const { question, answer } of reversedHistory) {
    const historyItem = document.createElement("section");
    const historyTitle = document.createElement("h3");
    historyTitle.textContent = question.question;
    const historyAnswers = document.createElement("ul");
    const selectedAnswer = answer;
    for (const answer of question.answers) {
      const isCorrect = answer.correct;
      const isIncorrect = !isCorrect && selectedAnswer === answer;
      const item = document.createElement("li");
      item.textContent = isCorrect
        ? `✅ ${answer.text}`
        : isIncorrect
        ? `❌ ${answer.text}`
        : answer.text;
      historyAnswers.appendChild(item);
    }
    historyItem.appendChild(historyTitle);
    historyItem.appendChild(historyAnswers);
    elements.main.appendChild(historyItem);
  }
};

const displayResults = (questioning) => {
  elements.main.innerHTML = "";
  const results = document.createElement("h2");
  results.textContent = `You got ${questioning.score} out of ${questioning.set.questions.length} correct!`;
  elements.main.appendChild(results);

  const button = document.createElement("button");
  button.textContent = "Try Again";
  button.addEventListener("click", () => displaySets());
  elements.main.appendChild(button);

  displayHistory(questioning);
};

const showSolutions = (questioning, question) => {
  elements.main.innerHTML = "";
  const button = document.createElement("button");
  button.textContent = "Back";
  button.addEventListener("click", () =>
    continueQuestions(questioning, question)
  );
  elements.main.appendChild(button);
  const img = document.createElement("img");
  img.src = questioning.solutions;
  elements.main.appendChild(img);
};

const continueQuestions = (questioning, nextQuestion) => {
  elements.main.innerHTML = "";
  const set = document.createElement("h2");
  set.textContent = questioning.set.name;
  elements.main.appendChild(set);
  const question = document.createElement("h3");
  question.textContent = nextQuestion.question;
  elements.main.appendChild(question);

  const solutions = document.createElement("button");
  solutions.textContent = "Show Solutions";
  solutions.addEventListener("click", () =>
    showSolutions(questioning, nextQuestion)
  );
  elements.main.appendChild(solutions);

  const answers = document.createElement("ul");
  const randomizedAnswers = nextQuestion.answers.sort(
    () => Math.random() - 0.5
  );

  for (const answer of randomizedAnswers) {
    const item = document.createElement("li");
    item.textContent = answer.text;
    item.addEventListener("click", () => {
      questioning.answerQuestion(nextQuestion, answer);
      if (questioning.count === questioning.set.questions.length) {
        displayResults(questioning);
      } else {
        displayNextQuestion(questioning);
        displayHistory(questioning);
      }
    });
    answers.appendChild(item);
  }

  elements.main.appendChild(answers);
};

const displayNextQuestion = (questioning) => {
  const nextQuestion = questioning.nextQuestion();
  continueQuestions(questioning, nextQuestion);
};

const displaySet = (set) => {
  const questioning = new Questioning(set);
  displayNextQuestion(questioning);
};

const displaySets = () => {
  elements.main.innerHTML = "";

  const title = document.createElement("h2");
  title.textContent = "Sets";

  const list = document.createElement("ul");

  for (const set of sets) {
    const item = document.createElement("li");
    item.textContent = `${set.name} - ${set.questions.length} questions`;
    item.addEventListener("click", () => displaySet(set));
    list.appendChild(item);
  }

  elements.main.appendChild(title);
  elements.main.appendChild(list);
};

displaySets();
