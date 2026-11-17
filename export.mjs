// Publish only anonymous, public CMS responses. Never copy the CMS worker or backups.
import {mkdir,writeFile,readFile,appendFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import path from 'node:path';
const source='https://iman-center-website.pages.dev';
const canonical='https://rc-iman.ru';
const output=path.resolve(process.env.EXPORT_DIR||'github-pages/site');
const assets=new Map();
const pageContent=new Map();
function target(p){
  const file=path.resolve(output,'.'+p);
  if(!file.startsWith(output+path.sep))throw Error('Invalid output path');
  return file;
}
async function save(p,data){const file=target(p);await mkdir(path.dirname(file),{recursive:true});await writeFile(file,data);}
async function get(p){
  const u=new URL(p,source);
  if(u.origin!==source||/^\/(admin|api)(\/|$)/.test(u.pathname))throw Error('Nonpublic path');
  for(let attempt=0;attempt<3;attempt++){
    try{
      const r=await fetch(u,{redirect:'error',signal:AbortSignal.timeout(120000)});
      if(!r.ok)throw Error(`${r.status}: ${u.pathname}`);
      const b=Buffer.from(await r.arrayBuffer());
      if(b.length>95*1024*1024)throw Error('Asset exceeds Pages file limit');
      return b;
    }catch(e){if(attempt===2)throw Error(`Download failed: ${u.pathname}: ${e.message}`);}
  }
}
function collect(text){
  // Existing renderer emits absolute /assets and /media paths in HTML, CSS and JS.
  for(const m of text.matchAll(/\/(?:assets|media)\/[a-zA-Z0-9_./%?=&+~-]+/g)){
    const u=new URL(m[0].replaceAll('&amp;','&'),source);
    if(!u.pathname.includes('..'))assets.set(u.pathname,u.pathname+u.search);
  }
}
function rewrite(s){return s.replaceAll(source,canonical);}
async function parallel(items,fn){
  let next=0;
  await Promise.all(Array.from({length:4},async()=>{while(next<items.length)await fn(items[next++]);}));
}
const sitemap=(await get('/sitemap.xml')).toString();
const pages=[...new Set(['/',...Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g),m=>new URL(m[1]).pathname)])];
if(pages.length<10||pages.length>300)throw Error('Unexpected sitemap size');
await parallel(pages,async p=>{
  if(!/^\/[a-zA-Z0-9_/-]*$/.test(p))throw Error('Invalid page path');
  const html=rewrite((await get(p)).toString());
  if(!html.includes('</html>')||!html.includes('<main'))throw Error(`Incomplete page: ${p}`);
  collect(html);
  pageContent.set(p,html);
  await save((p==='/'?'':p.replace(/\/$/,''))+'/index.html',html);
});
const digest=createHash('sha256').update('export-v2').update(sitemap).update(JSON.stringify([...pageContent].sort(([a],[b])=>a.localeCompare(b)))).digest('hex');
let previous={};
try{previous=JSON.parse(await readFile('published.json','utf8'));}catch{}
const changed=previous.digest!==digest||process.env.FORCE_PUBLISH==='true';
if(process.env.GITHUB_OUTPUT)await appendFile(process.env.GITHUB_OUTPUT,`changed=${changed}\n`);
await writeFile('next-published.json',JSON.stringify({digest,checkedMonth:new Date().toISOString().slice(0,7)},null,2)+'\n');
if(!changed){console.log('Published content is current');process.exit(0);}
const downloaded=new Set();
while([...assets.keys()].some(p=>!downloaded.has(p))){
  await parallel([...assets.entries()].filter(([p])=>!downloaded.has(p)),async([p,url])=>{
    // Cache is a local build optimization; never use it for public HTML or uploaded photos.
    let bytes;
    if(p.startsWith('/assets/')||p.startsWith('/media/videos/')){
      try{bytes=await readFile(target(p));}catch{}
    }
    bytes??=await get(url);
    if(/\.(css|js)$/.test(p))collect(bytes.toString());
    await save(p,bytes);downloaded.add(p);
    if(downloaded.size%25===0)console.log(`Exported ${downloaded.size} assets`);
  });
}
await save('/sitemap.xml',rewrite(sitemap));
await save('/robots.txt','User-agent: *\nAllow: /\nDisallow: /admin\nSitemap: https://rc-iman.ru/sitemap.xml\n');
await save('/.nojekyll','');
await save('/admin/index.html','<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="robots" content="noindex"><meta http-equiv="refresh" content="0;url=https://rc-iman-center.netlify.app/admin"><title>Управление Иман</title><a href="https://rc-iman-center.netlify.app/admin">Открыть админку</a></html>');
await save('/404.html','<!doctype html><html lang="ru"><meta charset="utf-8"><meta name="robots" content="noindex"><title>Страница не найдена — Иман</title><h1>Страница не найдена</h1><a href="/">На главную</a></html>');
console.log(JSON.stringify({pages:pages.length,assets:downloaded.size,output}));
