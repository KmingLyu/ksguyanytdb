// database.js

// 將 base64 編碼的資料庫轉換為二進制數組
function getDatabaseBytes(base64Database) {
  const binaryString = atob(base64Database);
  const bytes = new Uint8Array(binaryString.length);
  for (let i = 0; i < binaryString.length; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

// 初始化 SQL.js 並載入資料庫
async function initializeDatabase(base64Database) {
  const bytes = getDatabaseBytes(base64Database);

  const SQL = await window.initSqlJs({
    locateFile: (file) =>
      `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.6.2/${file}`,
  });

  const db = new SQL.Database(bytes);
  console.log("資料庫已成功載入");
  return db; // 返回已初始化的資料庫實例
}

export { initializeDatabase };
