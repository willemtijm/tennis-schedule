const SHEET = "schema.txt";
const tennisBox = document.getElementById("tennisFilter");
const padelBox = document.getElementById("padelFilter");
function getTableBody() {
    return document.querySelector("#schedule tbody");
}
function setStatusMessage(message) {
    const countdownEl = document.getElementById("countdown");
    if (countdownEl) {
        countdownEl.innerText = message;
    }
}
/* ---------------- DATA LADEN ---------------- */
async function loadData() {
    try {
        const response = await fetch(SHEET, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`Could not load ${SHEET} (${response.status})`);
        }
        const text = await response.text();
        return text
            .split("\n")
            .slice(1) // header overslaan
            .filter(row => row.trim() !== "")
            .map((row, index) => {
            // Keep player names intact if they include commas.
            const values = row.split(",");
            if (values.length < 3) {
                console.warn(`Skipping invalid row ${index + 2}: "${row}"`);
                return null;
            }
            const date = values.shift();
            const sport = values.pop();
            const players = values.join(",");
            return {
                date: date.trim(),
                players: players.trim(),
                sport: sport.trim().toLowerCase()
            };
        })
            .filter((match) => match !== null);
    }
    catch (error) {
        console.error("Failed to load match data:", error);
        setStatusMessage("Kon de planning niet laden.");
        return [];
    }
}
/* ---------------- RENDER ---------------- */
function renderTable(matches) {
    const tbody = getTableBody();
    if (!tbody) {
        console.error("Table body not found (#schedule tbody).");
        return;
    }
    tbody.innerHTML = "";
    matches.forEach(match => {
        const tr = document.createElement("tr");
        tr.dataset.date = match.date;
        tr.dataset.sport = match.sport;
        tr.innerHTML = `
      <td>${formatDate(match.date)}</td>
      <td>${match.players}</td>
      <td class="sport ${match.sport}">${capitalize(match.sport)}</td>
    `;
        tbody.appendChild(tr);
    });
    initLogic();
}
/* ---------------- LOGICA ---------------- */
function initLogic() {
    const tableBody = getTableBody();
    if (!tableBody || !tennisBox || !padelBox) {
        console.error("Missing required UI elements.");
        return;
    }
    const tbody = tableBody;
    const tennisInput = tennisBox;
    const padelInput = padelBox;
    const rows = Array.from(tbody.querySelectorAll("tr"));
    function sortRows() {
        rows.sort((a, b) => {
            const dateA = new Date(a.dataset.date);
            const dateB = new Date(b.dataset.date);
            return dateA.getTime() - dateB.getTime();
        });
        rows.forEach(row => tbody.appendChild(row));
    }
    function updateUI() {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        let nextMatch = null;
        for (const row of rows) {
            const sport = row.dataset.sport;
            const date = new Date(row.dataset.date);
            const sportMatch = (sport === "tennis" && tennisInput.checked) ||
                (sport === "padel" && padelInput.checked);
            const futureMatch = date >= today;
            row.classList.remove("highlight");
            if (sportMatch && futureMatch) {
                row.style.display = "";
                if (!nextMatch || date < nextMatch.date) {
                    nextMatch = { row, date };
                }
            }
            else {
                row.style.display = "none";
            }
        }
        /* highlight + countdown */
        if (nextMatch) {
            nextMatch.row.classList.add("highlight");
            const diff = Math.ceil((nextMatch.date.getTime() - today.getTime()) /
                (1000 * 60 * 60 * 24));
            setStatusMessage(`Volgende wedstrijd in ${diff} dag(en)`);
        }
        else {
            setStatusMessage("");
        }
    }
    sortRows();
    updateUI();
    // Reassigning ensures we never stack duplicate listeners.
    tennisInput.onchange = updateUI;
    padelInput.onchange = updateUI;
}
/* ---------------- HELPERS ---------------- */
function formatDate(dateStr) {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-GB", {
        day: "numeric",
        month: "long"
    });
}
function capitalize(text) {
    return text.charAt(0).toUpperCase() + text.slice(1);
}
/* ---------------- START ---------------- */
loadData().then(matches => {
    renderTable(matches);
});
