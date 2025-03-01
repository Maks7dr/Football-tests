document.addEventListener("DOMContentLoaded", () => {
  const table = document.querySelector("table");
  const rows = Array.from(table.querySelectorAll("tr")).slice(1); // Убираем заголовки
  table.style.display = "none"; // Скрываем оригинальную таблицу

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
    row.innerHTML = `
            <td>${place}</td>
            <td>${data[i].name}</td>
            <td>${data[i].jump} см</td>
            <td>${data[i].sprint.toFixed(2)} с</td>
            <td>${data[i].juggling} раз</td>
            <td>${data[i].yoYo}</td>
            <td>${data[i].totalRank}</td>
        `;
    resultTable.appendChild(row);
  }

  document.body.appendChild(resultTable);
});
