// query.js

// import { db } from "./database.js";
import { displayVideoResults, displayPlaylistResults } from "./display.js";

/**
 * 執行影片關鍵字搜尋
 * @param {string} sortColumn - 要排序的欄位
 * @param {string} sortOrder - 排序順序 (ASC 或 DESC)
 */
function executeVideoQuery(sortColumn = "", sortOrder = "ASC") {
  const db = window.db; // 使用全局的 db 變量
  const keyword = document.getElementById("video-query").value.trim();
  let query;

  if (keyword) {
    query = `SELECT v.number, v.title, v.url, v.published_at, v.duration, p.playlist_title, v.description, p.playlist_id
             FROM videos v
             INNER JOIN video_playlists vp ON v.video_id = vp.video_id
             INNER JOIN playlists p ON vp.playlist_id = p.playlist_id
             WHERE v.title LIKE '%${escapeLike(keyword)}%' 
             OR v.description LIKE '%${escapeLike(keyword)}%'
             OR p.playlist_title LIKE '%${escapeLike(keyword)}%'`;
  } else {
    query = `SELECT v.number, v.title, v.url, v.published_at, v.duration, p.playlist_title, v.description, p.playlist_id
             FROM videos v
             INNER JOIN video_playlists vp ON v.video_id = vp.video_id
             INNER JOIN playlists p ON vp.playlist_id = p.playlist_id`;
  }

  if (sortColumn) {
    query += ` ORDER BY ${sortColumn} ${sortOrder}`;
  }

  try {
    const results = db.exec(query);
    displayVideoResults(results);
  } catch (e) {
    document.getElementById(
      "video-results"
    ).innerHTML = `<p class="error">錯誤: ${e.message}</p>`;
  }
}

/**
 * 執行播放清單關鍵字搜尋
 * @param {string} sortColumn - 要排序的欄位
 * @param {string} sortOrder - 排序順序 (ASC 或 DESC)
 */
function executePlaylistQuery(sortColumn = "", sortOrder = "ASC") {
  const db = window.db; // 使用全局的 db 變量
  const keyword = document.getElementById("playlist-query").value.trim();
  let query;

  if (keyword) {
    query = `SELECT playlist_title, playlist_id
             FROM playlists
             WHERE playlist_title LIKE '%${escapeLike(keyword)}%'`;
  } else {
    query = `SELECT playlist_title, playlist_id
             FROM playlists`;
  }

  if (sortColumn) {
    query += ` ORDER BY ${sortColumn} ${sortOrder}`;
  }

  try {
    const results = db.exec(query);
    displayPlaylistResults(results);
  } catch (e) {
    document.getElementById(
      "playlist-results"
    ).innerHTML = `<p class="error">錯誤: ${e.message}</p>`;
  }
}

/**
 * 避免 LIKE 查詢中的特殊字元導致 SQL 語法錯誤
 * @param {string} input - 使用者輸入的關鍵字
 * @returns {string} - 轉義後的關鍵字
 */
function escapeLike(input) {
  return input.replace(/[%_]/g, "\\$&");
}

export { executeVideoQuery, executePlaylistQuery };
