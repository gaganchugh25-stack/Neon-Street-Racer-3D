import {useSyncExternalStore} from 'react';
import {loadSettings,saveSettings,PRESETS} from './quality.js';
import {createVehicle} from './physics.js';
import {createRace,recoverPlayer,stepRace,standings} from './race.js';
import {loadProgress,saveProgress,selectCar,buyUpgrade,carSpec,finishRun} from './progress.js';
export const vehicle=createVehicle();
export let race=createRace(vehicle);
export const input={gas:false,brake:false,left:false,right:false,nitro:false,drift:false};
const held=new Map(),listeners=new Set();
const savedProgress=loadProgress(),settings=loadSettings();
let state={settings,effectiveQuality:settings.quality==='auto'?'balanced':settings.quality,performance:null,saveFailed:false,contextLost:false,screen:'garage',mode:savedProgress.lastMode,progress:savedProgress,lastReward:0,newRecord:false,paused:false,ready:false,reset:0,muted:false,audioStatus:'locked',touch:typeof window!=='undefined' && (navigator.maxTouchPoints>0 || window.matchMedia('(any-pointer:coarse)').matches)};
export function press(source,action){held.set(source,action);sync();}
export function release(source){held.delete(source);sync();}
function sync(){for(const k of Object.keys(input))input[k]=[...held.values()].includes(k);}
export function clearInput(){held.clear();sync();}
function update(next){state={...state,...next};listeners.forEach(fn=>fn());}
export function pause(value=!state.paused){if(state.screen!=='race'||race.racers[0].finishTime!==null)return;clearInput();update({paused:value});}
export function startRace(mode=state.mode){clearInput();const chosen=mode==='trial'?'trial':'quick';const progress={...state.progress,lastMode:chosen};persist(progress);vehicle.spec=carSpec(progress);race=createRace(vehicle,chosen);raceSignal='';update({screen:'race',mode:chosen,progress,paused:false,lastReward:0,newRecord:false,reset:state.reset+1});}
export function openGarage(){clearInput();update({screen:'garage',paused:false,reset:state.reset+1});}
export function chooseCar(id){if(state.screen!=='garage')return;const progress=selectCar(state.progress,id);if(progress!==state.progress){persist(progress);update({progress,reset:state.reset+1});}}
export function setMode(mode){if(state.screen==='garage'&&(mode==='quick'||mode==='trial')){const progress={...state.progress,lastMode:mode};persist(progress);update({mode,progress});}}
export function purchaseUpgrade(kind){if(state.screen!=='garage')return false;const progress=buyUpgrade(state.progress,kind);if(progress===state.progress)return false;persist(progress);update({progress});return true;}
export function reset(start=false){clearInput();if(start){startRace();return;}if(state.screen!=='race')return;recoverPlayer(race);update({reset:state.reset+1});}
export function ready(){update({ready:true});}
export const getState=()=>state;
export function useGame(){return useSyncExternalStore(fn=>{listeners.add(fn);return()=>listeners.delete(fn);},getState);}

export function toggleTouch(){clearInput();update({touch:!state.touch});}

let raceSignal="";
export function advanceRace(dt){if(!state.ready||state.screen!=='race')return;stepRace(race,input,dt,state.paused);if(race.racers[0].finishTime!==null&&!race.rewarded){race.rewarded=true;const position=standings(race).findIndex(r=>r.id===0)+1;const result=finishRun(state.progress,race.mode,race.racers[0].finishTime,position);persist(result.progress);update({progress:result.progress,lastReward:result.reward,newRecord:result.record});}
 const signal=`${race.phase}:${Math.ceil(race.countdown)}`;if(signal!==raceSignal){raceSignal=signal;if(race.phase==='results'||race.phase==='finished')clearInput();update({raceSignal:signal});}}

export function toggleMute(){update({muted:!state.muted});}
export function audioStatus(value){if(state.audioStatus!==value)update({audioStatus:value});}

function persist(progress){update({saveFailed:!saveProgress(progress)});}
export function setQuality(value){if(value!=='auto'&&!PRESETS[value])return;const settings={...state.settings,quality:value};saveSettings(settings);update({settings,effectiveQuality:value==='auto'?'balanced':value,performance:null});}
export function togglePerformance(){const settings={...state.settings,showPerformance:!state.settings.showPerformance};saveSettings(settings);update({settings});}
export function reportPerformance(performance){if(state.settings.showPerformance)update({performance});}
export function adaptQuality(value){if(state.settings.quality==='auto'&&value!==state.effectiveQuality)update({effectiveQuality:value});}
export function graphicsLost(){clearInput();update({contextLost:true,paused:true});}
