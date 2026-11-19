import fs from 'node:fs';
import path from 'node:path';
import assert from 'node:assert/strict';
import {execFileSync} from 'node:child_process';
import {catalogData, looks} from '../src/data.js';
import {currentEditorials} from '../src/editorial.js';

const project = path.resolve(import.meta.dirname, '..');
const repository = path.resolve(process.argv[2] || path.join(project, '../forme-github-publish'));
assert(fs.existsSync(path.join(repository, '.git')), 'Expected an existing checkout');
const destination = path.join(repository, 'forme');
if(fs.existsSync(destination))assert(JSON.parse(fs.readFileSync(path.join(destination,'release.json'),'utf8')).name==='FORME','Only update a verified FORME directory');
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
const sourceCommit=execFileSync('git',['rev-parse','HEAD'],{cwd:project,encoding:'utf8'}).trim();
fs.writeFileSync(path.join(destination, 'release.json'), JSON.stringify({name:'FORME', sourceCommit, catalogProducts:catalogData.length, looks:looks.length, editorials:currentEditorials.length, base:'/forme/'}, null, 2)+'\n');
const sourceDestination = path.join(repository, 'forme-source');
for (const item of ['src', 'scripts', 'package.json', 'package-lock.json', 'index.html', '.gitignore', 'PHOTO-SOURCES.json']) {
  fs.cpSync(path.join(project, item), path.join(sourceDestination, item), {recursive: true});
}
for (const item of ['images', 'fonts']) fs.cpSync(path.join(project, 'dist', item), path.join(sourceDestination, 'public', item), {recursive:true});
const photoInputs=path.join(project,'references/catalog-photo-inputs.json');
if(fs.existsSync(photoInputs)){
  fs.mkdirSync(path.join(sourceDestination,'references'),{recursive:true});
  fs.copyFileSync(photoInputs,path.join(sourceDestination,'references/catalog-photo-inputs.json'));
  for(const item of JSON.parse(fs.readFileSync(photoInputs,'utf8'))){
    const sourcePhoto=path.resolve(project,item.path),targetPhoto=path.resolve(sourceDestination,item.path);
    assert(sourcePhoto.startsWith(path.join(project,'public')+path.sep)&&targetPhoto.startsWith(path.join(sourceDestination,'public')+path.sep));
    fs.mkdirSync(path.dirname(targetPhoto),{recursive:true});fs.copyFileSync(sourcePhoto,targetPhoto);
  }
}
fs.writeFileSync(path.join(sourceDestination, 'README.md'), '# FORME\n\nОтдельный магазин по адресу `/forme/`. Основной сайт Иман сохраняется.\n\nПроверка и сборка: `npm ci`, `npm run check`, `npm run build`. Для публикации под `/forme/` пути к assets, images и fonts должны иметь префикс `/forme/`. Готовая версия находится в соседней папке `forme/`.\n');
const workflowPath = path.join(repository, '.github/workflows/publish.yml');
let workflow = fs.readFileSync(workflowPath, 'utf8');
assert(workflow.includes('paths: [export.mjs, .github/workflows/publish.yml'));
workflow = workflow.replace('paths: [export.mjs, .github/workflows/publish.yml]', "paths: [export.mjs, .github/workflows/publish.yml, 'forme/**']");
const marker = '      - uses: actions/configure-pages@v5';
assert(workflow.includes(marker));
if(!workflow.includes('Include separate FORME storefront'))workflow = workflow.replace(marker, "      - name: Include separate FORME storefront\n        if: steps.export.outputs.changed == 'true'\n        run: cp -R forme github-pages/site/forme\n"+marker);
fs.writeFileSync(workflowPath, workflow);
console.log(JSON.stringify({destination, files:files(destination).length, source:sourceDestination, primarySite:'preserved'}));
