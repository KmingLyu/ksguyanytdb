// main.js

import { initializeDatabase } from "./database.js";
import { executeVideoQuery } from "./query.js";
import "./events.js"; // 這將執行 events.js 中的代碼

// 載入資料庫
import { base64Database } from "./base64Database.js";

// 初始化資料庫並在完成後執行其他操作
initializeDatabase(base64Database)
  .then((db) => {
    // 將資料庫實例傳遞給需要的模組
    window.db = db; // 或者將 db 設置為全局變量

    // 在資料庫初始化完成後執行的代碼
    // executeVideoQuery(); // 可選：執行一次默認查詢
  })
  .catch((error) => {
    console.error("資料庫載入失敗:", error);
  });
