// query.js

import { db } from "./database.js";
import { displayResults } from "./display.js";

function executeQuery(sortColumn = "", sortOrder = "ASC") {
  const keyword = document.getElementById("query").value.trim();
  let query;

  if (keyword) {
    query = `SELECT number, title, url, published_at, duration, description 
             FROM videos 
             WHERE title LIKE '%${keyword}%' OR description LIKE '%${keyword}%'`;
  } else {
    query = `SELECT number, title, url, published_at, duration, description 
             FROM videos`;
  }

  if (sortColumn) {
    query += ` ORDER BY ${sortColumn} ${sortOrder}`;
  }

  try {
    const results = db.exec(query);
    displayResults(results);
  } catch (e) {
    document.getElementById(
      "results"
    ).innerHTML = `<p class="error">錯誤: ${e.message}</p>`;
  }
  // console.log(sortColumn);
  // console.log(query);
}

export { executeQuery };
