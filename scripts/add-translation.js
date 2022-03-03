const path = require('path');
const fs = require('fs');
const readline = require('readline');

const sortObject = (obj) =>
  [...new Set(Object.keys(obj))].sort().reduce((acc, key) => ({ ...acc, [key]: obj[key] }), {});

const addTranslationsThenSort = (answers) =>
  ['en', 'fr'].forEach((locale) => {
    const pathToTranslations = path.join(`src/locales/`, `${locale}.json`);
    const sfileContent = fs.readFileSync(pathToTranslations, 'utf8');
    const ofileContent = JSON.parse(sfileContent);
    if (Object.keys(ofileContent).includes(answers.key)) {
      console.log(
        `The key:${answers.key} already exists in ${pathToTranslations} and will be overwritten!`,
      );
    }
    const newFileContent = { [answers.key]: answers[locale], ...ofileContent };
    const sortedFileContent = sortObject(newFileContent);
    fs.writeFileSync(pathToTranslations, JSON.stringify(sortedFileContent, null, 2));
  });

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const nOfExpectedInputs = 3;

rl.question('Enter translation in the following format (key | fr | en) :', (input) => {
  const split = input.split('|');
  if (split.length !== nOfExpectedInputs || split.some((x) => !x)) {
    console.log('Input Invalid');
    rl.close();
    return;
  }
  const [key, fr, en] = split.map((x) => x?.trim());
  addTranslationsThenSort({
    key,
    fr,
    en,
  });
  rl.close();
});
