// --- script.js ---

// --- Configuration (Keep as is) ---
const QUESTIONS_PER_PAGE =15; // Number of questions per page
const EXPERIENCE_DIMENSION_KEY = 'experience';
const DIMENSIONS = { /* ... your dimensions ... */
    CT: { name: "Rowing Style", pole1: "Chopper", pole2: "Techie", score: 0, maxAbsScore: 0 },
    KG: { name: "Motivation", pole1: "Kicks", pole2: "Glory", score: 0, maxAbsScore: 0 },
    LW: { name: "Mindset", pole1: "Laid-back", pole2: "Way Too Deep", score: 0, maxAbsScore: 0 },
    IE: { name: "Team Dynamic", pole1: "Introvert", pole2: "Extrovert", score: 0, maxAbsScore: 0 },
    [EXPERIENCE_DIMENSION_KEY]: { name: "Experience Level", pole1: "Senior", pole2: "Novice", score: 0, maxAbsScore: 0 }
};
const LIKERT_VALUES_7_POINT = [-3, -2, -1, 0, 1, 2, 3, 0];
const LIKERT_LABELS_7_POINT_FULL = [ /* ... your labels ... */
    "Strongly Disagree", "Disagree", "Weakly Disagree", "Neutral",
    "Weakly Agree", "Agree", "Strongly Agree", "N/A"
];
const ALL_QUESTIONS = [
    {
        text: "I’m better at erging than rowing", contributions: [
            { dimension: 'CT', effect: -1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I do most of my UT2 on the bike/running", contributions: [
            { dimension: 'CT', effect: 0.5 },
            { dimension: 'KG', effect: 0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I enjoy rowing in a four", contributions: [
            { dimension: 'CT', effect: 1 },
            { dimension: 'LW', effect: -0.2},
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I enjoy rowing in a pair", contributions: [
            { dimension: 'CT', effect: 1 },
            { dimension: 'LW', effect: -0.3},
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I’m normally in middle 4", contributions: [
            { dimension: 'CT', effect: -2},
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I often don’t understand the coach", contributions: [
            { dimension: 'LW', effect: 1 },
            { dimension: 'CT', effect: -1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I can’t remember a thing the cox says", contributions: [
            { dimension: 'IE', effect: -0.2 },
            { dimension: 'CT', effect: -1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Square blades rowing is a good drill", contributions: [
            { dimension: 'KG', effect: 0.5},
            { dimension: 'CT', effect: 1},
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Stretching after sessions is essential", contributions: [
            { dimension: 'KG', effect: 0.3 },
            { dimension: 'CT', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I am more flexible than my crewmates", contributions: [
            { dimension: 'LW', effect: 0.2},
            { dimension: 'CT', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "My blade goes in early", contributions: [
                { dimension: 'LW', effect: 0.2},
                { dimension: 'CT', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Erg tests should be weight adjusted", contributions: [
            { dimension: 'LW', effect: 0.4},
            { dimension: 'CT', effect: 1 },
            { dimension: 'KG', effect: 0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Swaps are the best part about rowing", contributions: [
            { dimension: 'CT', effect: -1 },
            { dimension: 'IE', effect: 1 },
            { dimension: 'KG', effect: -0.5 },
            { dimension: 'LW', effect: -0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I shout “Yeah XXX” regularly", contributions: [
            { dimension: 'IE', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I get “Yeah XXX” shouted at me regularly", contributions: [
            { dimension: 'IE', effect: 2 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Tap-Turning is a drill", contributions: [
            { dimension: 'LW', effect: 2 },
            { dimension: 'CT', effect: 0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Hard ergs are kind of fun", contributions: [
            { dimension: 'CT', effect: -0.4 },
            { dimension: 'KG', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "My outside hand blisters are worse", contributions: [
            { dimension: 'CT', effect:-3},
        ], values: [3, 2, 1, 0, 1, 2, 3, 0] 
    },
    {
        text: "High rate feels better than paddling", contributions: [
            { dimension: 'CT', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I am guilty of back-seat coxing", contributions: [
            { dimension: 'CT', effect: 0.3 },
            { dimension: 'IE', effect: 0.5 },
            { dimension: 'LW', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "My college's results mean a lot to me", contributions: [
            { dimension: 'KG', effect: 1},
            { dimension: 'IE', effect: 0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "The boat race makes me jealous", contributions: [
            { dimension: 'LW', effect: 1 },
            { dimension: 'KG', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "The boat race inspires me", contributions: [
            { dimension: 'KG', effect: 2 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I strava every session", contributions: [
            { dimension: 'KG', effect: 2 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Video analysis is an essential part of rowing", contributions: [
            { dimension: 'KG', effect: 1 },
            { dimension: 'CT', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I would move any busy for rowing", contributions: [
            { dimension: 'KG', effect: 2 },
            { dimension: 'IE', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Rowing has affected how much I drink", contributions: [
            { dimension: 'KG', effect: 1 },
            { dimension: 'CT', effect: 0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I can’t leave this university without a blade", contributions: [
            { dimension: 'KG', effect: 1 },

        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I follow many college instagrams", contributions: [
            { dimension: 'IE', effect: 1 },
            { dimension: 'KG', effect: -0.1},
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I am in or aiming for my college’s first boat", contributions: [
            { dimension: 'KG', effect: 2 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I am or want to be a captain", contributions: [
            { dimension: 'KG', effect: 3 },
            { dimension: 'IE', effect: 1 },
            { dimension: 'LW', effect: 0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I have a long-term 5k goal", contributions: [
            { dimension: 'KG', effect: 2 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I’m terrified of getting injured", contributions: [
            { dimension: 'KG', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Losing a race ruins my day", contributions: [
            { dimension: 'KG', effect: 1 },
            { dimension: 'LW', effect: 0.1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I always erg warm-up", contributions: [
            { dimension: 'CT', effect: 1 },
            { dimension: 'KG', effect: 0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I humbly accept Lent morning sessions", contributions: [
            { dimension: 'KG', effect: 2 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "My crew appreciates me", contributions: [
            { dimension: 'LW', effect: -2 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I play fish game often", contributions: [
            { dimension: 'LW', effect: -1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Empachers are unfair on the cam", contributions: [
            { dimension: 'LW', effect: 3 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I speak a lot in the debrief", contributions: [
            { dimension: 'LW', effect: 1 },
            { dimension: 'IE', effect: 0.5 },
            { dimension: 'KG', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I zone out in the debrief", contributions: [
            { dimension: 'IE', effect: -1 },
            { dimension: 'KG', effect: 0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I would die for my cox", contributions: [
            { dimension: 'IE', effect: 1},
            { dimension: 'LW', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Coxes who haven’t rowed annoy me", contributions: [
            { dimension: 'LW', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I regularly disagree with coaches", contributions: [
            { dimension: 'LW', effect: 1 },
            { dimension: 'KG', effect: 0.5 },
            { dimension: 'CT', effect: -1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I’m in the top half of my boat", contributions: [
            { dimension: 'LW', effect: 1 },
            { dimension: 'CT', effect: -0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I belong in 3 seat", contributions: [
            { dimension: 'CT', effect: 5 },
            { dimension: 'LW', effect: -0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "My crew are lucky to have me", contributions: [
            { dimension: 'LW', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I get tense in races", contributions: [
            { dimension: 'KG', effect: 2 },
            { dimension: 'CT', effect: -1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Rowing regularly affects my mood", contributions: [
            { dimension: 'KG', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I have beef with certain other boats on the river", contributions: [
            { dimension: 'LW', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I have beef with other boats in my club", contributions: [
            { dimension: 'LW', effect: 2 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I could describe large chunks of the bumps chart", contributions: [
            { dimension: 'LW', effect: 0.4 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Sculling is more fun than sweeping", contributions: [
            { dimension: 'IE', effect: -1 },
            { dimension: 'CT', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I like subbing into other boats", contributions: [
            { dimension: 'IE', effect: 1 },
            { dimension: 'KG', effect: -1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "BCD is the highlight of my term", contributions: [
            { dimension: 'IE', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Post-BCD mash is the highlight of my term", contributions: [
            { dimension: 'IE', effect: 2 },
            { dimension: 'KG', effect: -1} ,
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I check rowbridge daily", contributions: [
            { dimension: 'LW', effect: 1 },
            { dimension: 'IE', effect: 0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "People should row every term they can", contributions: [
            { dimension: 'LW', effect: 1 },
            { dimension: 'KG', effect: 0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I leave the boathouse with people every session", contributions: [
            { dimension: 'IE', effect: 1.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I don’t know my crew that well", contributions: [
            { dimension: 'IE', effect: -1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I’ve talked about rowing with a supervisor", contributions: [
            { dimension: 'IE', effect: 1 },
            { dimension: 'LW', effect: 1},
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "My non-rowing friends tease me for rowing", contributions: [
            { dimension: 'IE', effect: 0.3 },
            { dimension: 'LW', effect: 0.5 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Custom Crew-stash is essential", contributions: [
            { dimension: 'LW', effect: 1 },
            { dimension: 'IE', effect: 2},
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I hate people yelling during my 2k", contributions: [
            { dimension: 'IE', effect: -1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I can’t UT2 alone", contributions: [
            { dimension: 'IE', effect: 2 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I can name everyone who rows at my college", contributions: [
            { dimension: 'IE', effect: 2 },
            { dimension: 'LW', effect: 1 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I know lots of town rowers", contributions: [
            { dimension: 'IE', effect: 1 },
            { dimension: 'LW', effect: 2 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "Race photos are the highlight of race day", contributions: [
            { dimension: 'IE', effect: 1 },
            { dimension: 'KG', effect: 2 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I study with crewmates", contributions: [
            { dimension: 'IE', effect: 3 },
        ], values: [...LIKERT_VALUES_7_POINT]
    },
    {
        text: "I prefer crew-wide feedback to individual", contributions: [
            { dimension: 'IE', effect: 2},
        ], values: [...LIKERT_VALUES_7_POINT]
    },
];

// --- Global State ---
let currentPageIndex = 0;
let userAnswers = [];

// --- DOM Elements ---
const introPage = document.getElementById('quiz-intro');
const questionsPage = document.getElementById('quiz-questions');
const resultsPage = document.getElementById('results-page');

const startBtn = document.getElementById('startBtn');
const prevBtn = document.getElementById('prev-btn');
const nextBtn = document.getElementById('next-btn');
const finishBtn = document.getElementById('finish-btn');
const restartBtn = document.getElementById('restartBtn');
const setNAButton = document.getElementById('set-na-btn');


const questionArea = document.getElementById('question-area');
const progressBar = document.getElementById('progress-bar');
const resultsContent = document.getElementById('results-content');
const resultsDescriptionBox = document.getElementById('results-description');

// --- Helper function to switch active page ---
function setActivePage(activePageId) {
    // Hide all pages
    introPage.classList.remove('active');
    questionsPage.classList.remove('active');
    resultsPage.classList.remove('active');

    // Show the target page
    const pageToShow = document.getElementById(activePageId);
    if (pageToShow) {
        pageToShow.classList.add('active');
    }
}

// --- Core Functions ---
function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]]; // Swap elements
    }
}

function initializeQuizState() {
    shuffleArray(ALL_QUESTIONS);
    currentPageIndex = 0;
    userAnswers = ALL_QUESTIONS.map(() => ({ selectedOptionIndex: null }));

    for (const dimKey in DIMENSIONS) {
        DIMENSIONS[dimKey].score = 0;
        if (dimKey !== EXPERIENCE_DIMENSION_KEY) {
            DIMENSIONS[dimKey].maxAbsScore = 0;
        }
    }
    ALL_QUESTIONS.forEach(question => {
        const maxAbsLikertValue = Math.max(...question.values.slice(0, 7).map(val => Math.abs(val)));
        question.contributions.forEach(contrib => {
            if (DIMENSIONS[contrib.dimension] && contrib.dimension !== EXPERIENCE_DIMENSION_KEY) {
                DIMENSIONS[contrib.dimension].maxAbsScore += maxAbsLikertValue * Math.abs(contrib.effect);
            }
        });
    });
    if (DIMENSIONS[EXPERIENCE_DIMENSION_KEY]) {
        DIMENSIONS[EXPERIENCE_DIMENSION_KEY].maxAbsScore = ALL_QUESTIONS.length > 0 ? ALL_QUESTIONS.length / 2 : 1;
        if (DIMENSIONS[EXPERIENCE_DIMENSION_KEY].maxAbsScore === 0 && ALL_QUESTIONS.length > 0) {
            DIMENSIONS[EXPERIENCE_DIMENSION_KEY].maxAbsScore = 1;
        }
    }
    updateProgressBar(); // Reset progress bar visually
    setActivePage('quiz-intro'); // STEP 0: Show only intro
}

function startQuiz() {
    setActivePage('quiz-questions'); // STEP 1: Show questions
    renderCurrentPage();
    updateNavigationButtons();
    updateProgressBar(); // Start progress
}

// Helper function (place it before renderCurrentPage or globally in your script)
function createScalePointListener(qIndexGlobal, optionIdx, answersArray, progressBarUpdater) {
    return function () { // This is the function that will be the event listener
        console.log(`Scale point clicked for Q${qIndexGlobal}. Option index: ${optionIdx}`);
        answersArray[qIndexGlobal] = {
            questionIndex: qIndexGlobal,
            selectedOptionIndex: optionIdx
        };
        progressBarUpdater();
    };
}

function createNAListener(qIndexGlobal, naOptIdx, answersArray, progressBarUpdater) {
    return function () {
        console.log(`N/A clicked for Q${qIndexGlobal}. Option index: ${naOptIdx}`);
        answersArray[qIndexGlobal] = {
            questionIndex: qIndexGlobal,
            selectedOptionIndex: naOptIdx
        };
        progressBarUpdater();
    };
}


// --- In script.js ---

function renderCurrentPage() {
    questionArea.innerHTML = '';
    const startIndex = currentPageIndex * QUESTIONS_PER_PAGE;
    const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, ALL_QUESTIONS.length);
    const pageQuestions = ALL_QUESTIONS.slice(startIndex, endIndex);

    pageQuestions.forEach((q, indexOnPage) => {
        const questionIndexGlobal = startIndex + indexOnPage;
        const questionDiv = document.createElement('div');
        questionDiv.classList.add('question');
        questionDiv.innerHTML = `<p class="question-text">${questionIndexGlobal + 1}. ${q.text}</p>`;

        const optionsWrapper = document.createElement('div');
        optionsWrapper.classList.add('options-wrapper-horizontal'); // This will now control layout for all states

        // "Disagree" and "Agree" labels are direct children again
        const disagreeLabel = document.createElement('span');
        disagreeLabel.classList.add('scale-end-label', 'disagree-end');
        disagreeLabel.textContent = "Disagree";
        optionsWrapper.appendChild(disagreeLabel); // Append directly

        const agreeLabel = document.createElement('span');
        agreeLabel.classList.add('scale-end-label', 'agree-end');
        agreeLabel.textContent = "Agree";
        optionsWrapper.appendChild(agreeLabel); // Append directly


        const scalePointsContainer = document.createElement('div');
        scalePointsContainer.classList.add('scale-points-container');
        // ... (dot creation logic for the 7 scale points - REMAINS THE SAME) ...
        for (let i = 0; i < 7; i++) {
            const pointDiv = document.createElement('div');
            pointDiv.classList.add('scale-point');
            if (i === 0 || i === 6) pointDiv.classList.add('strong');
            else if (i === 1 || i === 5) pointDiv.classList.add('medium');
            else if (i === 2 || i === 4) pointDiv.classList.add('weak');
            const radioButton = document.createElement('input');
            radioButton.type = 'radio';
            radioButton.name = `question_${questionIndexGlobal}`;
            radioButton.value = i;
            radioButton.id = `q${questionIndexGlobal}_opt${i}`;
            radioButton.checked = (userAnswers[questionIndexGlobal] && userAnswers[questionIndexGlobal].selectedOptionIndex === i);
            radioButton.setAttribute('aria-label', LIKERT_LABELS_7_POINT_FULL[i]);
            radioButton.addEventListener('change',
                createScalePointListener(questionIndexGlobal, i, userAnswers, updateProgressBar)
            );
            const radioLabel = document.createElement('label');
            radioLabel.setAttribute('for', radioButton.id);
            radioLabel.classList.add('dot-label');
            pointDiv.appendChild(radioButton);
            pointDiv.appendChild(radioLabel);
            scalePointsContainer.appendChild(pointDiv);
        }
        optionsWrapper.appendChild(scalePointsContainer); // Append directly


        // N/A Option (remains the same, direct child)
        const naDiv = document.createElement('div');
        naDiv.classList.add('na-option');
        // ... (N/A creation logic - REMAINS THE SAME) ...
        const naOptionIndex = 7;
        const naRadioButton = document.createElement('input');
        naRadioButton.type = 'radio';
        naRadioButton.name = `question_${questionIndexGlobal}`;
        naRadioButton.value = naOptionIndex;
        naRadioButton.id = `q${questionIndexGlobal}_opt${naOptionIndex}`;
        naRadioButton.checked = (userAnswers[questionIndexGlobal] && userAnswers[questionIndexGlobal].selectedOptionIndex === naOptionIndex);
        naRadioButton.setAttribute('aria-label', LIKERT_LABELS_7_POINT_FULL[naOptionIndex]);
        naRadioButton.addEventListener('change',
            createNAListener(questionIndexGlobal, naOptionIndex, userAnswers, updateProgressBar)
        );
        const naRadioLabel = document.createElement('label');
        naRadioLabel.setAttribute('for', naRadioButton.id);
        naRadioLabel.classList.add('na-dot-label');
        naRadioLabel.textContent = "N/A";
        naDiv.appendChild(naRadioButton);
        naDiv.appendChild(naRadioLabel);
        optionsWrapper.appendChild(naDiv); // Append directly

        questionDiv.appendChild(optionsWrapper);
        questionArea.appendChild(questionDiv);
    });
}

function updateNavigationButtons() {
    prevBtn.style.display = currentPageIndex > 0 ? 'inline-block' : 'none';
    const isLastPage = (currentPageIndex + 1) * QUESTIONS_PER_PAGE >= ALL_QUESTIONS.length;
    nextBtn.style.display = isLastPage ? 'none' : 'inline-block';
    finishBtn.style.display = isLastPage ? 'inline-block' : 'none';
    setNAButton.style.display = (currentPageIndex * QUESTIONS_PER_PAGE < ALL_QUESTIONS.length) ? 'inline-block' : 'none';
}

function updateProgressBar() {
    const answeredQuestions = userAnswers.filter(answer => answer.selectedOptionIndex !== null).length;
    const totalQuestions = ALL_QUESTIONS.length;
    const progressPercentage = totalQuestions > 0 ? (answeredQuestions / totalQuestions) * 100 : 0;
    progressBar.style.width = `${progressPercentage}%`;
    progressBar.textContent = `${Math.round(progressPercentage)}%`;
}

function nextPageHandler() {
    if (!validatePageAnswers()) {
        alert("Please answer all questions on this page before proceeding. You can select N/A if a question doesn't apply.");
        return;
    }
    if ((currentPageIndex + 1) * QUESTIONS_PER_PAGE < ALL_QUESTIONS.length) {
        currentPageIndex++;
        renderCurrentPage();
        updateNavigationButtons();
        updateProgressBar(); // Already updates, but good to be explicit
        window.scrollTo(0, 0);
    }
}

function prevPageHandler() {
    if (currentPageIndex > 0) {
        currentPageIndex--;
        renderCurrentPage();
        updateNavigationButtons();
        // updateProgressBar(); // Progress doesn't change going back usually
        window.scrollTo(0, 0);
    }
}

function validatePageAnswers() {
    const startIndex = currentPageIndex * QUESTIONS_PER_PAGE;
    const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, ALL_QUESTIONS.length);
    for (let i = startIndex; i < endIndex; i++) {
        if (userAnswers[i]?.selectedOptionIndex === null || userAnswers[i]?.selectedOptionIndex === undefined) {
            return false;
        }
    }
    return true;
}

function calculateResults() {
    for (const dimKey in DIMENSIONS) { DIMENSIONS[dimKey].score = 0; }
    let naCount = 0;
    userAnswers.forEach(answer => {
        if (answer.selectedOptionIndex !== null) {
            const question = ALL_QUESTIONS[answer.questionIndex];
            const selectedOptionValue = question.values[answer.selectedOptionIndex];
            const naOptionIndexInQuestion = question.values.length - 1;
            if (answer.selectedOptionIndex === naOptionIndexInQuestion) {
                naCount++;
            } else {
                question.contributions.forEach(contrib => {
                    if (DIMENSIONS[contrib.dimension] && contrib.dimension !== EXPERIENCE_DIMENSION_KEY) {
                        DIMENSIONS[contrib.dimension].score += selectedOptionValue * contrib.effect;
                    }
                });
            }
        }
    });
    if (DIMENSIONS[EXPERIENCE_DIMENSION_KEY]) {
        if (ALL_QUESTIONS.length > 0) {
            DIMENSIONS[EXPERIENCE_DIMENSION_KEY].score = naCount - (ALL_QUESTIONS.length / 2);
        } else {
            DIMENSIONS[EXPERIENCE_DIMENSION_KEY].score = 0;
        }
    }
}

function showResults() { // Renamed from showResultsPage for clarity
    if (!validatePageAnswers()) {
        alert("Please answer all questions on this page before finishing.");
        return;
    }
    calculateResults();
    setActivePage('results-page'); // STEP 2: Show results

    resultsContent.innerHTML = '';
    if (resultsDescriptionBox) resultsDescriptionBox.innerHTML = '';

    for (const dimKey in DIMENSIONS) {
        const dimension = DIMENSIONS[dimKey];
        if (dimKey === EXPERIENCE_DIMENSION_KEY) {
            const experienceResult = document.createElement('div');
            experienceResult.classList.add('dimension-result');
            const experienceType = dimension.score <= 0 ? "Senior" : "Novice";
            experienceResult.innerHTML = `<h4>${dimension.name}</h4><p>You are classified as: <strong>${experienceType}</strong></p>`;
            resultsContent.appendChild(experienceResult);
            continue; // Skip the slider rendering for this dimension
        }
        let percentageLean = 0;
        let dominantPoleName = "Balanced";
        let pole1Percentage = 50;
        let pole2Percentage = 50;
        if (dimension.maxAbsScore > 0) {
            const normalizedScore = dimension.score / dimension.maxAbsScore;
            pole1Percentage = Math.max(0, Math.min(100, 50 - (normalizedScore * 50)));
            pole2Percentage = Math.max(0, Math.min(100, 50 + (normalizedScore * 50)));
            if (dimension.score < 0) { dominantPoleName = dimension.pole1; percentageLean = Math.round(Math.abs(normalizedScore) * 100); }
            else if (dimension.score > 0) { dominantPoleName = dimension.pole2; percentageLean = Math.round(normalizedScore * 100); }
        } else if (dimension.score === 0) { percentageLean = 0; dominantPoleName = "Balanced"; }
        percentageLean = Math.max(0, Math.min(100, percentageLean));
        const resultDiv = document.createElement('div');
        resultDiv.classList.add('dimension-result');
        resultDiv.innerHTML = `<h4>${dimension.name}</h4><div class="result-labels"><span class="pole-label pole1">${dimension.pole1}</span><span class="pole-percentage">${dominantPoleName !== "Balanced" ? percentageLean + "% " + dominantPoleName : "Balanced"}</span><span class="pole-label pole2">${dimension.pole2}</span></div><div class="result-bar-container"><div class="bar-track"><div class="bar-segment bar-pole1" style="width: ${pole1Percentage}%;"></div><div class="bar-segment bar-pole2" style="width: ${pole2Percentage}%;"></div></div></div>`;
        resultsContent.appendChild(resultDiv);
    }
    displayRowerTypeDescription();
    window.scrollTo(0, 0);
}

// --- In script.js ---

// ... (DIMENSIONS, ALL_QUESTIONS, etc. remain the same) ...
// The ROWER_ARCHETYPES object will now be available globally because descriptions.js is loaded first.

function displayRowerTypeDescription() {
    if (!resultsDescriptionBox) return;

    // 1. Determine the dominant pole for each of the 5 dimensions
    let stylePole = (DIMENSIONS['CT'].score < 0) ? 'C' : 'T';
    let motivationPole = (DIMENSIONS['KG'].score < 0) ? 'K' : 'G'; // P for Power, N for eNdurance
    let mindsetPole = (DIMENSIONS['LW'].score < 0) ? 'L' : 'W';
    let socialPole = (DIMENSIONS['IE'].score < 0) ? 'I' : 'E'; // S for Sculler, C for Crew

    // For experience, pole1 is "Senior", pole2 is "Novice"
    // Score: -totalQ/2 (Senior) to +totalQ/2 (Novice)


    // A threshold can be useful for "balanced" cases if scores are very close to 0
    // For simplicity now, we'll just use strict < 0 or >= 0.
    // Example with threshold:
    // const threshold = 0.1 * DIMENSIONS['focus'].maxAbsScore; // 10% threshold
    // if (DIMENSIONS['focus'].score < -threshold) focusPole = 'E';
    // else if (DIMENSIONS['focus'].score > threshold) focusPole = 'W';
    // else focusPole = 'B'; // 'B' for Balanced - you'd need keys like "BPNCS_S"

    // 2. Construct the archetype key
    const archetypeKey = `${stylePole}${motivationPole}${mindsetPole}${socialPole}`;
    console.log("Generated Archetype Key:", archetypeKey); // For debugging

    // 3. Retrieve the description
    let archetypeData = ROWER_ARCHETYPES[archetypeKey];

    if (!archetypeData) {
        console.warn(`No archetype found for key: ${archetypeKey}. Using default.`);
        archetypeData = ROWER_ARCHETYPES["DEFAULT"] || { title: "Unique Rower", paragraph: "Your profile is unique!" };
    }

    // 4. Display the description
    resultsDescriptionBox.innerHTML = `
        <h3>${archetypeData.title}</h3>
        <p>${archetypeData.paragraph.replace(/\n/g, '<br>')}</p> 
    `; // Added .replace for newlines in paragraph
}

// ... (rest of your script.js: initializeQuizState, startQuiz, showResults, etc.)
// Make sure showResults calls displayRowerTypeDescription()

function setUnansweredToNA() {
    const startIndex = currentPageIndex * QUESTIONS_PER_PAGE;
    const endIndex = Math.min(startIndex + QUESTIONS_PER_PAGE, ALL_QUESTIONS.length);

    for (let i = startIndex; i < endIndex; i++) {
        if (userAnswers[i]?.selectedOptionIndex === null || userAnswers[i]?.selectedOptionIndex === undefined) {
            const naOptionIndex = ALL_QUESTIONS[i].values.length - 1; // N/A is the last option
            userAnswers[i] = {
                questionIndex: i,
                selectedOptionIndex: naOptionIndex
            };

            // Automatically check the N/A radio button in the UI
            const naRadioButton = document.getElementById(`q${i}_opt${naOptionIndex}`);
            if (naRadioButton) {
                naRadioButton.checked = true;
            }
        }
    }

    updateProgressBar(); // Update the progress bar after setting N/A
}


function restartQuizHandler() {
    initializeQuizState(); // This sets active page to intro
}

// --- Event Listeners ---
document.addEventListener('DOMContentLoaded', () => {
    if (!ALL_QUESTIONS || ALL_QUESTIONS.length === 0) {
        console.error("No questions defined!");
        if (questionArea) questionArea.innerHTML = "<p>Error: Quiz questions not loaded.</p>";
        if (startBtn) startBtn.disabled = true;
        return;
    }

    startBtn.addEventListener('click', startQuiz);
    nextBtn.addEventListener('click', nextPageHandler);
    prevBtn.addEventListener('click', prevPageHandler);
    finishBtn.addEventListener('click', showResults);
    restartBtn.addEventListener('click', restartQuizHandler);
    setNAButton.addEventListener('click', setUnansweredToNA); // Attach the event listener

    initializeQuizState(); // Set initial state
});