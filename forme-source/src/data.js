import {verifiedProducts} from './verifiedProducts.js';
import {productDetails} from './productDetails.js';
const source='https://www.instagram.com/neqaxo_grozny_/';
const data=[['zip-jacket','Трикотажный кардиган на молнии','Куртки','Коричневый','#675349','ed821c2b177a79ab','Dfr-y08RVCM'],['longsleeve','Лонгслив с круглым принтом','Лонгсливы','Молочный','#e8e5dc','221149a1485a9c77','DfnNu19x_0A'],['sweatshirt','Свитшот с круглым вырезом','Свитшоты','Серо-синий','#6f7c89','9e4f26ef3c7e2683','DfmX8KYx2vM'],['bomber','Бомбер с накладным карманом','Куртки','Серый','#929995','fefb6622a25b8a47','Dfh9qP9xAHY'],['hoodie','Худи с графическим принтом','Худи','Чёрный','#28292b','b2885f8c40d9f17d','DfcqkV-Rnxn'],['zip-hoodie','Худи на молнии','Худи','Тёмно-синий','#262b33','4ce4fcf0d5b12a52','DfXip6Yxcz6']].map(([id,name,category,color,hex,photo,post])=>({id,name,category,color,hex,photo,post}));
data.push(...[['cargo','Брюки карго','Брюки','Молочный','#e8e5dc','DfmX8KYx2vM'],['denim','Джинсы прямого кроя','Джинсы','Синий','#607d99','Dfr-y08RVCM']].map(([id,name,category,color,hex,post])=>({id,name,category,color,hex,post})));
data.push(...[['cap-wool','Кепка из шерстяной ткани','Кепки','Бежевый','#d5c4ac','https://www.instagram.com/neqaxo_grozny_/'],['cap-embroidered','Кепка с вышитой эмблемой','Кепки','Чёрный','#222','https://www.instagram.com/neqaxo_grozny_/'],['cap-emblem','Кепка с вышитой эмблемой','Кепки','Тёмно-синий','#262b33','https://www.instagram.com/neqaxo_grozny_/'],['sport-set','Спортивный комплект','Комплекты','Тёмно-синий','#262b33','https://www.instagram.com/neqaxo_grozny_/']].map(([id,name,category,color,hex,reference])=>({id,name,category,color,hex,reference})));
data.push(...[['blue-set','Комплект с контрастной строчкой','Комплекты','Синий','#344d70','8a08b23f67f651df','DfSdzqLxPRl'],['navy-cargo-set','Комплект с курткой и карго','Комплекты','Тёмно-синий','#262b33','7364a58d757706d2','DfPjZe8AhZ9'],['taupe-set','Комплект с лёгкой ветровкой','Комплекты','Тауп','#998a79','e2a083856ff925f0','DfNeh5DRVTe'],['grey-hoodie','Худи на молнии','Худи','Серый','#a6a7a7','455dd5eac3ce9ce0','DfFuKb1t9jG']].map(([id,name,category,color,hex,photo,post])=>({id,name,category,color,hex,photo,post})));
data.push(...[['cap-embroidered-white','Светлая кепка с вышивкой','Молочный','#eee8db','https://www.instagram.com/neqaxo_grozny_/'],['cap-wool-brown','Кепка из коричневой шерстяной ткани','Коричневый','#70432b','https://www.instagram.com/neqaxo_grozny_/'],['cap-emblem-sand','Кепка с вышитой эмблемой','Бежевый','#d5c4ac','https://www.instagram.com/neqaxo_grozny_/']].map(([id,name,color,hex,reference])=>({id,name,color,hex,reference,category:'Кепки'})));
const prices=[12900,5900,7900,15900,11900,13900,8900,9900,7500,4900,6500,22900,18900,19900,18900,10900,4900,7500,6500];
data.forEach((p,i)=>p.price=prices[i]);
const money=n=>new Intl.NumberFormat('ru-RU').format(n)+' ₽';
const groups=['Куртки','Худи','Лонгсливы','Брюки','Джинсы','Кепки','Свитшоты','Комплекты','Кошельки'];
const looks=[['Лёгкая куртка','Тёмно-синий','#263746','куртка и светлое поло'],['Многослойный силуэт','Тёмно-синий','#263746','жилет и трикотаж'],['Городской пуховик','Чёрный','#222','пуховик и деним'],['Деним целиком','Синий','#607d99','джинсовый комплект']];
looks.push(['Тёплые оттенки','Коричневый','#79604a','пальто и трикотаж'],['Чистый силуэт','Тёмно-синий','#263746','куртка и брюки'],['Фактурный трикотаж','Синий','#29374c','джемпер и панама'],['Мягкий костюм','Карамельный','#936941','костюм с трикотажем'],['Лёгкий слой','Серый','#85817f','куртка и поло'],['Вечерний силуэт','Тёмно-синий','#202b3a','жакет и трикотаж']);
const outfitParts=[["Куртка с четырьмя карманами","Белое поло с отделкой","Тёмно-синие брюки","Белые кеды"],["Стёганый жилет с капюшоном","Тёмно-синий джемпер","Тёмно-синие брюки","Синие кроссовки"],["Чёрная стёганая куртка","Чёрная футболка","Синие джинсы","Чёрные кожаные туфли"],["Джинсовая куртка","Джинсы в тон","Белое бельё","Чёрные кожаные туфли"],["Коричневое пальто","Бежевый джемпер на молнии","Бежевые трикотажные брюки","Шапка","Шерстяные носки","Чёрные лоферы","Коричневая сумка"],["Тёмно-синяя куртка","Тёмный трикотаж","Брюки в тон","Узорный шейный платок","Чёрные лоферы"],["Фактурный джемпер на молнии","Тёмная водолазка","Синие брюки","Тёмная панама","Коричневые топсайдеры"],["Карамельный пиджак","Джемпер на молнии","Брюки в тон","Узорный шейный платок","Коричневые туфли"],["Серая куртка","Голубое поло","Тёмные джинсы","Бежевые кеды"],["Тёмно-синий пиджак","Джемпер на молнии","Светлый нижний слой","Брюки в тон","Коричневые лоферы"]];
const outfitPalettes=[["#263746","#fafafa"],["#263746"],["#222","#607d99"],["#607d99","#222"],["#79604a","#c4b7a0","#222"],["#263746","#222"],["#29374c","#604732"],["#936941","#604732"],["#85817f","#81a8bf","#263746"],["#202b3a","#604732"]];
looks.push(['Контрастный трикотаж','Тёмно-синий','#263746','кардиган с окантовкой и карго'],['Клетка и спокойные оттенки','Оливковый','#7d7c65','клетчатая рубашка и карго']);
outfitParts.push(['Кардиган с контрастной окантовкой','Белая футболка','Тёмно-синие карго','Тёмно-синие кроссовки'],['Клетчатая рубашка с накладным карманом','Белая футболка','Оливковые карго','Бежевые кроссовки']);
outfitPalettes.push(['#263746','#c8ccd2','#fafafa'],['#7d7c65','#b7afa0','#fafafa']);
const lookItems=looks.map((l,i)=>'outfit-'+i);
data.push(...looks.map((l,i)=>({id:lookItems[i],name:'Образ '+String(i+1).padStart(2,'0')+' · '+l[0],category:'Комплекты',color:l[1],hex:l[2],parts:outfitParts[i],palette:outfitPalettes[i],price:[34900,36900,29900,27900,64900,42900,38900,54900,32900,49900,37900,32900][i],reference:source})));
const lookCount=looks.length;
const lookNumber=n=>String(n+1).padStart(2,'0');
const photo=p=>'/images/'+p.id+'-product.webp';
function read(k){try{let x=JSON.parse(localStorage.getItem(k));const aliases=JSON.parse(new TextDecoder().decode(Uint8Array.from('7b226361702d6c6f726f2d62726f776e223a226361702d776f6f6c2d62726f776e222c226361702d6c6f726f223a226361702d776f6f6c222c226361702d636b2d7768697465223a226361702d656d62726f6964657265642d7768697465222c226361702d636b223a226361702d656d62726f696465726564222c226361702d736861726b2d73616e64223a226361702d656d626c656d2d73616e64222c226361702d736861726b223a226361702d656d626c656d222c22736861726b2d736574223a2273706f72742d736574227d'.match(/../g),h=>parseInt(h,16))));return Array.isArray(x)?x.map(v=>typeof v==='string'?(aliases[v]||v):{...v,id:aliases[v.id]||v.id}):[]}catch{return[]}}

const content={
 season:'Осень / Зима 2026',
 about:{title:'Вещи, в которых спокойно',text:'Выразительные фактуры, спокойные цвета и внимание к посадке. Гардероб, в котором каждый предмет дополняет другой.'},
 selection:'Продуманные сочетания, спокойные цвета и внимание к деталям.',
 productDetails:[['О вещи','Чистые линии и продуманный силуэт. Рассмотрите детали на фотографии и выберите удобную посадку.'],['Состав и уход','Следуйте рекомендациям на внутренней этикетке изделия. Точный состав и способ ухода можно узнать у консультанта.'],['Доставка и возврат','Способ получения и условия возврата согласовываются с магазином до оформления заказа. Консультант поможет с деталями.']],
 services:[['Примерка','Выберите удобное время посещения с консультантом.'],['Доставка','Согласуйте способ получения заказа с магазином.'],['Возврат','Уточните условия до оформления заказа.']],
 wardrobe:[['Как собрать подборку','Добавьте понравившиеся вещи в корзину. Сохраните сочетание и обсудите заказ с консультантом.'],['Размеры и посадка','Сравните замеры изделия со своей одеждой. Консультант поможет подобрать подходящую посадку.'],['Доставка и заказ','Обсудите способ получения и детали заказа с магазином. Все условия согласовываются до оплаты.']],
 editorials:[{after:1,image:'/images/model-cutout-4.webp',look:4,title:'Тёплые оттенки'},{after:4,image:'/images/model-cutout-7.webp',look:7,title:'Мягкий силуэт'},{after:6,image:'/images/model-cutout-9.webp',look:9,title:'Вечерняя линия'}]
};
data.push({id:'hoodie-embroidered',name:'Худи с фактурной вышивкой',category:'Худи',color:'Серый',hex:'#a6a7a7',price:13900,post:'Df0Edrjx0eV'});
data.push(...[
 ['textured-overshirt','Рубашка из фактурной ткани','Куртки','Тёмно-синий','#313d50',13900,'DfC2lA-An-A'],
 ['bordered-cardigan','Кардиган с контрастной окантовкой','Куртки','Тёмно-синий','#263746',16900,'DervssCT-8f'],
 ['technical-jacket','Куртка с контрастной отделкой','Куртки','Графитовый','#41454b',15900,'Dej7AqHgtGS'],
 ['checked-overshirt','Рубашка в клетку с накладным карманом','Куртки','Оливковый','#7d7c65',12900,'DecDRuLAg09'],
 ['hooded-jacket','Куртка с капюшоном','Куртки','Тёмно-синий','#263746',14900,'DeXMrR_Arqg'],
 ['brown-overshirt','Рубашка на кнопках','Куртки','Тауп','#807568',12900,'DdzGIniTB2E'],
 ['soft-zip-hoodie','Худи из фактурного трикотажа','Худи','Светло-серый','#bcbfc0',11900,'De7GiwWxwSX'],
 ['washed-wide-denim','Широкие джинсы с высветлением','Джинсы','Серый','#8d9491',10900,'DbbP_KFCNz_'],
 ['navy-pocket-trousers','Широкие карго с боковыми карманами','Брюки','Тёмно-синий','#263746',9900,'DervssCT-8f'],
 ['olive-pocket-trousers','Карго с фигурными швами','Брюки','Оливковый','#7d7c65',8900,'DecDRuLAg09'],
 ['light-cargo-trousers','Карго свободного кроя','Брюки','Бежевый','#b0a28b',8900,'DdzGIniTB2E'],
 ['textured-trousers','Брюки из фактурной ткани','Брюки','Тёмно-синий','#313d50',9900,'DfC2lA-An-A']
].map(([id,name,category,color,hex,price,post])=>({id,name,category,color,hex,price,post})));
data.push(...[
 ['pocket-parka','Куртка с четырьмя карманами','Куртки','Графитовый','#343a40',15900,'DX_ux7aI_Su'],
 ['tapered-trousers','Зауженные брюки с боковой молнией','Брюки','Светло-серый','#bbc0bf',8900,'DXNAYgRgHnI'],
 ['relaxed-trousers','Брюки свободного кроя','Брюки','Чёрный','#25282c',8900,'DXHtGToiFAz'],
 ['deep-denim','Джинсы из тёмного денима','Джинсы','Индиго','#2c4051',9900,'DKcCvidIBM3'],
 ['faded-denim','Джинсы с контрастной строчкой','Джинсы','Голубой','#718592',9900,'DKZjCNZoa67']
].map(([id,name,category,color,hex,price,post])=>({id,name,category,color,hex,price,post})));
data.push(...verifiedProducts);
const catalogData=data.filter(p=>Boolean(p.post||p.sourceUrl)&&!['pocket-parka','hoodie'].includes(p.id));
const priority=p=>p.id==='bordered-cardigan'?-2:p.id==='tf-cashmere-cardigan'?-1:0;
catalogData.sort((a,b)=>groups.indexOf(a.category)-groups.indexOf(b.category)||priority(a)-priority(b));
data.sort((a,b)=>groups.indexOf(a.category)-groups.indexOf(b.category));
data.forEach(p=>{p.sizes=p.sizes||(p.category==='Кепки'||p.category==='Кошельки'?['Единый']:['S','M','L','XL','XXL']);p.images=[photo(p)];p.details=productDetails(p);});
export {source,data,catalogData,money,groups,looks,outfitParts,outfitPalettes,lookItems,lookCount,lookNumber,photo,read,content};
