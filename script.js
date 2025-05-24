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
        scenario: "[HRVATSKI PRIJEVOD ZA: You receive an email with the subject 'Urgent: Action Required - Your University Account'. It claims suspicious activity was detected and asks you to click a link to verify your login credentials immediately. The sender's email address is 'admin@university-security-alerts.com' instead of the usual '@youruniversity.edu'.]",
        question: "[HRVATSKI PRIJEVOD ZA: What is the safest action to take?]",
        options: [
            "[HRVATSKI PRIJEVOD ZA: Click the link and log in to secure your account quickly.]",
            "[HRVATSKI PRIJEVOD ZA: Reply to the email asking for more information.]",
            "[HRVATSKI PRIJEVOD ZA: Ignore the email; it's probably not important.]",
            "[HRVATSKI PRIJEVOD ZA: Do not click the link. Open a new browser tab, go to the official university website, log in there, and check for any notifications. Report the email as phishing.]"
        ],
        correctAnswer: "[HRVATSKI PRIJEVOD ZA: Do not click the link. Open a new browser tab, go to the official university website, log in there, and check for any notifications. Report the email as phishing.]",
        feedback_correct: "[HRVATSKI PRIJEVOD ZA: Correct! This is likely a phishing attempt. Scammers create fake urgency and use slightly off email addresses. Always access sensitive accounts through official websites or apps directly, not through links in unsolicited emails. Reporting it helps protect others.]",
        feedback_incorrect: "[HRVATSKI PRIJEVOD ZA: Incorrect. Clicking links or replying to phishing emails can expose your credentials or lead to malware. Always verify directly with the institution through their official contact channels, not the ones provided in a suspicious email.]"
    },
    {
        scenario: "[HRVATSKI PRIJEVOD ZA: A new friend request appears on your favorite social media platform from someone who looks familiar, but you don't quite remember them. Their profile has very few posts, mostly recent, and a low friend count. Soon after you accept, they message you asking for your phone number and home address because they 'lost their contacts' and want to send you something.]",
        question: "[HRVATSKI PRIJEVOD ZA: How should you respond to this message?]",
        options: [
            "[HRVATSKI PRIJEVOD ZA: Provide the information; they seem nice and it's just a phone number and address.]",
            "[HRVATSKI PRIJEVOD ZA: Ask them more questions to try and figure out who they are.]",
            "[HRVATSKI PRIJEVOD ZA: Politely decline to share the information and consider removing them as a friend.]",
            "[HRVATSKI PRIJEVOD ZA: Give them a fake phone number and address to see what they do.]"
        ],
        correctAnswer: "[HRVATSKI PRIJEVOD ZA: Politely decline to share the information and consider removing them as a friend.]",
        feedback_correct: "[HRVATSKI PRIJEVOD ZA: Correct! This could be a fake profile or a compromised account. Be cautious about sharing personal information online, especially with new or unverified contacts. It's okay to decline and protect your privacy. Look for red flags like sparse profiles.]",
        feedback_incorrect: "[HRVATSKI PRIJEVOD ZA: Incorrect. Sharing personal details like your phone number and address with unverified online contacts is risky. Even asking too many questions can sometimes reveal information. It's best to err on the side of caution with new online 'friends'.]"
    },
    {
        scenario: "[HRVATSKI PRIJEVOD ZA: You're signing up for a new online forum related to one of your hobbies. When creating your account, it asks for a username and password. You're tempted to use the same password you use for your email and online banking to make it easier to remember.]",
        question: "[HRVATSKI PRIJEVOD ZA: What is the best practice for creating a password for this new forum?]",
        options: [
            "[HRVATSKI PRIJEVOD ZA: Use the same password as your email and banking for convenience.]",
            "[HRVATSKI PRIJEVOD ZA: Use a slightly different version of your common password (e.g., adding a '1' at the end).]",
            "[HRVATSKI PRIJEVOD ZA: Create a strong, unique password for this forum, ideally using a password manager to store it.]",
            "[HRVATSKI PRIJEVOD ZA: Use a very simple, easy-to-guess password because the forum isn't important.]"
        ],
        correctAnswer: "[HRVATSKI PRIJEVOD ZA: Create a strong, unique password for this forum, ideally using a password manager to store it.]",
        feedback_correct: "[HRVATSKI PRIJEVOD ZA: Correct! Using unique, strong passwords for each account is crucial. If one site is breached, your other accounts remain safe. Password managers can generate and store complex passwords, making this practice much easier.]",
        feedback_incorrect: "[HRVATSKI PRIJEVOD ZA: Incorrect. Reusing passwords, even with minor variations, is a major security risk. If a less secure site like a forum is breached and you've reused your password, attackers can try that password on more sensitive accounts like email or banking.]"
    },
    {
        scenario: "[HRVATSKI PRIJEVOD ZA: You're at a local coffee shop and connect to their free public Wi-Fi to check your bank balance and pay a bill online. The Wi-Fi network is open and doesn't require a password.]",
        question: "[HRVATSKI PRIJEVOD ZA: What is the main security concern with this action?]",
        options: [
            "[HRVATSKI PRIJEVOD ZA: The Wi-Fi might be slow, making the transaction take longer.]",
            "[HRVATSKI PRIJEVOD ZA: Someone could easily intercept your data on an unsecured public Wi-Fi network.]",
            "[HRVATSKI PRIJEVOD ZA: You might get distracted and make a mistake with the payment.]",
            "[HRVATSKI PRIJEVOD ZA: There's no concern; public Wi-Fi is generally safe for these activities.]"
        ],
        correctAnswer: "[HRVATSKI PRIJEVOD ZA: Someone could easily intercept your data on an unsecured public Wi-Fi network.]",
        feedback_correct: "[HRVATSKI PRIJEVOD ZA: Correct! Unsecured public Wi-Fi networks are risky for sensitive transactions. Attackers can intercept data sent over these networks. It's best to use a VPN or wait until you have a secure, trusted internet connection (like your home Wi-Fi or mobile data) for banking.]",
        feedback_incorrect: "[HRVATSKI PRIJEVOD ZA: Incorrect. The primary risk of using open public Wi-Fi for sensitive information like banking is data interception by malicious actors, not slow speeds or distractions. Always assume public Wi-Fi is not secure.]"
    },
    {
        scenario: "[HRVATSKI PRIJEVOD ZA: You're browsing an online store you've never used before. The prices are incredibly low, almost too good to be true. You notice the website URL starts with 'http://' instead of 'https://', and there are a few grammatical errors in the product descriptions.]",
        question: "[HRVATSKI PRIJEVOD ZA: What should these signs indicate to you?]",
        options: [
            "[HRVATSKI PRIJEVOD ZA: You've found a great bargain and should buy quickly before the deals are gone.]",
            "[HRVATSKI PRIJEVOD ZA: The website is likely new and still working out some minor issues.]",
            "[HRVATSKI PRIJEVOD ZA: These are red flags for a potentially unsafe or fraudulent website; you should avoid making a purchase.]",
            "[HRVATSKI PRIJEVOD ZA: You should contact their customer service to ask about the HTTPS and errors.]"
        ],
        correctAnswer: "[HRVATSKI PRIJEVOD ZA: These are red flags for a potentially unsafe or fraudulent website; you should avoid making a purchase.]",
        feedback_correct: "[HRVATSKI PRIJEVOD ZA: Correct! Lack of HTTPS (the 's' indicates a secure connection), very low prices, and poor grammar are common signs of scam websites. Your financial information would not be secure, and you might not receive the products. Trust your instincts if a site feels off.]",
        feedback_incorrect: "[HRVATSKI PRIJEVOD ZA: Incorrect. While contacting customer service is an option, the combination of these red flags (especially no HTTPS for a store) strongly suggests you should not trust the site with your payment information or expect legitimate products.]"
    },
    {
        scenario: "[HRVATSKI PRIJEVOD ZA: You receive a notification on your phone that your password for a social media app was successfully changed. However, you didn't change it. You also remember using that same password for several other online accounts.]",
        question: "[HRVATSKI PRIJEVOD ZA: What is the most important first step to take?]",
        options: [
            "[HRVATSKI PRIJEVOD ZA: Ignore it, it might be a system glitch.]",
            "[HRVATSKI PRIJEVOD ZA: Immediately try to log into the affected social media account and change the password back. Then, change the passwords on ALL other accounts that used the same or similar password.]",
            "[HRVATSKI PRIJEVOD ZA: Delete the social media app from your phone.]",
            "[HRVATSKI PRIJEVOD ZA: Post on social media asking if anyone else got a similar notification.]"
        ],
        correctAnswer: "[HRVATSKI PRIJEVOD ZA: Immediately try to log into the affected social media account and change the password back. Then, change the passwords on ALL other accounts that used the same or similar password.]",
        feedback_correct: "[HRVATSKI PRIJEVOD ZA: Correct! This is a sign your account may be compromised. Prioritize regaining control of the affected account and then immediately change passwords on all other services where you used the same or similar password to prevent further unauthorized access. Enable two-factor authentication wherever possible.]",
        feedback_incorrect: "[HRVATSKI PRIJEVOD ZA: Incorrect. Ignoring such a notification or simply deleting the app doesn't address the potential compromise of your account or the risk to other accounts using the same password. Swift action to secure your accounts is key.]"
    }
];

// Function to display a scenario
function displayScenario(scenarioIndex) {
    if (scenarioIndex >= gameData.length) {
        scenarioArea.innerHTML = `<h2>[HRVATSKI PRIJEVOD ZA: Game Over!]</h2><p>[HRVATSKI PRIJEVOD ZA: You have completed all scenarios.]</p><p>[HRVATSKI PRIJEVOD ZA: Your final score is:] ${currentScore} [HRVATSKI PRIJEVOD ZA: out of] ${gameData.length}</p>`;
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

    nextButton.textContent = "[HRVATSKI PRIJEVOD ZA: Next Question]";
    nextButton.style.display = 'none'; 
}

// Function to check the selected answer
function checkAnswer(selectedOption, scenarioIndex) {
    const currentScenario = gameData[scenarioIndex];
    feedbackArea.style.display = 'block'; 

    feedbackArea.classList.remove('correct', 'incorrect');

    if (selectedOption === currentScenario.correctAnswer) {
        feedbackArea.textContent = currentScenario.feedback_correct;
        feedbackArea.classList.add('correct'); 
        currentScore++;
        scoreArea.textContent = `[HRVATSKI PRIJEVOD ZA: Score:] ${currentScore}`;
    } else {
        feedbackArea.textContent = currentScenario.feedback_incorrect;
        feedbackArea.classList.add('incorrect');
    }

    const optionButtons = optionsArea.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
        button.disabled = true;
    });

    if (currentScenarioIndex < gameData.length -1) {
        nextButton.textContent = "[HRVATSKI PRIJEVOD ZA: Next Question]";
        nextButton.style.display = 'block';
    } else {
        nextButton.textContent = "[HRVATSKI PRIJEVOD ZA: Finish Game]";
        nextButton.style.display = 'block';
    }
}

// Function to handle the next button click (either to progress or finish)
function handleNextButtonClick() {
    currentScenarioIndex++;
    if (currentScenarioIndex < gameData.length) {
        displayScenario(currentScenarioIndex);
    } else {
        displayScenario(currentScenarioIndex); 
    }
}

// Function to start the game
function startGame() {
    currentScore = 0;
    currentScenarioIndex = 0;
    // Initial text in HTML: <section id="score-area">[HRVATSKI PRIJEVOD ZA: Score:] 0</section>
    // Initial text in HTML: <button id="next-button">[HRVATSKI PRIJEVOD ZA: Start Game]</button>
    // These initial HTML texts were updated in index.html.
    scoreArea.textContent = `[HRVATSKI PRIJEVOD ZA: Score:] ${currentScore}`;
    feedbackArea.innerHTML = "";
    feedbackArea.style.display = 'none';
    
    displayScenario(currentScenarioIndex);
    
    nextButton.removeEventListener('click', startGame);
    nextButton.addEventListener('click', handleNextButtonClick);
    
    nextButton.textContent = "[HRVATSKI PRIJEVOD ZA: Next Question]";
    nextButton.style.display = 'none';
}

if (nextButton) {
    nextButton.addEventListener('click', startGame);
} else {
    console.error("Error: Main game button ('next-button') not found. Page may not function correctly.");
}

if (scoreArea) {
    // This updates the score on initial load. The HTML already has the placeholder.
    // So, this should also use the placeholder for "Score: ".
    scoreArea.textContent = `[HRVATSKI PRIJEVOD ZA: Score:] ${currentScore}`;
}
