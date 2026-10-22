export const STORAGE_KEY='neon-street-racer-progress-v1';
export const CARS=[
 {id:'pulse',name:'PULSE GT',type:'Balanced coupe',paint:'#e52b48',accent:'#ff9eae',acceleration:13,topSpeed:52,handling:1},
 {id:'volt',name:'VOLT R',type:'Lightweight sprint',paint:'#31d5e9',accent:'#a7faff',acceleration:15,topSpeed:48,handling:1.14},
 {id:'nocturne',name:'NOCTURNE X',type:'Grand tourer',paint:'#ae75f5',accent:'#e5c9ff',acceleration:11.5,topSpeed:56,handling:.9},
];
export const UPGRADES=[
 {id:'engine',name:'Engine',description:'Stronger acceleration and higher top speed',baseCost:90},
 {id:'handling',name:'Handling',description:'More responsive steering and drift control',baseCost:75},
 {id:'nitro',name:'Nitro',description:'Longer boost and quicker recharge',baseCost:80},
];
const carIds=new Set(CARS.map(car=>car.id));
const levels=()=>({engine:0,handling:0,nitro:0});
export function freshProgress(){return {version:1,coins:0,selectedCar:'pulse',lastMode:'quick',upgrades:Object.fromEntries(CARS.map(car=>[car.id,levels()])),bestTimes:{},racesCompleted:0,wins:0};}
const safeInt=(value,max=1e9)=>Number.isSafeInteger(value)&&value>=0?Math.min(value,max):0;
export function normaliseProgress(value){
 const next=freshProgress();if(!value||typeof value!=='object'||value.version!==1)return next;
 next.coins=safeInt(value.coins);next.selectedCar=carIds.has(value.selectedCar)?value.selectedCar:'pulse';next.lastMode=value.lastMode==='trial'?'trial':'quick';
 for(const car of CARS)for(const kind of UPGRADES){const n=value.upgrades?.[car.id]?.[kind.id];next.upgrades[car.id][kind.id]=Math.min(3,safeInt(n,3));}
 for(const mode of ['quick','trial']){const t=value.bestTimes?.[mode];if(Number.isFinite(t)&&t>0&&t<86400)next.bestTimes[mode]=t;}
 next.racesCompleted=safeInt(value.racesCompleted);next.wins=safeInt(value.wins);
 return next;
}
export function loadProgress(storage){try{return normaliseProgress(JSON.parse((storage??globalThis.localStorage).getItem(STORAGE_KEY)));}catch{return freshProgress();}}
export function saveProgress(progress,storage){try{(storage??globalThis.localStorage).setItem(STORAGE_KEY,JSON.stringify(progress));return true;}catch{return false;}}
export function selectCar(progress,id){return carIds.has(id)?{...progress,selectedCar:id}:progress;}
export function upgradeCost(kind,level){const item=UPGRADES.find(x=>x.id===kind);return item&&level>=0&&level<3?item.baseCost*(level+1):null;}
export function buyUpgrade(progress,kind){
 const id=progress.selectedCar,level=progress.upgrades[id]?.[kind],cost=upgradeCost(kind,level);
 if(cost===null||progress.coins<cost)return progress;
 return {...progress,coins:progress.coins-cost,upgrades:{...progress.upgrades,[id]:{...progress.upgrades[id],[kind]:level+1}}};
}
export function carSpec(progress){const car=CARS.find(c=>c.id===progress.selectedCar)||CARS[0],u=progress.upgrades[car.id];return {acceleration:car.acceleration+u.engine*1.35,topSpeed:car.topSpeed+u.engine*1.6,handling:car.handling+u.handling*.07,nitroDrain:28-u.nitro*2.5,nitroRecharge:13+u.nitro*2.5};}
export function finishRun(progress,mode,time,position=1){
 if(!Number.isFinite(time)||time<=0)return {progress,reward:0,record:false};
 const reward=mode==='trial'?70:Math.max(40,140-(position-1)*30);
 const previous=progress.bestTimes[mode],record=previous===undefined||time<previous;
 return {progress:{...progress,coins:progress.coins+reward,bestTimes:record?{...progress.bestTimes,[mode]:time}:progress.bestTimes,racesCompleted:progress.racesCompleted+1,wins:progress.wins+Number(mode==='quick'&&position===1)},reward,record};
}
