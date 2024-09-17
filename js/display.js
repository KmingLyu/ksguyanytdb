// display.js

// 欄位名稱轉換對照表
const columnTranslation = {
  number: "編號",
  title: "影片標題",
  published_at: "上傳時間",
  duration: "影片長度",
  description: "影片說明",
};

// 顯示搜尋結果
function displayResults(results) {
  currentResults = results;
  const resultsContainer = document.getElementById("results");
  const resultCount = document.getElementById("result-count");
  const keyword = document.getElementById("query").value.trim();

  // 如果沒有結果，顯示提示訊息
  if (results.length === 0) {
    resultsContainer.innerHTML = "<p>沒有找到結果。</p>";
    resultCount.textContent = "";
    return;
  }

  let html = "";
  let totalRows = 0;

  results.forEach((result) => {
    totalRows += result.values.length;
    html += "<table>";

    // 添加表頭
    html +=
      "<tr>" +
      result.columns
        .filter((col) => col.toLowerCase() !== "url")
        .map((col) => {
          const columnName = col.toLowerCase();
          let className = "sortable"; // 添加 sortable 類
          if (columnName === "number")
            className += " fixed-width number-column";
          else if (columnName === "published_at")
            className += " fixed-width date-column";
          else if (columnName === "duration")
            className += " fixed-width duration-column";
          else if (columnName === "title") className += " title-column";
          else if (columnName === "description")
            className += " description-column";
          return `<th id="${columnName}" class="${className}">${
            columnTranslation[columnName] || col
          }</th>`;
        })
        .join("") +
      "</tr>";

    // 添加表格內容
    result.values.forEach((row) => {
      html += "<tr>";
      row.forEach((cell, index) => {
        const columnName = result.columns[index].toLowerCase();
        if (columnName === "url") {
          return; // 跳過 URL 欄位
        }

        let cellContent = cell;
        let className = "";

        if (columnName === "number") {
          className = "fixed-width number-column";
        } else if (columnName === "title") {
          className = "title-column";
          const url =
            row[result.columns.findIndex((col) => col.toLowerCase() === "url")];
          cellContent = `<a href="${url}" target="_blank">${highlightKeyword(
            cell,
            keyword
          )}</a>`;
        } else if (columnName === "description") {
          className = "description-column";
          cellContent = keyword ? highlightKeyword(cell, keyword) : cell;
        } else if (columnName === "published_at") {
          cellContent = formatDate(cell);
          className = "fixed-width date-column";
        } else if (columnName === "duration") {
          cellContent = formatDuration(cell);
          className = "fixed-width duration-column";
        }

        html += `<td class="${className}">${cellContent}</td>`;
      });
      html += "</tr>";
    });
    html += "</table>";
  });

  // 更新結果數量
  resultCount.textContent = `共 ${totalRows} 筆結果`;

  // 將生成的 HTML 插入到結果容器中
  resultsContainer.innerHTML = html;
}

// 高亮關鍵字的函數
function highlightKeyword(text, keyword) {
  if (!keyword) return text;
  const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${escapedKeyword})`, "gi");
  return text.replace(regex, '<span class="highlight">$1</span>');
}

// 格式化日期的函數
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString("zh-TW", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false, // 使用24小時制
  });
}

// 格式化影片長度的函數
function formatDuration(duration) {
  if (!duration || typeof duration !== "string") {
    return "00:00:00"; // 如果輸入無效，返回默認值
  }

  if (duration === "P0D") {
    return "00:00:00"; // 處理 P0D 的情況
  }

  // 解析 ISO 8601 持續時間格式
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!matches) {
    return "00:00:00"; // 如果格式不匹配，返回默認值
  }

  let hours = matches[1] ? parseInt(matches[1]) : 0;
  let minutes = matches[2] ? parseInt(matches[2]) : 0;
  let seconds = matches[3] ? parseInt(matches[3]) : 0;

  // 確保分鐘和秒數不超過59
  minutes += Math.floor(seconds / 60);
  seconds = seconds % 60;
  hours += Math.floor(minutes / 60);
  minutes = minutes % 60;

  // 將時間格式化為 00:00:00
  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}

// 排序結果的函數
function sortResults(column) {
  if (column === currentSortColumn) {
    isAscending = !isAscending;
  } else {
    currentSortColumn = column;
    isAscending = true;
  }

  currentResults.forEach((result) => {
    const columnIndex = result.columns.findIndex(
      (col) => columnTranslation[col.toLowerCase()] === column
    );
    if (columnIndex !== -1) {
      result.values.sort((a, b) => {
        let valueA = a[columnIndex];
        let valueB = b[columnIndex];

        if (column === "編號") {
          return isAscending ? valueA - valueB : valueB - valueA;
        } else if (column === "上傳時間") {
          return isAscending
            ? new Date(valueA) - new Date(valueB)
            : new Date(valueB) - new Date(valueA);
        } else if (column === "影片長度") {
          // 將時間轉換為秒數進行比較
          const secondsA = convertDurationToSeconds(valueA);
          const secondsB = convertDurationToSeconds(valueB);
          return isAscending ? secondsA - secondsB : secondsB - secondsA;
        } else {
          return isAscending
            ? valueA.localeCompare(valueB)
            : valueB.localeCompare(valueA);
        }
      });
    }
  });

  displayResults(currentResults);
}

// 將持續時間轉換為秒數的輔助函數
function convertDurationToSeconds(duration) {
  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!matches) return 0;

  const hours = parseInt(matches[1] || 0);
  const minutes = parseInt(matches[2] || 0);
  const seconds = parseInt(matches[3] || 0);

  return hours * 3600 + minutes * 60 + seconds;
}

let currentResults = [];
let currentSortColumn = "";
let isAscending = true;

export {
  displayResults,
  highlightKeyword,
  formatDate,
  formatDuration,
  sortResults,
};
