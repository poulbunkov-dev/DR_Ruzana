// ==========================================
// ЛОГИКА ИГРЫ
// ==========================================
// Данные находятся в файле data.js (подключается ДО этого скрипта)

let currentStoryIndex = 0;
let score = 0;
let isAnswered = false;

// DOM элементы
const startScreen = document.getElementById("start-screen");
const gameScreen = document.getElementById("game-screen");
const resultScreen = document.getElementById("result-screen");
const endScreen = document.getElementById("end-screen");

const startBtn = document.getElementById("start-btn");
const nextBtn = document.getElementById("next-btn");

const scoreEl = document.getElementById("score");
const totalEl = document.getElementById("total");
const totalStoriesEl = document.getElementById("total-stories");
const storyNumberEl = document.getElementById("story-number");
const progressEl = document.getElementById("progress");

const storyTextEl = document.getElementById("story-text");
const storyImgEl = document.getElementById("story-img");
const answersContainer = document.getElementById("answers-container");

const resultCard = document.getElementById("result-card");
const resultTitle = document.getElementById("result-title");
const resultAuthor = document.getElementById("result-author");
const congratsBox = document.getElementById("congrats-box");
const congratsText = document.getElementById("congrats-text");

const finalScoreEl = document.getElementById("final-score");
const finalTotalEl = document.getElementById("final-total");
const finalMessage = document.getElementById("final-message");

// Инициализация
function init() {
  totalEl.textContent = gameData.length;
  totalStoriesEl.textContent = gameData.length;
  scoreEl.textContent = score;
}

// Перемешивание массива (чтобы кнопки были в разном порядке)
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Загрузка истории
function loadStory() {
  isAnswered = false;
  const story = gameData[currentStoryIndex];

  // Обновляем UI
  storyNumberEl.textContent = currentStoryIndex + 1;
  storyTextEl.textContent = story.text;
  storyImgEl.src = story.img;

  // Очищаем и создаем кнопки
  answersContainer.innerHTML = "";

  // Получаем уникальные имена всех друзей
  const allNames = [...new Set(gameData.map((s) => s.author))];
  // Перемешиваем их
  const shuffledNames = shuffleArray([...allNames]);

  // Создаем кнопки
  shuffledNames.forEach((name) => {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.innerHTML = `<i class="fa-regular fa-heart"></i> ${name}`;
    btn.onclick = () => checkAnswer(name);
    answersContainer.appendChild(btn);
  });

  // Показываем экран игры
  startScreen.classList.remove("active");
  resultScreen.classList.remove("active");
  gameScreen.classList.add("active");
}

// Проверка ответа
function checkAnswer(selectedName) {
  if (isAnswered) return;
  isAnswered = true;

  const currentStory = gameData[currentStoryIndex];
  const isCorrect = selectedName === currentStory.author;

  // Блокируем все кнопки
  const buttons = document.querySelectorAll(".answer-btn");
  buttons.forEach((btn) => (btn.disabled = true));

  setTimeout(() => {
    gameScreen.classList.remove("active");
    resultScreen.classList.add("active");

    resultCard.classList.remove("correct", "wrong");

    // Сброс картинки пожелания
    congratsText.innerHTML = "";
    const oldImg = document.getElementById("congrats-img");
    if (oldImg) oldImg.remove();

    if (isCorrect) {
      score++;
      scoreEl.textContent = score;
      const progressPercent = (score / gameData.length) * 100;
      progressEl.style.width = `${progressPercent}%`;

      resultCard.classList.add("correct");
      resultTitle.textContent = "Правильно! 🎉";
      resultAuthor.textContent = `Это был(а) ${currentStory.author}`;
    } else {
      resultCard.classList.add("wrong");
      resultTitle.textContent = "Увы, не угадала 😔";
      resultAuthor.textContent = `На самом деле это был(а) ${currentStory.author}`;
    }

    // Пожелание показывается ВСЕГДА (и при правильном, и при неправильном ответе)
    congratsText.textContent = currentStory.congrats || "----------";

    if (currentStory.congratsImg) {
      const img = document.createElement("img");
      img.id = "congrats-img";
      img.src = currentStory.congratsImg;
      img.alt = "Пожелание";
      img.className = "congrats-img";
      congratsBox.appendChild(img);
    }

    congratsBox.classList.add("visible");

    if (currentStoryIndex === gameData.length - 1) {
      nextBtn.innerHTML =
        'Узнать результаты <i class="fa-solid fa-trophy"></i>';
    } else {
      nextBtn.innerHTML =
        'Следующая история <i class="fa-solid fa-arrow-right"></i>';
    }
  }, 600);
}

// Следующий шаг
nextBtn.onclick = () => {
  currentStoryIndex++;

  if (currentStoryIndex < gameData.length) {
    loadStory();
  } else {
    // Конец игры
    resultScreen.classList.remove("active");
    endScreen.classList.add("active");

    finalScoreEl.textContent = score;
    finalTotalEl.textContent = gameData.length;

    if (score === gameData.length) {
      finalMessage.textContent =
        "Вау! Ты знаешь своих друзей на 100%! Ты настоящий телепат! 🧠✨";
    } else if (score >= gameData.length / 2) {
      finalMessage.textContent =
        "Отличный результат! Ты очень внимательный друг! ❤️";
    } else {
      finalMessage.textContent =
        "Есть над чем поработать! Но главное — вы вместе! 😄";
    }
  }
};

// ==========================================
// Увеличение фото (полароида) по клику
// Работает и на десктопе, и на телефоне
// ==========================================
document.addEventListener("click", (e) => {
  // Клик по полароиду — увеличить/уменьшить
  const polaroid = e.target.closest(".polaroid");
  if (polaroid) {
    polaroid.classList.toggle("zoomed");
    return;
  }

  // Клик по затемнённому фону — закрыть увеличенное фото
  const zoomed = document.querySelector(".polaroid.zoomed");
  if (zoomed && e.target === document.body) {
    zoomed.classList.remove("zoomed");
  }
});

// Старт игры
startBtn.onclick = () => {
  // shuffleArray(gameData); // убрать комент если нужен рандом
  init();
  loadStory();
};

// Первичная инициализация при загрузке страницы
init();
