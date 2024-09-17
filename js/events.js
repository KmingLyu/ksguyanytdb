// events.js

import { executeQuery } from "./query.js";
import { sortResults } from "./display.js";

// 在文檔加載完成後執行
document.addEventListener("DOMContentLoaded", function () {
  // 獲取輸入框元素
  const queryInput = document.getElementById("query");

  // 為輸入框添加鍵盤事件監聽器
  queryInput.addEventListener("keypress", function (event) {
    // 檢查是否按下了 Enter 鍵
    if (event.key === "Enter") {
      // 阻止默認的表單提交行為
      event.preventDefault();
      // 執行搜尋
      executeQuery();
    }
  });

  // 可選：為搜尋按鈕添加點擊事件
  const searchButton = document.getElementById("search-button");
  if (searchButton) {
    searchButton.addEventListener("click", function () {
      executeQuery();
    });
  }

  // 為表格標題添加事件
  document.addEventListener("click", handleThClick);
});

function handleThClick(event) {
  if (
    event.target.tagName === "TH" &&
    event.target.classList.contains("sortable")
  ) {
    sortResults(event.target.textContent);
  }
}

export {};
