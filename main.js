// https://opentdb.com/api.php?amount=10&category=21&difficulty=easy&type=multiple
const mainForm = document.querySelector("#trivia-form");
const mainQuestions = document.querySelector("#trivia-questions");
const progress = document.querySelector("#progress");
const progressBar = document.querySelector("#progress .progress-bar");
const progressOne = document.querySelector("#progressOne");
const progressBarOne = document.querySelector("#progressOne .progress-bar");

let questions;
let scorePositive = 0;
let scoreQuestion = 1;

let correctAnswer = [];

const allQuestions = [];

let aux = 1;

let contador = 0;

let blockAnswer = 0;
// contenedor preguntas
const boxQuestion = document.querySelector("#box-question");
// contenedor respuestas
const boxAnswer = document.querySelector("#box-answer");

const btNext = document.querySelector("#next");

const fetchDataAPI = (e) => {
	e.preventDefault();
	const number = 10;
	const category = document.querySelector("#selec-category").value;
	const difficulty = document.querySelector("#select-difficulty").value;
	const type = document.querySelector("#select-type").value;

	let API = `https://opentdb.com/api.php?amount=10`;
	const APICategory = `&category=${category}`;
	const APIDifficulty = `&difficulty=${difficulty}`;
	const APIType = `&type=${type}`;

	if (category !== "default") {
		API = `${API}${APICategory}`;
	}

	if (difficulty !== "default") {
		API = `${API}${APIDifficulty}`;
	}

	if (type !== "default") {
		API = `${API}${APIType}`;
	}

	hideForm();
	fetchAPI(API);
	addAnswer();
};

const hideForm = () => {
	mainForm.style.display = "none";
};

const addQuestion = (question) => {
	boxQuestion.innerHTML = `<p class="text-center fs-4 text-white">${
		contador + 1
	}. ${question}</p> `;
};

const addAnswer = () => {
	boxAnswer.classList += " my-4";
	progress.classList.remove("invisible");
	progressOne.classList.remove("invisible");
};

const fetchAPI = (url) => {
	fetch(url)
		.then((result) => result.json())
		.then((resultado) => fillQuestions(resultado.results))
		.catch((error) => console.log(error));
};

const fillQuestions = (allQuestions) => {
	console.log(allQuestions);
	if (allQuestions.length > 0) {
		questions = allQuestions;
		showQuestions();
	} else {
		mainQuestions.innerHTML = `<p class="fs-1 text-center text-white my-1 text-capitalize">there are no questions</p>`;
	}
};

const showQuestions = () => {
	let incorrectAnswer = [];

	questions.forEach((questions) => {
		correctAnswer.push(questions.correct_answer);
		incorrectAnswer.push(questions.incorrect_answers);
		if (aux == 1) {
			allQuestions.push(questions.question);
		}
	});
	aux++;

	let answerLenght = Object.values(questions[contador].incorrect_answers);

	if (answerLenght.length > 1) {
		let orderAnswer = [];
		orderAnswer.push(correctAnswer[contador]);
		orderAnswer.push(incorrectAnswer[contador][0]);
		orderAnswer.push(incorrectAnswer[contador][1]);
		orderAnswer.push(incorrectAnswer[contador][2]);
		orderAnswer.sort((a, b) => {
			return a - b;
		});
		boxAnswer.innerHTML = `<button onClick="handleCheckAnswer(this)" type="button" class="btn btn-primary mx-2">${orderAnswer[0]}</button>
        <button onClick="handleCheckAnswer(this)" type="button" class="btn btn-primary mx-2">${orderAnswer[1]}</button>
        <button onClick="handleCheckAnswer(this)" type="button" class="btn btn-primary mx-2">${orderAnswer[2]}</button>
        <button onClick="handleCheckAnswer(this)" type="button" class="btn btn-primary mx-2">${orderAnswer[3]}</button>`;
	} else {
		let orderAnswerTwo = [];
		orderAnswerTwo.push(correctAnswer[contador]);
		orderAnswerTwo.push(incorrectAnswer[contador][0]);
		orderAnswerTwo.sort((a, b) => {
			return a - b;
		});
		boxAnswer.innerHTML = `<button onClick="handleCheckAnswer(this)" type="button" class="btn btn-primary mx-2">${orderAnswerTwo[0]}</button>
        <button onClick="handleCheckAnswer(this)" type="button" class="btn btn-primary mx-2">${orderAnswerTwo[1]}</button>`;
	}
	addQuestion(allQuestions[contador]);
};

const handleCheckAnswer = (button) => {
	if (blockAnswer == 0) {
		if (button.innerText === correctAnswer[contador]) {
			button.style.backgroundColor = "white";
			button.style.color = "black";
			button.style.borderColor = "black";
			scorePositive++;
			btNext.style.display = "block";
		} else {
			button.style.backgroundColor = "white";
			button.style.color = "black";
			button.style.borderColor = "black";
			btNext.style.display = "block";
		}
	}
	progressQuestion();
	progressAnswer();

	blockAnswer = 1;
};

const progressQuestion = () => {
	let resolve = Math.trunc((scoreQuestion / allQuestions.length) * 100);
	progressBar.style.width = resolve + "%";
};

const progressAnswer = () => {
	let resolve = (scorePositive / allQuestions.length) * 100;
	progressBarOne.style.width = resolve + "%";
};

const handleNextQuestion = () => {
	btNext.style.display = "none";
	scoreQuestion++;
	if (blockAnswer > 0 || blockAnswer < 0) {
		blockAnswer = 0;
	}
	contador++;
	const number = 10;
	if (contador == number) {
		end();
	} else {
		showQuestions();
	}
};

const end = () => {
	mainQuestions.style.display = "none";
	const boxScore = document.querySelector("#score");
	boxScore.innerHTML += `<p class="fs-1 text-center text-white my-1 text-capitalize">score: ${scorePositive}</p>`;
};

const hideItems = () => {
	btNext.style.display = "none";
	progressOne.classList.add("invisible");
	progress.classList.add("invisible");
};


mainForm.onsubmit = fetchDataAPI;
window.onload = hideItems;
btNext.onclick = handleNextQuestion;
