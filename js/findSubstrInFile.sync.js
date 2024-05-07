const fs = require('fs'); // Для работы с файловой системой
const path = require('path'); // Для работы с путями файлов и директорий
const cheerio = require('cheerio'); // Для парсинга HTML-документов

const DIR_PATH = '../fragment'; // Директория, в которой ищем файлы
const SUBSTRING = 'Hello World!'; // Подстрока, которую ищем в параграфах файлов

// Основная функция для начала работы

function main() {
  const files = getFileArray(DIR_PATH, ['.html', '.htm']); // Получаем массив всех файлов .html и .htm из DIR_PATH
  console.log("\nЗадание 6: ");

  // Для каждого файла из полученного массива files:
  // Ищем количество параграфов с заданной подстрокой и записываем в paragraphCount.
  // В конце - логирование результата
  files.forEach(file => {
    const paragraphCount = searchSubstrInFile(file, SUBSTRING);
    console.log(
      `

      Файл: ${file} имеет ${paragraphCount} параграфов с подстрокой "${SUBSTRING}"
      `
    );
  });
}

main();

// Функция, позволяющая получить массив определенных файлов в заданной директории

function getFileArray(dir, extensions) {
  // Создаем массив для хранения путей к файлам
  let allFiles = [];

  // Начинаем обход с указанной директории
  recursiveDirTraver(dir, extensions, allFiles);

  return allFiles;
}

// Функция для обхода директорий и поддиректорий

function recursiveDirTraver(dirPath, extensions, allFiles) {
  const files = fs.readdirSync(dirPath); // Синхронно читаем содержимое директории, указанной в dirPath

  files.forEach(file => {
    const fullPath = path.join(dirPath, file); // Создаем путь
    const stats = fs.statSync(fullPath); // Собираем статистику

    if (stats.isDirectory()) {
      // Если элемент является директорией, рекурсивно вызываем функцию
      recursiveDirTraver(fullPath, extensions, allFiles);
    }
    else if (extensions.includes(path.extname(file))) {
      // Если элемент является файлом и имеет нужное расширение, добавляем его в список
      allFiles.push(fullPath);
    }
  });
}

// Функция, позволяющая найти заданную подстроку в определенном файле

function searchSubstrInFile(filePath, substr) {
  const content = fs.readFileSync(filePath, 'utf-8'); // Синхронно читаем содержимое файла по пути filePath
  const $ = cheerio.load(content); // Загружаем полученное содержимое в cheerio

  // Ищем с помощью cheerio все параграфы с заданной подстрокой внутри полученного содержимого файла
  const paragraphs = $('p').filter((i, el) => $(el).text().includes(substr));
  return paragraphs.length;
}
