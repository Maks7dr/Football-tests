document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector("table");
  table.style.display = "none"; // Скрываем оригинальную таблицу

  const rows = Array.from(table.querySelectorAll("tr")).slice(1); // Убираем заголовки

  const data = rows.map((row) => {
    const cells = row.querySelectorAll("td");
    return {
      name: cells[1].innerText,
      jump: parseInt(cells[2].innerText),
      sprint: parseFloat(cells[3].innerText),
      juggling: parseInt(cells[4].innerText),
      yoYo: parseFloat(cells[5].innerText),
    };
  });

  // Присвоение мест по категориям
  const rankCategory = (arr, key, ascending = false) => {
    const sorted = [...arr].sort((a, b) =>
      ascending ? a[key] - b[key] : b[key] - a[key]
    );
    let rank = 1;
    for (let i = 0; i < sorted.length; i++) {
      if (i > 0 && sorted[i][key] !== sorted[i - 1][key]) rank = i + 1;
      sorted[i][`${key}Rank`] = rank;
    }
  };

  rankCategory(data, "jump", false);
  rankCategory(data, "sprint", true);
  rankCategory(data, "juggling", false);
  rankCategory(data, "yoYo", false);

  // Подсчёт итогового рейтинга
  data.forEach((player) => {
    player.totalRank =
      player.jumpRank +
      player.sprintRank +
      player.jugglingRank +
      player.yoYoRank;
  });

  // Сортировка по наименьшему суммарному рейтингу
  data.sort((a, b) => a.totalRank - b.totalRank);

  // Вывод отсортированных результатов
  const resultTable = document.createElement("table");
  resultTable.innerHTML = `
        <tr>
            <th>Место</th>
            <th>Имя</th>
            <th>Прижок</th>
            <th>30 м (с)</th>
            <th>Набивание</th>
            <th>Йо-йо</th>
            <th>Сумма баллов</th>
        </tr>
    `;

  let place = 1;
  for (let i = 0; i < data.length; i++) {
    if (i > 0 && data[i].totalRank !== data[i - 1].totalRank) place = i + 1;
    const row = document.createElement("tr");

    // Выделяем цветом топ-5 по каждой категории
    const highlightClass = (rank) => (rank <= 5 ? "highlight" : "");
    const nameHighlight = place <= 3 ? "winner" : "";

    row.innerHTML = `
            <td>${place}</td>
            <td class="${nameHighlight}">${data[i].name}</td>
            <td class="${highlightClass(data[i].jumpRank)}">${
      data[i].jump
    } см</td>
            <td class="${highlightClass(data[i].sprintRank)}">${data[
      i
    ].sprint.toFixed(2)} с</td>
            <td class="${highlightClass(data[i].jugglingRank)}">${
      data[i].juggling
    } раз</td>
            <td class="${highlightClass(data[i].yoYoRank)}">${data[i].yoYo}</td>
            <td>${data[i].totalRank}</td>
        `;
    resultTable.appendChild(row);
  }

  document.body.appendChild(resultTable);

  // Добавляем стили
  const style = document.createElement("style");
  style.innerHTML = `
        .highlight { background-color: yellow; }
        .winner { font-weight: bold; color: red; }
    `;
  document.head.appendChild(style);
});
