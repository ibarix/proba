// Variables to hold references to HTML elements
const scenarioArea = document.getElementById('scenario-area');
const optionsArea = document.getElementById('options-area');
const feedbackArea = document.getElementById('feedback-area');
const scoreArea = document.getElementById('score-area');
const nextButton = document.getElementById('next-button');

// Variable to store the current score
let currentScore = 0;
// Variable to store the current scenario index
let currentScenarioIndex = 0;

// Array to hold game data (scenarios, questions, answers)
const gameData = [
    {
        scenario: "You receive an email with the subject 'Urgent: Action Required - Your University Account'. It claims suspicious activity was detected and asks you to click a link to verify your login credentials immediately. The sender's email address is 'admin@university-security-alerts.com' instead of the usual '@youruniversity.edu'.",
        question: "What is the safest action to take?",
        options: [
            "Click the link and log in to secure your account quickly.",
            "Reply to the email asking for more information.",
            "Ignore the email; it's probably not important.",
            "Do not click the link. Open a new browser tab, go to the official university website, log in there, and check for any notifications. Report the email as phishing."
        ],
        correctAnswer: "Do not click the link. Open a new browser tab, go to the official university website, log in there, and check for any notifications. Report the email as phishing.",
        feedback_correct: "Correct! This is likely a phishing attempt. Scammers create fake urgency and use slightly off email addresses. Always access sensitive accounts through official websites or apps directly, not through links in unsolicited emails. Reporting it helps protect others.",
        feedback_incorrect: "Incorrect. Clicking links or replying to phishing emails can expose your credentials or lead to malware. Always verify directly with the institution through their official contact channels, not the ones provided in a suspicious email."
    },
    {
        scenario: "A new friend request appears on your favorite social media platform from someone who looks familiar, but you don't quite remember them. Their profile has very few posts, mostly recent, and a low friend count. Soon after you accept, they message you asking for your phone number and home address because they 'lost their contacts' and want to send you something.",
        question: "How should you respond to this message?",
        options: [
            "Provide the information; they seem nice and it's just a phone number and address.",
            "Ask them more questions to try and figure out who they are.",
            "Politely decline to share the information and consider removing them as a friend.",
            "Give them a fake phone number and address to see what they do."
        ],
        correctAnswer: "Politely decline to share the information and consider removing them as a friend.",
        feedback_correct: "Correct! This could be a fake profile or a compromised account. Be cautious about sharing personal information online, especially with new or unverified contacts. It's okay to decline and protect your privacy. Look for red flags like sparse profiles.",
        feedback_incorrect: "Incorrect. Sharing personal details like your phone number and address with unverified online contacts is risky. Even asking too many questions can sometimes reveal information. It's best to err on the side of caution with new online 'friends'."
    },
    {
        scenario: "You're signing up for a new online forum related to one of your hobbies. When creating your account, it asks for a username and password. You're tempted to use the same password you use for your email and online banking to make it easier to remember.",
        question: "What is the best practice for creating a password for this new forum?",
        options: [
            "Use the same password as your email and banking for convenience.",
            "Use a slightly different version of your common password (e.g., adding a '1' at the end).",
            "Create a strong, unique password for this forum, ideally using a password manager to store it.",
            "Use a very simple, easy-to-guess password because the forum isn't important."
        ],
        correctAnswer: "Create a strong, unique password for this forum, ideally using a password manager to store it.",
        feedback_correct: "Correct! Using unique, strong passwords for each account is crucial. If one site is breached, your other accounts remain safe. Password managers can generate and store complex passwords, making this practice much easier.",
        feedback_incorrect: "Incorrect. Reusing passwords, even with minor variations, is a major security risk. If a less secure site like a forum is breached and you've reused your password, attackers can try that password on more sensitive accounts like email or banking."
    },
    {
        scenario: "You're at a local coffee shop and connect to their free public Wi-Fi to check your bank balance and pay a bill online. The Wi-Fi network is open and doesn't require a password.",
        question: "What is the main security concern with this action?",
        options: [
            "The Wi-Fi might be slow, making the transaction take longer.",
            "Someone could easily intercept your data on an unsecured public Wi-Fi network.",
            "You might get distracted and make a mistake with the payment.",
            "There's no concern; public Wi-Fi is generally safe for these activities."
        ],
        correctAnswer: "Someone could easily intercept your data on an unsecured public Wi-Fi network.",
        feedback_correct: "Correct! Unsecured public Wi-Fi networks are risky for sensitive transactions. Attackers can intercept data sent over these networks. It's best to use a VPN or wait until you have a secure, trusted internet connection (like your home Wi-Fi or mobile data) for banking.",
        feedback_incorrect: "Incorrect. The primary risk of using open public Wi-Fi for sensitive information like banking is data interception by malicious actors, not slow speeds or distractions. Always assume public Wi-Fi is not secure."
    },
    {
        scenario: "You're browsing an online store you've never used before. The prices are incredibly low, almost too good to be true. You notice the website URL starts with 'http://' instead of 'https://', and there are a few grammatical errors in the product descriptions.",
        question: "What should these signs indicate to you?",
        options: [
            "You've found a great bargain and should buy quickly before the deals are gone.",
            "The website is likely new and still working out some minor issues.",
            "These are red flags for a potentially unsafe or fraudulent website; you should avoid making a purchase.",
            "You should contact their customer service to ask about the HTTPS and errors."
        ],
        correctAnswer: "These are red flags for a potentially unsafe or fraudulent website; you should avoid making a purchase.",
        feedback_correct: "Correct! Lack of HTTPS (the 's' indicates a secure connection), very low prices, and poor grammar are common signs of scam websites. Your financial information would not be secure, and you might not receive the products. Trust your instincts if a site feels off.",
        feedback_incorrect: "Incorrect. While contacting customer service is an option, the combination of these red flags (especially no HTTPS for a store) strongly suggests you should not trust the site with your payment information or expect legitimate products."
    },
    {
        scenario: "You receive a notification on your phone that your password for a social media app was successfully changed. However, you didn't change it. You also remember using that same password for several other online accounts.",
        question: "What is the most important first step to take?",
        options: [
            "Ignore it, it might be a system glitch.",
            "Immediately try to log into the affected social media account and change the password back. Then, change the passwords on ALL other accounts that used the same or similar password.",
            "Delete the social media app from your phone.",
            "Post on social media asking if anyone else got a similar notification."
        ],
        correctAnswer: "Immediately try to log into the affected social media account and change the password back. Then, change the passwords on ALL other accounts that used the same or similar password.",
        feedback_correct: "Correct! This is a sign your account may be compromised. Prioritize regaining control of the affected account and then immediately change passwords on all other services where you used the same or similar password to prevent further unauthorized access. Enable two-factor authentication wherever possible.",
        feedback_incorrect: "Incorrect. Ignoring such a notification or simply deleting the app doesn't address the potential compromise of your account or the risk to other accounts using the same password. Swift action to secure your accounts is key."
    }
];

// Function to display a scenario
function displayScenario(scenarioIndex) {
    if (scenarioIndex >= gameData.length) {
        scenarioArea.innerHTML = `<h2>Game Over!</h2><p>You have completed all scenarios.</p><p>Your final score is: ${currentScore} out of ${gameData.length}</p>`;
        optionsArea.innerHTML = "";
        feedbackArea.innerHTML = "";
        feedbackArea.style.display = 'none';
        nextButton.style.display = 'none';
        return;
    }

    const currentScenario = gameData[scenarioIndex];
    scenarioArea.innerHTML = `<p><strong>Scenario:</strong> ${currentScenario.scenario}</p><p><strong>Question:</strong> ${currentScenario.question}</p>`;
    
    optionsArea.innerHTML = ""; 
    feedbackArea.innerHTML = ""; 
    feedbackArea.style.display = 'none';

    currentScenario.options.forEach(option => {
        const button = document.createElement('button');
        button.textContent = option;
        button.classList.add('option-button');
        button.addEventListener('click', () => checkAnswer(option, scenarioIndex));
        optionsArea.appendChild(button);
    });

    nextButton.textContent = "Next Question";
    nextButton.style.display = 'none'; 
}

// Function to check the selected answer
function checkAnswer(selectedOption, scenarioIndex) {
    const currentScenario = gameData[scenarioIndex];
    feedbackArea.style.display = 'block'; 

    // Clear previous classes and add new one
    feedbackArea.classList.remove('correct', 'incorrect');

    if (selectedOption === currentScenario.correctAnswer) {
        feedbackArea.textContent = currentScenario.feedback_correct;
        feedbackArea.classList.add('correct'); 
        currentScore++;
        scoreArea.textContent = `Score: ${currentScore}`;
    } else {
        feedbackArea.textContent = currentScenario.feedback_incorrect;
        feedbackArea.classList.add('incorrect');
    }

    const optionButtons = optionsArea.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
        button.disabled = true;
    });

    if (currentScenarioIndex < gameData.length -1) {
        nextButton.textContent = "Next Question";
        nextButton.style.display = 'block';
    } else {
        nextButton.textContent = "Finish Game";
        nextButton.style.display = 'block';
    }
}

// Function to handle the next button click (either to progress or finish)
function handleNextButtonClick() {
    currentScenarioIndex++;
    if (currentScenarioIndex < gameData.length) {
        displayScenario(currentScenarioIndex);
    } else {
        // Game over logic is now primarily handled in displayScenario when index is out of bounds
        displayScenario(currentScenarioIndex); 
    }
}

// Function to start the game
function startGame() {
    currentScore = 0;
    currentScenarioIndex = 0;
    scoreArea.textContent = `Score: ${currentScore}`;
    feedbackArea.innerHTML = "";
    feedbackArea.style.display = 'none';
    
    displayScenario(currentScenarioIndex);
    
    // Change event listener from starting game to progressing game
    nextButton.removeEventListener('click', startGame);
    nextButton.addEventListener('click', handleNextButtonClick);
    
    // "Start Game" button becomes "Next Question" but is hidden until first answer
    nextButton.textContent = "Next Question"; 
    nextButton.style.display = 'none';
}

// Event listener for the initial button (acts as Start Game)
if (nextButton) {
    nextButton.addEventListener('click', startGame);
} else {
    console.error("Error: Main game button ('next-button') not found. Page may not function correctly.");
}

// Initialize score display on page load
if (scoreArea) {
    scoreArea.textContent = `Score: ${currentScore}`;
}

// A console log to confirm the script is loaded, can be removed for production
// console.log("Identity Theft Awareness Game script loaded. Waiting for user to start.");
