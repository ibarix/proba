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
        scenario: "Primate e-poruku s predmetom 'Hitno: Potrebna radnja - Vaš sveučilišni račun'. Tvrdi se da je otkrivena sumnjiva aktivnost i traži se da odmah kliknete na poveznicu kako biste potvrdili svoje pristupne podatke. E-mail adresa pošiljatelja je 'admin@university-security-alerts.com' umjesto uobičajene '@vasesveuciliste.hr'.",
        question: "Koja je najsigurnija radnja koju treba poduzeti?",
        options: [
            "Kliknite na poveznicu i prijavite se kako biste brzo osigurali svoj račun.",
            "Odgovorite na e-poruku tražeći više informacija.",
            "Ignorirajte e-poruku; vjerojatno nije važna.",
            "Nemojte kliknuti na poveznicu. Otvorite novu karticu preglednika, idite na službenu web stranicu sveučilišta, tamo se prijavite i provjerite ima li obavijesti. Prijavite e-poruku kao phishing."
        ],
        correctAnswer: "Nemojte kliknuti na poveznicu. Otvorite novu karticu preglednika, idite na službenu web stranicu sveučilišta, tamo se prijavite i provjerite ima li obavijesti. Prijavite e-poruku kao phishing.",
        feedback_correct: "Točno! Ovo je vjerojatno pokušaj krađe identiteta (phishing). Prevaranti stvaraju lažni osjećaj hitnosti i koriste malo izmijenjene adrese e-pošte. Uvijek pristupajte osjetljivim računima izravno putem službenih web stranica ili aplikacija, a ne putem poveznica u neželjenim e-porukama. Prijavljivanjem pomažete u zaštiti drugih.",
        feedback_incorrect: "Netočno. Klikanje na poveznice ili odgovaranje na phishing e-poruke može izložiti vaše pristupne podatke ili dovesti do zlonamjernog softvera. Uvijek provjeravajte izravno s institucijom putem njihovih službenih kontaktnih kanala, a ne onih navedenih u sumnjivoj e-poruci."
    },
    {
        scenario: "Na vašoj omiljenoj društvenoj mreži pojavljuje se novi zahtjev za prijateljstvo od nekoga tko vam izgleda poznato, ali ga se ne sjećate baš. Njegov profil ima vrlo malo objava, uglavnom nedavnih, i mali broj prijatelja. Ubrzo nakon što prihvatite, pošalje vam poruku tražeći vaš broj telefona i kućnu adresu jer je 'izgubio kontakte' i želi vam nešto poslati.",
        question: "Kako biste trebali odgovoriti na ovu poruku?",
        options: [
            "Dajte informacije; čini se drag i to je samo broj telefona i adresa.",
            "Postavite mu više pitanja kako biste pokušali shvatiti tko je on.",
            "Ljubazno odbijte podijeliti informacije i razmislite o tome da ga uklonite kao prijatelja.",
            "Dajte mu lažni broj telefona i adresu da vidite što će učiniti."
        ],
        correctAnswer: "Ljubazno odbijte podijeliti informacije i razmislite o tome da ga uklonite kao prijatelja.",
        feedback_correct: "Točno! Ovo bi mogao biti lažni profil ili kompromitirani račun. Budite oprezni pri dijeljenju osobnih podataka na mreži, posebno s novim ili neprovjerenim kontaktima. U redu je odbiti i zaštititi svoju privatnost. Pazite na crvene zastavice poput oskudnih profila.",
        feedback_incorrect: "Netočno. Dijeljenje osobnih podataka poput broja telefona i adrese s neprovjerenim internetskim kontaktima je rizično. Čak i postavljanje previše pitanja ponekad može otkriti informacije. Najbolje je biti oprezan s novim internetskim 'prijateljima'."
    },
    {
        scenario: "Prijavljujete se na novi internetski forum vezan za jedan od vaših hobija. Prilikom izrade računa traži se korisničko ime i lozinka. U iskušenju ste da koristite istu lozinku koju koristite za svoju e-poštu i internetsko bankarstvo kako biste je lakše zapamtili.",
        question: "Koja je najbolja praksa za stvaranje lozinke za ovaj novi forum?",
        options: [
            "Koristite istu lozinku kao za e-poštu i bankarstvo radi praktičnosti.",
            "Koristite malo drugačiju verziju svoje uobičajene lozinke (npr. dodavanjem '1' na kraju).",
            "Stvorite jaku, jedinstvenu lozinku za ovaj forum, idealno koristeći upravitelj lozinki za njeno pohranjivanje.",
            "Koristite vrlo jednostavnu, lako pogodivu lozinku jer forum nije važan."
        ],
        correctAnswer: "Stvorite jaku, jedinstvenu lozinku za ovaj forum, idealno koristeći upravitelj lozinki za njeno pohranjivanje.",
        feedback_correct: "Točno! Korištenje jedinstvenih, jakih lozinki za svaki račun je ključno. Ako je jedna stranica probijena, vaši drugi računi ostaju sigurni. Upravitelji lozinki mogu generirati i pohranjivati složene lozinke, čineći ovu praksu mnogo lakšom.",
        feedback_incorrect: "Netočno. Ponovno korištenje lozinki, čak i s manjim varijacijama, veliki je sigurnosni rizik. Ako je manje sigurna stranica poput foruma probijena, a vi ste ponovno koristili svoju lozinku, napadači mogu isprobati tu lozinku na osjetljivijim računima poput e-pošte ili bankarstva."
    },
    {
        scenario: "Nalazite se u lokalnom kafiću i spajate se na njihovu besplatnu javnu Wi-Fi mrežu kako biste provjerili stanje bankovnog računa i platili račun putem interneta. Wi-Fi mreža je otvorena i ne zahtijeva lozinku.",
        question: "Koji je glavni sigurnosni problem ove radnje?",
        options: [
            "Wi-Fi bi mogao biti spor, pa će transakcija trajati duže.",
            "Netko bi lako mogao presresti vaše podatke na nezaštićenoj javnoj Wi-Fi mreži.",
            "Mogli biste se omesti i pogriješiti prilikom plaćanja.",
            "Nema brige; javni Wi-Fi je općenito siguran za ove aktivnosti."
        ],
        correctAnswer: "Netko bi lako mogao presresti vaše podatke na nezaštićenoj javnoj Wi-Fi mreži.",
        feedback_correct: "Točno! Nezaštićene javne Wi-Fi mreže rizične su za osjetljive transakcije. Napadači mogu presresti podatke poslane preko tih mreža. Najbolje je koristiti VPN ili pričekati dok ne budete imali sigurnu, pouzdanu internetsku vezu (poput kućnog Wi-Fi-ja ili mobilnih podataka) za bankarstvo.",
        feedback_incorrect: "Netočno. Primarni rizik korištenja otvorene javne Wi-Fi mreže za osjetljive informacije poput bankarstva je presretanje podataka od strane zlonamjernih aktera, a ne spore brzine ili ometanja. Uvijek pretpostavite da javni Wi-Fi nije siguran."
    },
    {
        scenario: "Pregledavate internetsku trgovinu koju nikada prije niste koristili. Cijene su nevjerojatno niske, gotovo predobre da bi bile istinite. Primjećujete da URL web stranice počinje s 'http://' umjesto 'https://', a u opisima proizvoda ima nekoliko gramatičkih pogrešaka.",
        question: "Što bi vam ovi znakovi trebali ukazivati?",
        options: [
            "Pronašli ste sjajnu ponudu i trebali biste brzo kupiti prije nego što ponude nestanu.",
            "Web stranica je vjerojatno nova i još uvijek rješava neke manje probleme.",
            "Ovo su crvene zastavice za potencijalno nesigurnu ili lažnu web stranicu; trebali biste izbjegavati kupnju.",
            "Trebali biste kontaktirati njihovu korisničku službu kako biste pitali o HTTPS-u i pogreškama."
        ],
        correctAnswer: "Ovo su crvene zastavice za potencijalno nesigurnu ili lažnu web stranicu; trebali biste izbjegavati kupnju.",
        feedback_correct: "Točno! Nedostatak HTTPS-a ('s' označava sigurnu vezu), vrlo niske cijene i loša gramatika uobičajeni su znakovi prevarantskih web stranica. Vaši financijski podaci ne bi bili sigurni i možda nećete primiti proizvode. Vjerujte svojim instinktima ako vam se stranica čini sumnjivom.",
        feedback_incorrect: "Netočno. Iako je kontaktiranje korisničke službe opcija, kombinacija ovih crvenih zastavica (posebno nedostatak HTTPS-a za trgovinu) snažno sugerira da ne biste trebali vjerovati stranici sa svojim podacima o plaćanju niti očekivati legitimne proizvode."
    },
    {
        scenario: "Na telefonu primate obavijest da je vaša lozinka za aplikaciju društvene mreže uspješno promijenjena. Međutim, vi je niste promijenili. Također se sjećate da ste istu lozinku koristili za nekoliko drugih internetskih računa.",
        question: "Koji je najvažniji prvi korak koji treba poduzeti?",
        options: [
            "Ignorirajte, možda je greška u sustavu.",
            "Odmah pokušajte se prijaviti na pogođeni račun društvene mreže i promijeniti lozinku natrag. Zatim promijenite lozinke na SVIM drugim računima koji su koristili istu ili sličnu lozinku.",
            "Izbrišite aplikaciju društvene mreže s telefona.",
            "Objavite na društvenim mrežama pitajući je li još netko dobio sličnu obavijest."
        ],
        correctAnswer: "Odmah pokušajte se prijaviti na pogođeni račun društvene mreže i promijeniti lozinku natrag. Zatim promijenite lozinke na SVIM drugim računima koji su koristili istu ili sličnu lozinku.",
        feedback_correct: "Točno! Ovo je znak da je vaš račun možda ugrožen. Prioritetno vratite kontrolu nad pogođenim računom, a zatim odmah promijenite lozinke na svim drugim uslugama gdje ste koristili istu ili sličnu lozinku kako biste spriječili daljnji neovlašteni pristup. Omogućite dvofaktorsku provjeru autentičnosti gdje god je to moguće.",
        feedback_incorrect: "Netočno. Ignoriranje takve obavijesti ili jednostavno brisanje aplikacije ne rješava potencijalnu ugrozu vašeg računa niti rizik za druge račune koji koriste istu lozinku. Brza akcija za osiguranje vaših računa je ključna."
    }
];

// Function to display a scenario
function displayScenario(scenarioIndex) {
    if (scenarioIndex >= gameData.length) {
        scenarioArea.innerHTML = `<h2>Kraj igre!</h2><p>Završili ste sve scenarije.</p><p>Vaš konačni rezultat je: ${currentScore} od ${gameData.length}</p>`;
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

    nextButton.textContent = "Sljedeće pitanje";
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
        scoreArea.textContent = `Bodovi: ${currentScore}`;
    } else {
        feedbackArea.textContent = currentScenario.feedback_incorrect;
        feedbackArea.classList.add('incorrect');
    }

    const optionButtons = optionsArea.querySelectorAll('.option-button');
    optionButtons.forEach(button => {
        button.disabled = true;
    });

    if (currentScenarioIndex < gameData.length -1) {
        nextButton.textContent = "Sljedeće pitanje";
        nextButton.style.display = 'block';
    } else {
        nextButton.textContent = "Završi igru";
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
    scoreArea.textContent = `Bodovi: ${currentScore}`;
    feedbackArea.innerHTML = "";
    feedbackArea.style.display = 'none';
    
    displayScenario(currentScenarioIndex);
    
    nextButton.removeEventListener('click', startGame);
    nextButton.addEventListener('click', handleNextButtonClick);
    
    nextButton.textContent = "Sljedeće pitanje";
    nextButton.style.display = 'none';
}

if (nextButton) {
    nextButton.addEventListener('click', startGame);
} else {
    console.error("Error: Main game button ('next-button') not found. Page may not function correctly.");
}

if (scoreArea) {
    scoreArea.textContent = `Bodovi: ${currentScore}`;
}
