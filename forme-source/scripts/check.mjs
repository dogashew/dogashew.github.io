import assert from 'node:assert/strict';
import fs from 'node:fs';
import {data,catalogData,looks,lookItems,photo,read} from '../src/data.js';
import {verifiedProducts} from '../src/verifiedProducts.js';
import {filterProducts} from '../src/catalog.js';
assert.equal(catalogData.length,47);assert.equal(verifiedProducts.length,19);assert.equal(verifiedProducts.filter(p=>p.category==='Лонгсливы').length,7);assert.equal(catalogData.find(p=>p.category==='Куртки').id,'bordered-cardigan');assert(!catalogData.some(p=>['hoodie','pocket-parka'].includes(p.id)));assert(catalogData.every(p=>p.post||p.sourceUrl));assert(!catalogData.some(p=>p.id==='longsleeve-ivory'));
assert.equal(looks.length,12);for(let i=0;i<looks.length;i++){const path=`public/images/model-cutout-${i}.webp`;assert(fs.existsSync(path));assert(fs.statSync(path).size<256000);}
const plain={colors:[],size:'',min:'',max:'',sort:'default'};
assert.equal(filterProducts(data,plain).length,data.length);
const caps=filterProducts(data,{...plain,colors:['Бежевый'],size:'Единый'});
assert.equal(caps.length,2);assert(caps.every(p=>p.category==='Кепки'));
assert.equal(filterProducts(data,{...plain,min:100000}).length,0);
const bounded=filterProducts(data,{...plain,min:7000,max:10000,sort:'desc'});assert(bounded.length>0);assert(bounded.every(p=>p.price>=7000&&p.price<=10000));assert(bounded.every((p,i)=>i===0||p.price<=bounded[i-1].price));
for(const p of data){assert(Number.isFinite(p.price)&&p.price>0);assert(p.sizes.length>0);assert(fs.existsSync('public'+photo(p)));assert(fs.statSync('public'+photo(p)).size<256000);}
assert.equal(new Set(data.map(x=>x.id)).size,data.length);assert.equal(lookItems.length,looks.length);for(const id of lookItems)assert(data.find(p=>p.id===id)?.parts.length);
const code=fs.readFileSync('src/data.js','utf8'),encoded=code.match(/Uint8Array.from\('([0-9a-f]+)'/)[1];for(const[oldId,newId]of Object.entries(JSON.parse(Buffer.from(encoded,'hex').toString()))){globalThis.localStorage={getItem:()=>JSON.stringify([{id:oldId,qty:2,size:'M'}])};assert.deepEqual(read('cart'),[{id:newId,qty:2,size:'M'}]);}delete globalThis.localStorage;
const bad=/lorem ipsum|FORME \/ (?:SELECTION|DETAILS)/i;
for(const file of fs.readdirSync('src')){const text=fs.readFileSync('src/'+file,'utf8');assert(!bad.test(text),'Forbidden interface copy: '+file);assert(!/[\p{Emoji_Presentation}\uFE0F\u200D]/u.test(text),'Emoji: '+file);}
assert(!/backdrop-filter|radial-gradient|box-shadow/.test(fs.readFileSync('src/style.css','utf8')));
console.log('Passed: filters, sort, prices, image paths/sizes, all looks, saved-cart migration, copy, icons and header styles.');
