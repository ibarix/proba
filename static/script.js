function openTab(tabName) {
    var i;
    var tabContent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabContent.length; i++) {
        tabContent[i].style.display = "none";
    }

    var tabButtons = document.getElementsByClassName("tab-button");
    for (i = 0; i < tabButtons.length; i++) {
        tabButtons[i].className = tabButtons[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    event.currentTarget.className += " active";
}

document.addEventListener("DOMContentLoaded", function() {
    document.querySelector(".tab-button").click();
    loadTournamentData();

    document.getElementById('add-player-form').addEventListener('submit', addPlayer);
    document.getElementById('pair-button').addEventListener('click', generatePairings);
    document.getElementById('export-button').addEventListener('click', exportToCsv);
});

let tournamentData = {};

async function loadTournamentData() {
    const response = await fetch('/api/tournament');
    tournamentData = await response.json();
    renderPlayers();
    renderStandings();
    renderPairings();
}

function renderPlayers() {
    const playerList = document.getElementById('player-list').getElementsByTagName('tbody')[0];
    playerList.innerHTML = '';
    const tournamentStarted = tournamentData.rounds && tournamentData.rounds.length > 0;

    tournamentData.players.forEach(player => {
        const row = playerList.insertRow();

        let actionButton = '';
        if (player.status === 'active') {
            if (tournamentStarted) {
                actionButton = `<button onclick="withdrawPlayer(${player.id})">Povuci</button>`;
            } else {
                actionButton = `<button onclick="deletePlayer(${player.id})">Obriši</button>`;
            }
        }

        row.innerHTML = `
            <td>${player.first_name}</td>
            <td>${player.last_name}</td>
            <td>${player.elo}</td>
            <td>${actionButton}</td>
        `;

        if (player.status === 'withdrawn') {
            row.classList.add('withdrawn');
        }
    });
}

async function withdrawPlayer(playerId) {
    if (confirm('Jeste li sigurni da želite povući ovog igrača s turnira?')) {
        const response = await fetch(`/api/players/${playerId}/withdraw`, {
            method: 'POST',
        });
        if (response.ok) {
            loadTournamentData();
        } else {
            const error = await response.json();
            alert(`Greška: ${error.error}`);
        }
    }
}

function renderStandings() {
    const standingsBody = document.getElementById('standings').getElementsByTagName('tbody')[0];
    standingsBody.innerHTML = '';
    const sortedPlayers = [...tournamentData.players].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.buchholz - a.buchholz;
    });
    sortedPlayers.forEach((player, index) => {
        const row = standingsBody.insertRow();
        row.innerHTML = `
            <td>${index + 1}</td>
            <td>${player.first_name} ${player.last_name}</td>
            <td>${player.points}</td>
            <td>${player.wins}</td>
            <td>${player.draws}</td>
            <td>${player.losses}</td>
            <td>${player.elo}</td>
            <td>${player.new_elo}</td>
            <td>${player.buchholz.toFixed(2)}</td>
        `;

        if (player.status === 'withdrawn') {
            row.classList.add('withdrawn');
        }
    });
}

function renderPairings() {
    const pairingsDiv = document.getElementById('pairings');
    pairingsDiv.innerHTML = '';
    if (tournamentData.rounds.length > 0) {
        const lastRound = tournamentData.rounds[tournamentData.rounds.length - 1];
        lastRound.pairings.forEach(pairing => {
            const white = tournamentData.players.find(p => p.id === pairing.white);
            const black = tournamentData.players.find(p => p.id === pairing.black);
            const pairingDiv = document.createElement('div');

            let html = `${white.first_name} ${white.last_name} vs ${black ? black.first_name + ' ' + black.last_name : 'BYE'}`;
            if (pairing.result) {
                html += ` - <b>${pairing.result}</b>`;
            } else if (black) {
                html += `
                    <button onclick="submitResult(${lastRound.round_number}, ${white.id}, ${black.id}, '1-0')">1-0</button>
                    <button onclick="submitResult(${lastRound.round_number}, ${white.id}, ${black.id}, '1/2-1/2')">1/2-1/2</button>
                    <button onclick="submitResult(${lastRound.round_number}, ${white.id}, ${black.id}, '0-1')">0-1</button>
                `;
            }
            pairingDiv.innerHTML = html;
            pairingsDiv.appendChild(pairingDiv);
        });
        const nextRound = tournamentData.rounds.length + 1;
        document.getElementById('pair-button').innerText = `Generiraj parove za ${nextRound}. rundu`;
    }
}

async function generatePairings() {
    const response = await fetch('/api/pairings', { method: 'POST' });
    if (response.ok) {
        loadTournamentData();
    } else {
        const error = await response.json();
        alert(error.error);
    }
}

async function submitResult(roundNumber, whiteId, blackId, result) {
    await fetch('/api/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ round_number: roundNumber, white_id: whiteId, black_id: blackId, result: result }),
    });
    loadTournamentData();
}

function exportToCsv() {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Poz.,Igrac,Bodovi,Pob.,Ner.,Por.,ELO,Novi ELO,Buchholz\r\n";

    const sortedPlayers = [...tournamentData.players].sort((a, b) => {
        if (b.points !== a.points) return b.points - a.points;
        return b.buchholz - a.buchholz;
    });

    sortedPlayers.forEach((player, index) => {
        const row = [
            index + 1,
            `${player.first_name} ${player.last_name}`,
            player.points,
            player.wins,
            player.draws,
            player.losses,
            player.elo,
            player.new_elo,
            player.buchholz.toFixed(2)
        ].join(',');
        csvContent += row + "\r\n";
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "turnir_rezultati.csv");
    document.body.appendChild(link);
    link.click();
}

async function addPlayer(event) {
    event.preventDefault();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const elo = document.getElementById('elo').value || 600;

    const response = await fetch('/api/players', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ first_name: firstName, last_name: lastName, elo: elo }),
    });

    if (response.ok) {
        loadTournamentData();
        document.getElementById('add-player-form').reset();
    }
}

async function deletePlayer(playerId) {
    if (confirm('Jeste li sigurni da želite obrisati ovog igrača?')) {
        const response = await fetch(`/api/players/${playerId}`, {
            method: 'DELETE',
        });
        if (response.ok) {
            loadTournamentData();
        }
    }
}
