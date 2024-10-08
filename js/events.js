// events.js

import { executeVideoQuery, executePlaylistQuery } from "./query.js";
import { sortVideoResults, sortPlaylistResults } from "./display.js";

// 在文檔加載完成後執行
document.addEventListener("DOMContentLoaded", function () {
  // Tab 切換功能
  const videosTab = document.getElementById("videos-tab");
  const playlistsTab = document.getElementById("playlists-tab");
  const videosSection = document.getElementById("videos-section");
  const playlistsSection = document.getElementById("playlists-section");

  videosTab.addEventListener("click", function () {
    videosTab.classList.add("active");
    playlistsTab.classList.remove("active");
    videosSection.classList.add("active");
    playlistsSection.classList.remove("active");
  });

  playlistsTab.addEventListener("click", function () {
    playlistsTab.classList.add("active");
    videosTab.classList.remove("active");
    playlistsSection.classList.add("active");
    videosSection.classList.remove("active");
  });

  // 為影片搜尋添加事件
  const videoQueryInput = document.getElementById("video-query");
  videoQueryInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      executeVideoQuery();
    }
  });

  const videoSearchButton = document.getElementById("video-search-button");
  videoSearchButton.addEventListener("click", function () {
    executeVideoQuery();
  });

  // 為播放清單搜尋添加事件
  const playlistQueryInput = document.getElementById("playlist-query");
  playlistQueryInput.addEventListener("keypress", function (event) {
    if (event.key === "Enter") {
      event.preventDefault();
      executePlaylistQuery();
    }
  });

  const playlistSearchButton = document.getElementById(
    "playlist-search-button"
  );
  playlistSearchButton.addEventListener("click", function () {
    executePlaylistQuery();
  });

  // 為表格標題添加事件
  document.addEventListener("click", handleThClick);
});

function handleThClick(event) {
  if (
    event.target.tagName === "TH" &&
    event.target.classList.contains("sortable")
  ) {
    const section = event.target.closest(".section");
    const column = event.target.textContent;
    if (section && section.id === "videos-section") {
      sortVideoResults(column);
    } else if (section && section.id === "playlists-section") {
      sortPlaylistResults(column);
    }
  }
}

export {};
