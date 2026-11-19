import React,{useEffect,useState} from 'react';
const photos=[['/images/hero-01.webp','Модель в чёрной лёгкой куртке'],['/images/hero-02.webp','Модель в синей куртке со светлыми вставками'],['/images/hero-03.webp','Модель в тёмной куртке с полосами на рукавах']];
export default function HeroPhotos(){
 const [active,setActive]=useState(0),[ready,setReady]=useState([false,false,false]);
 const [reduce,setReduce]=useState(()=>matchMedia('(prefers-reduced-motion: reduce)').matches);
 useEffect(()=>{const q=matchMedia('(prefers-reduced-motion: reduce)'),change=()=>setReduce(q.matches);q.addEventListener('change',change);return()=>q.removeEventListener('change',change)},[]);
 useEffect(()=>{if(reduce)return;const timer=setInterval(()=>{if(!document.hidden)setActive(i=>ready[(i+1)%3]?(i+1)%3:i)},3000);return()=>clearInterval(timer)},[reduce,ready]);
 return <><div className="hero-photos" aria-label="Фотографии коллекции">{photos.map(([src,alt],i)=><img key={src} src={src} alt={alt} aria-hidden={i!==active} className={i===active?'active':''} width="1125" height="1428" decoding="async" fetchPriority={i===0?'high':'low'} onLoad={()=>setReady(r=>r.map((v,n)=>n===i?true:v))}/>)}</div></>;
}
