// main.js

import { initializeDatabase } from "./database.js";
import "./events.js"; // 這將執行 events.js 中的代碼

// 載入資料庫
import { base64Database } from "./base64Database.js";

// 初始化資料庫
initializeDatabase(base64Database);
