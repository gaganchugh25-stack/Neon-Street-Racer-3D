import {useEffect} from 'react';
import {vehicle,input,getState,race,audioStatus} from './state';
import {createEngineAudio} from './audio';
export default function EngineAudio(){useEffect(()=>{let engine=null,disposed=false;
 const unlock=async()=>{if(disposed)return;try{const Context=window.AudioContext||window.webkitAudioContext;if(!Context){audioStatus('unavailable');return;}engine??=createEngineAudio(Context);await engine.unlock();if(!disposed)audioStatus(engine.ctx.state==='running'?'ready':'locked');}catch{if(!disposed)audioStatus('unavailable');}};
 const refresh=()=>{if(!engine)return;const s=getState();engine.update(vehicle,input,s.screen==='race'&&!s.paused&&!s.muted&&!document.hidden&&race.phase==='racing');};
 const silence=()=>engine?.silence();
 window.addEventListener('pointerdown',unlock);window.addEventListener('keydown',unlock);window.addEventListener('blur',silence);document.addEventListener('visibilitychange',silence);
 const timer=setInterval(refresh,50);
 return()=>{disposed=true;clearInterval(timer);window.removeEventListener('pointerdown',unlock);window.removeEventListener('keydown',unlock);window.removeEventListener('blur',silence);document.removeEventListener('visibilitychange',silence);engine?.dispose();};
 },[]);return null;}
