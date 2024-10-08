// display.js

// 欄位名稱轉換對照表
const videoColumnTranslation = {
  number: "編號",
  title: "影片標題",
  published_at: "上傳時間",
  duration: "影片長度",
  description: "影片說明",
  playlist_title: "播放清單",
};

const playlistColumnTranslation = {
  playlist_title: "播放清單標題",
};

// 顯示影片搜尋結果
function displayVideoResults(results) {
  currentVideoResults = results;
  const resultsContainer = document.getElementById("video-results");
  const resultCount = document.getElementById("video-result-count");
  const keyword = document.getElementById("video-query").value.trim();

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
      "<thead><tr>" +
      result.columns
        .filter(
          (col) =>
            col.toLowerCase() !== "url" &&
            col.toLowerCase() !== "video_id" &&
            col.toLowerCase() !== "playlist_id"
        )
        .map((col) => {
          const columnName = col.toLowerCase();
          let className = "sortable";
          if (columnName === "number")
            className += " fixed-width number-column";
          else if (columnName === "published_at")
            className += " fixed-width date-column";
          else if (columnName === "duration")
            className += " fixed-width duration-column";
          else if (columnName === "title") className += " title-column";
          else if (columnName === "description")
            className += " description-column";
          else if (columnName === "playlist_title")
            className += " playlist-column";
          return `<th id="${columnName}" class="${className}">${
            videoColumnTranslation[columnName] || col
          }</th>`;
        })
        .join("") +
      // "<th>播放清單</th>" +
      "</tr></thead><tbody>";

    // 添加表格內容
    result.values.forEach((row) => {
      html += "<tr>";
      const videoIdIndex = result.columns.findIndex(
        (col) => col.toLowerCase() === "video_id"
      );
      const videoId = row[videoIdIndex];

      row.forEach((cell, index) => {
        const columnName = result.columns[index].toLowerCase();
        if (
          columnName === "url" ||
          columnName === "video_id" ||
          columnName === "playlist_id"
        ) {
          return;
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
        } else if (columnName === "playlist_title") {
          className = "playlist-column";
          // url = https://www.youtube.com/playlist?list= + playlist_id
          const playlistId =
            row[
              result.columns.findIndex(
                (col) => col.toLowerCase() === "playlist_id"
              )
            ];
          const url = `https://www.youtube.com/playlist?list=${playlistId}`;

          cellContent = `<a href="${url}" target="_blank">${highlightKeyword(
            cell,
            keyword
          )}</a>`;
          // cellContent = keyword ? highlightKeyword(cell, keyword) : cell;
        }

        html += `<td class="${className}">${cellContent}</td>`;
      });

      // 添加播放清單欄位
      // const playlists = getPlaylistsForVideo(videoId);
      // let playlistsHtml = playlists
      //   .map(
      //     (playlist) =>
      //       `<a href="#" class="playlist-link" data-playlist-id="${playlist.playlist_id}">${playlist.playlist_title}</a>`
      //   )
      //   .join(", ");
      // html += `<td>${playlistsHtml}</td>`;

      html += "</tr>";
    });
    html += "</tbody></table>";
  });

  // 更新結果數量
  resultCount.textContent = `共 ${totalRows} 筆結果`;

  // 將生成的 HTML 插入到結果容器中
  resultsContainer.innerHTML = html;

  // 為播放清單連結添加點擊事件
  const playlistLinks = resultsContainer.querySelectorAll(".playlist-link");
  playlistLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      event.preventDefault();
      const playlistId = event.target.getAttribute("data-playlist-id");
      showPlaylistVideos(playlistId);
    });
  });
}

// 顯示播放清單搜尋結果
function displayPlaylistResults(results) {
  currentPlaylistResults = results;
  const resultsContainer = document.getElementById("playlist-results");
  const resultCount = document.getElementById("playlist-result-count");
  const keyword = document.getElementById("playlist-query").value.trim();

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
      "<thead><tr>" +
      result.columns
        .filter((col) => col.toLowerCase() !== "playlist_id") // 忽略 playlist_id 欄位
        .map((col) => {
          const columnName = col.toLowerCase();
          let className = "sortable";
          return `<th id="${columnName}" class="${className}">${
            playlistColumnTranslation[columnName] || col
          }</th>`;
        })
        .join("") +
      "<th>操作</th>" +
      "</tr></thead><tbody>";

    // 添加表格內容
    result.values.forEach((row) => {
      html += "<tr>";
      const playlistIdIndex = result.columns.findIndex(
        (col) => col.toLowerCase() === "playlist_id"
      );
      const playlistId = row[playlistIdIndex];
      row.forEach((cell, index) => {
        // 忽略 playlist_id 欄位
        if (result.columns[index].toLowerCase() === "playlist_id") {
          return;
        }

        const columnName = result.columns[index].toLowerCase();
        let cellContent = cell;
        const url = `https://www.youtube.com/playlist?list=${playlistId}`;

        if (columnName === "playlist_title") {
          cellContent = `<a href="${url}" target="_blank" class="playlist-link">${highlightKeyword(
            cell,
            keyword
          )}</a>`;
          // cellContent = `<a href="${url}" target="_blank">${highlightKeyword(
          //   cell,
          //   keyword
          // )}</a>`;
        }
        html += `<td>${cellContent}</td>`;
      });
      html += `<td><button class="view-playlist-videos" data-playlist-id="${playlistId}">查看影片</button></td>`;
      html += "</tr>";
    });
    html += "</tbody></table>";
  });

  // 更新結果數量
  resultCount.textContent = `共 ${totalRows} 筆結果`;

  // 將生成的 HTML 插入到結果容器中
  resultsContainer.innerHTML = html;

  // 為播放清單連結和按鈕添加點擊事件
  // const playlistLinks = resultsContainer.querySelectorAll(".playlist-link");
  // playlistLinks.forEach((link) => {
  //   link.addEventListener("click", function (event) {
  //     event.preventDefault();
  //     const playlistId = event.target.getAttribute("data-playlist-id");
  //     showPlaylistVideos(playlistId);
  //   });
  // });

  const viewButtons = resultsContainer.querySelectorAll(
    ".view-playlist-videos"
  );
  viewButtons.forEach((button) => {
    button.addEventListener("click", function (event) {
      const playlistId = event.target.getAttribute("data-playlist-id");
      showPlaylistVideos(playlistId);
    });
  });
}

// 顯示播放清單的影片
function showPlaylistVideos(playlistId) {
  const db = window.db; // 使用全局的 db 變量
  // 執行查詢，獲取該播放清單的影片
  const query = `
    SELECT v.number, v.title, v.url, v.published_at, v.duration, p.playlist_title, v.description
    FROM videos v
    INNER JOIN video_playlists vp ON v.video_id = vp.video_id
    INNER JOIN playlists p ON vp.playlist_id = p.playlist_id
    WHERE vp.playlist_id = '${playlistId}'
  `;

  try {
    const results = db.exec(query);
    // 切換到影片搜尋頁籤並顯示結果
    const videosTab = document.getElementById("videos-tab");
    const playlistsTab = document.getElementById("playlists-tab");
    const videosSection = document.getElementById("videos-section");
    const playlistsSection = document.getElementById("playlists-section");

    videosTab.classList.add("active");
    playlistsTab.classList.remove("active");
    videosSection.classList.add("active");
    playlistsSection.classList.remove("active");

    displayVideoResults(results);
  } catch (e) {
    document.getElementById(
      "video-results"
    ).innerHTML = `<p class="error">錯誤: ${e.message}</p>`;
  }
}

// 從資料庫中獲取影片所屬的播放清單
function getPlaylistsForVideo(videoId) {
  const db = window.db; // 使用全局的 db 變量
  const query = `
    SELECT playlists.playlist_title, playlists.playlist_id
    FROM playlists
    INNER JOIN video_playlists ON playlists.playlist_id = video_playlists.playlist_id
    WHERE video_playlists.video_id = '${videoId}'
  `;
  const results = db.exec(query);
  if (results.length > 0) {
    const data = results[0].values.map((row) => {
      return {
        playlist_title: row[0],
        playlist_id: row[1],
      };
    });
    return data;
  } else {
    return [];
  }
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
    hour12: false,
  });
}

// 格式化影片長度的函數
function formatDuration(duration) {
  if (!duration || typeof duration !== "string") {
    return "00:00:00";
  }

  if (duration === "P0D") {
    return "00:00:00";
  }

  const matches = duration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);

  if (!matches) {
    return "00:00:00";
  }

  let hours = matches[1] ? parseInt(matches[1]) : 0;
  let minutes = matches[2] ? parseInt(matches[2]) : 0;
  let seconds = matches[3] ? parseInt(matches[3]) : 0;

  minutes += Math.floor(seconds / 60);
  seconds = seconds % 60;
  hours += Math.floor(minutes / 60);
  minutes = minutes % 60;

  return [
    hours.toString().padStart(2, "0"),
    minutes.toString().padStart(2, "0"),
    seconds.toString().padStart(2, "0"),
  ].join(":");
}

// 排序影片結果的函數
function sortVideoResults(column) {
  // 您可以根据需要实现排序逻辑，类似于之前的 sortResults 函数
  if (column === currentSortColumn) {
    isAscending = !isAscending;
  } else {
    currentSortColumn = column;
    isAscending = true;
  }

  currentVideoResults.forEach((result) => {
    const columnIndex = result.columns.findIndex(
      (col) => videoColumnTranslation[col.toLowerCase()] === column
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

  displayVideoResults(currentVideoResults);
}

// 排序播放清單結果的函數
function sortPlaylistResults(column) {
  // 您可以根据需要实现排序逻辑，类似于之前的 sortResults 函数
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

let currentVideoResults = [];
let currentPlaylistResults = [];
let currentSortColumn = "";
let isAscending = true;

export {
  displayVideoResults,
  displayPlaylistResults,
  highlightKeyword,
  formatDate,
  formatDuration,
  sortVideoResults,
  sortPlaylistResults,
};
