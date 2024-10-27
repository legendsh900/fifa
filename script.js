document.addEventListener('DOMContentLoaded', function() {
    // Initialiser les données des championnats
    window.championships = {
        championship1: 'championship1.json',
        championship2: 'championship2.json',
        championship3: 'championship3.json'
    };
});

function loadChampionshipData() {
    const select = document.getElementById('championshipSelect');
    const selectedChampionship = select.value;

    if (selectedChampionship) {
        fetch(window.championships[selectedChampionship])
            .then(response => response.json())
            .then(data => {
                window.previousMatches = data;
                document.querySelector('.container').classList.add('hidden');
                setTimeout(() => {
                    document.querySelector('.container').classList.remove('hidden');
                    document.querySelector('.container').classList.add('visible');
                }, 500);
            })
            .catch(error => {
                console.error('Erreur lors du chargement des données:', error);
                document.getElementById('prediction').innerText = 'Erreur lors du chargement des données du championnat.';
            });
    }
}

function generatePrediction() {
    const teamA = document.getElementById('teamAInput').value.trim().toLowerCase();
    const teamB = document.getElementById('teamBInput').value.trim().toLowerCase();

    if (!teamA || !teamB) {
        document.getElementById('prediction').innerText = 'Veuillez entrer les noms des deux équipes.';
        return;
    }

    if (!window.previousMatches) {
        document.getElementById('prediction').innerText = 'Les données des matchs précédents ne sont pas encore chargées.';
        return;
    }

    let teamAExists = false;
    let teamBExists = false;
    let teamAVictories = 0;
    let teamBVictories = 0;
    let teamAScoreTotal = 0;
    let teamBScoreTotal = 0;
    let teamAMatchCount = 0;
    let teamBMatchCount = 0;

    window.previousMatches.forEach(match => {
        const matchTeamA = match.teamA.toLowerCase();
        const matchTeamB = match.teamB.toLowerCase();

        if (matchTeamA === teamA || matchTeamB === teamA) {
            teamAExists = true;
            teamAScoreTotal += (matchTeamA === teamA) ? match.scoreA : match.scoreB;
            teamAMatchCount++;
            if ((matchTeamA === teamA && match.scoreA > match.scoreB) || (matchTeamB === teamA && match.scoreB > match.scoreA)) {
                teamAVictories++;
            }
        }

        if (matchTeamA === teamB || matchTeamB === teamB) {
            teamBExists = true;
            teamBScoreTotal += (matchTeamA === teamB) ? match.scoreA : match.scoreB;
            teamBMatchCount++;
            if ((matchTeamA === teamB && match.scoreA > match.scoreB) || (matchTeamB === teamB && match.scoreB > match.scoreA)) {
                teamBVictories++;
            }
        }
    });

    if (!teamAExists || !teamBExists) {
        document.getElementById('prediction').innerText = 'Les prédictions pour ces équipes ne sont pas accessibles. Veuillez vérifier les noms des équipes.';
        return;
    }

    const teamAAverageScore = teamAMatchCount ? Math.round(teamAScoreTotal / teamAMatchCount) : 0;
    const teamBAverageScore = teamBMatchCount ? Math.round(teamBScoreTotal / teamBMatchCount) : 0;

    const totalGoals = teamAAverageScore + teamBAverageScore;
    let adjustedTotalGoals = totalGoals;
    if (totalGoals >= 5) {
        adjustedTotalGoals -= 2;
    }

    let prediction;
    if (teamAAverageScore > teamBAverageScore) {
        prediction = `Victoire de ${teamA.charAt(0).toUpperCase() + teamA.slice(1)} !`;
    } else if (teamBAverageScore > teamAAverageScore) {
        prediction = `Victoire de ${teamB.charAt(0).toUpperCase() + teamB.slice(1)} !`;
    } else {
        prediction = `Match nul 1er HT ou Équipe non favoris gagnant !`;
    }

    document.getElementById('prediction').innerText = `${prediction} Total de buts marqués : ${adjustedTotalGoals} buts`;
}
