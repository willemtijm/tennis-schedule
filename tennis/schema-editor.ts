const SHEET = "schema.txt";

const textarea = document.getElementById("schemaContent") as HTMLTextAreaElement | null;
const statusEl = document.getElementById("status");
const loadBtn = document.getElementById("btnLoad");
const downloadBtn = document.getElementById("btnDownload");
const copyBtn = document.getElementById("btnCopy");

function setStatus(message: string, isError: boolean): void {
  if (!statusEl) {
    return;
  }
  statusEl.textContent = message;
  statusEl.style.color = isError ? "#ff8a8a" : "#c6a56a";
}

async function loadSchema(): Promise<void> {
  if (!textarea) {
    return;
  }

  try {
    const response = await fetch(SHEET);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    textarea.value = await response.text();
    setStatus("Geladen van schema.txt.", false);
  } catch (error) {
    console.error(error);
    setStatus("Kon schema.txt niet laden. Draai de site via een lokale server (npm run serve).", true);
  }
}

function downloadSchema(): void {
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

async function copySchema(): Promise<void> {
  if (!textarea) {
    return;
  }

  try {
    await navigator.clipboard.writeText(textarea.value);
    setStatus("Gekopieerd naar klembord.", false);
  } catch {
    setStatus("Kopiëren mislukt (browser of permissies).", true);
  }
}

loadBtn?.addEventListener("click", () => {
  void loadSchema();
});
downloadBtn?.addEventListener("click", downloadSchema);
copyBtn?.addEventListener("click", () => {
  void copySchema();
});

void loadSchema();
