import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';

const project = path.resolve(import.meta.dirname, '..');
const repository = path.resolve(process.argv[2] || path.join(project, '../forme-github-publish'));
assert(fs.existsSync(path.join(repository, '.git')), 'Expected an existing checkout');
const destination = path.join(repository, 'forme');
assert(!fs.existsSync(destination), 'FORME destination already exists; inspect before replacing');
fs.cpSync(path.join(project, 'dist'), destination, {recursive: true});
const files = directory => fs.readdirSync(directory, {withFileTypes: true}).flatMap(entry => {
  const filename = path.join(directory, entry.name);
  return entry.isDirectory() ? files(filename) : [filename];
});
for (const filename of files(destination).filter(file => /\.(html|js|css)$/.test(file))) {
  const source = fs.readFileSync(filename, 'utf8');
  const adapted = source.replace(/(["'`(])\/(images|fonts|assets)\//g, '$1/forme/$2/');
  assert(!/(["'`(])\/(images|fonts|assets)\//.test(adapted));
  fs.writeFileSync(filename, adapted);
}
fs.writeFileSync(path.join(destination, '.nojekyll'), '');
fs.writeFileSync(path.join(destination, 'release.json'), JSON.stringify({name:'FORME', sourceCommit:'d17f4d5e67c26fff95ff1520dd93d4c59a7200fc', catalogProducts:47, looks:12, base:'/forme/'}, null, 2)+'\n');
const sourceDestination = path.join(repository, 'forme-source');
for (const item of ['src', 'scripts', 'package.json', 'package-lock.json', 'index.html', '.gitignore']) {
  fs.cpSync(path.join(project, item), path.join(sourceDestination, item), {recursive: true});
}
for (const item of ['images', 'fonts']) fs.cpSync(path.join(project, 'dist', item), path.join(sourceDestination, 'public', item), {recursive:true});
fs.writeFileSync(path.join(sourceDestination, 'README.md'), '# FORME\n\nОтдельный магазин по адресу `/forme/`. Основной сайт Иман сохраняется.\n\nПроверка и сборка: `npm ci`, `npm run check`, `npm run build`. Для публикации под `/forme/` пути к assets, images и fonts должны иметь префикс `/forme/`. Готовая версия находится в соседней папке `forme/`.\n');
const workflowPath = path.join(repository, '.github/workflows/publish.yml');
let workflow = fs.readFileSync(workflowPath, 'utf8');
assert(workflow.includes('paths: [export.mjs, .github/workflows/publish.yml]'));
workflow = workflow.replace('paths: [export.mjs, .github/workflows/publish.yml]', "paths: [export.mjs, .github/workflows/publish.yml, 'forme/**']");
const marker = '      - uses: actions/configure-pages@v5';
assert(workflow.includes(marker));
workflow = workflow.replace(marker, "      - name: Include separate FORME storefront\n        if: steps.export.outputs.changed == 'true'\n        run: cp -R forme github-pages/site/forme\n"+marker);
fs.writeFileSync(workflowPath, workflow);
console.log(JSON.stringify({destination, files:files(destination).length, source:sourceDestination, primarySite:'preserved'}));
