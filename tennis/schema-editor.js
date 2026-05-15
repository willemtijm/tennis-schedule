const SHEET = "schema.txt";
const textarea = document.getElementById("schemaContent");
const statusEl = document.getElementById("status");
const loadBtn = document.getElementById("btnLoad");
const downloadBtn = document.getElementById("btnDownload");
const copyBtn = document.getElementById("btnCopy");
function setStatus(message, isError) {
    if (!statusEl) {
        return;
    }
    statusEl.textContent = message;
    statusEl.style.color = isError ? "#ff8a8a" : "#c6a56a";
}
async function loadSchema() {
    if (!textarea) {
        return;
    }
    try {
        const response = await fetch(SHEET, { cache: "no-store" });
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
        }
        textarea.value = await response.text();
        setStatus("Geladen van schema.txt.", false);
    }
    catch (error) {
        console.error(error);
        setStatus("Kon schema.txt niet laden. Draai de site via een lokale server (npm run serve).", true);
    }
}
function downloadSchema() {
    if (!textarea) {
        return;
    }
    const blob = new Blob([textarea.value], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "schema.txt";
    anchor.rel = "noopener";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    URL.revokeObjectURL(url);
    setStatus("Download gestart: vervang daarna schema.txt in je project of upload opnieuw bij hosting.", false);
}
async function copySchema() {
    if (!textarea) {
        return;
    }
    try {
        await navigator.clipboard.writeText(textarea.value);
        setStatus("Gekopieerd naar klembord.", false);
    }
    catch (_a) {
        setStatus("Kopiëren mislukt (browser of permissies).", true);
    }
}
loadBtn === null || loadBtn === void 0 ? void 0 : loadBtn.addEventListener("click", () => {
    void loadSchema();
});
downloadBtn === null || downloadBtn === void 0 ? void 0 : downloadBtn.addEventListener("click", downloadSchema);
copyBtn === null || copyBtn === void 0 ? void 0 : copyBtn.addEventListener("click", () => {
    void copySchema();
});
void loadSchema();
