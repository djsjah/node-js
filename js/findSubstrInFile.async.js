const fs = require('fs').promises; // Для работы с файловой системой. Используем асинхронные версии функций fs
const path = require('path'); // Для работы с путями файлов и директорий
const cheerio = require('cheerio'); // Для парсинга HTML-документов

const DIR_PATH = '../fragment'; // Директория, в которой ищем файлы
const SUBSTRING = 'Hello World'; // Подстрока, которую ищем в параграфах файлов

// Основная функция для начала работы

async function main() {
  const files = await getFileArray(DIR_PATH, ['.html', '.htm']); // Получаем массив всех файлов .html и .htm из DIR_PATH
  console.log("\nЗадание 6: ");

  // Для каждого файла из полученного массива files:
  // Ищем количество параграфов с заданной подстрокой и записываем в paragraphCount.
  // В конце - логирование результата
  for (const file of files) {
    const paragraphCount = await searchSubstrInFile(file);
    console.log(
      `
      Файл: ${file} имеет ${paragraphCount} параграфов с подстрокой "${SUBSTRING}"
      `
    );
  }
}

main().catch((err) => {
  console.log(err);
});

// Рекурсивная функция, позволяющая получить массив определенных файлов в заданной директории

async function getFileArray(dir, extensions) {
  let allFiles = [];

  const files = await fs.readdir(dir); // Асинхронно читаем содержимое директории, указанной в dir

  for (const file of files) {
    const fullPath = path.join(dir, file); // Создаем путь
    const stats = await fs.stat(fullPath); // Асинхронно собираем статистику

    if (stats.isDirectory()) {
      // Если элемент является директорией, рекурсивно вызываем функцию и добавляем результаты в allFiles
      const subFiles = await getFileArray(fullPath, extensions);
      allFiles = allFiles.concat(subFiles); // Добавляем результаты рекурсивного вызова в общий массив
    }
    else if (extensions.includes(path.extname(file))) {
      // Если элемент является файлом и имеет нужное расширение, добавляем его в список
      allFiles.push(fullPath);
    }
  }

  return allFiles;
}

// Функция, позволяющая найти заданную подстроку в определенном файле

async function searchSubstrInFile(filePath) {
  const content = await fs.readFile(filePath, 'utf-8'); // Асинхронно читаем содержимое файла по пути filePath
  const $ = cheerio.load(content); // Загружаем полученное содержимое в cheerio

  // Ищем с помощью cheerio все параграфы с заданной подстрокой внутри полученного содержимого файла
  const paragraphs = $('p').filter((i, el) => $(el).text().includes(SUBSTRING));
  return paragraphs.length;
}
