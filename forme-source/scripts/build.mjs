import {spawnSync} from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import {data,photo,looks} from '../src/data.js';
const result=spawnSync(process.execPath,[path.resolve('node_modules/vite/bin/vite.js'),'build'],{stdio:'inherit'});
if(result.status!==0)process.exit(result.status||1);
// Publish only assets used by this release; originals remain untouched in public/.
const root=path.resolve('dist');
const keep=new Set([...data.map(p=>photo(p).slice(1)),...looks.map((_,i)=>`images/model-cutout-${i}.webp`),'images/hero-01.webp','images/hero-02.webp','images/hero-03.webp','fonts/Heraclito-Thin.ttf','fonts/uncage/uncage/UNCAGE Font/UNCAGE-Regular.otf']);
for(const directory of ['images','fonts'])for(const name of fs.readdirSync(path.join(root,directory),{recursive:true})){const relative=directory+'/'+name.replaceAll('\\','/'),target=path.resolve(root,relative);if(!target.startsWith(root+path.sep))throw Error('Asset path outside build');if(fs.statSync(target).isFile()&&!keep.has(relative))fs.unlinkSync(target);}
console.log('Published media set: '+keep.size+' files; source originals retained.');
