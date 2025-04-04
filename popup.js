document.getElementById("scrape-button").addEventListener("click", () => {
  const format = document.getElementById("format").value;
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: scrapeData,
      },
      (results) => {
        const data = results[0].result;
        if (format === "csv") {
          exportToCSV(data);
        } else if (format === "json") {
          exportToJSON(data);
        }
        document.getElementById(
          "status"
        ).innerText = `Data exported as ${format.toUpperCase()}`;
      }
    );
  });
});

function scrapeData() {
  // Example scraping logic: scrape table data
  const rows = document.querySelectorAll("table tr");
  const data = [];
  rows.forEach((row) => {
    const cells = row.querySelectorAll("td, th");
    const rowData = [];
    cells.forEach((cell) => {
      rowData.push(cell.innerText);
    });
    data.push(rowData);
  });
  return data;
}

function exportToCSV(data) {
  const csvContent = data.map((e) => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url: url,
    filename: "data.csv",
  });
}

function exportToJSON(data) {
  const jsonContent = JSON.stringify(data, null, 2);
  const blob = new Blob([jsonContent], {
    type: "application/json;charset=utf-8;",
  });
  const url = URL.createObjectURL(blob);
  chrome.downloads.download({
    url: url,
    filename: "data.json",
  });
}
