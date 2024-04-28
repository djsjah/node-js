const fs = require('fs'); // Для работы с файловой системой
const path = require('path'); // Для работы с путями файлов и директорий
const cheerio = require('cheerio'); // Для парсинга HTML-документов

const DIR_PATH = './fragment'; // Директория, в которой ищем файлы
const SUBSTRING = 'Hello World!'; // Подстрока, которую ищем в параграфах файлов

// Основная функция для начала работы

function main() {
  const files = getFileArray(DIR_PATH, ['.html', '.htm']); // Получаем массив всех файлов .html и .htm из DIR_PATH
  console.log("\nЗадание 6: ");

  // Для каждого файла из полученного массива files - создаем путь до этого файла и записываем в filePath.
  // После ищем количество параграфов с заданной подстрокой и записываем в paragraphCount.
  // В конце - логирование результата
  files.forEach(file => {
    const filePath = path.join(DIR_PATH, file);
    const paragraphCount = searchSubstrInFile(filePath, SUBSTRING);
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
  return fs.readdirSync(dir).filter(file => { // Синхронно читаем содержимое директории, указанной в dir
    // Записываем в массив только тот файл, который имеет расширение, определенное в extensions
    return extensions.includes(path.extname(file));
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
