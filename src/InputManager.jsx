import {useEffect} from 'react';
import {press,release,clearInput,pause,reset,getState} from './state';
const keys={KeyW:'gas',ArrowUp:'gas',KeyS:'brake',ArrowDown:'brake',KeyA:'left',ArrowLeft:'left',KeyD:'right',ArrowRight:'right',ShiftLeft:'nitro',ShiftRight:'nitro',Space:'drift'};
export default function InputManager(){useEffect(()=>{
 const down=e=>{if((e.target?.closest?.('select,input,textarea')||(['Space','Enter'].includes(e.code)&&e.target?.closest?.('button,a')))&&e.code!=='Escape')return;if(keys[e.code]&&getState().screen==='race'&&!getState().paused){e.preventDefault();if(!getState().paused)press(e.code,keys[e.code]);}if(e.repeat)return;if(e.code==='Escape')pause();if(e.code==='KeyR')reset();};
 const up=e=>release(e.code),blur=()=>{clearInput();pause(true);},visibility=()=>{if(document.hidden)blur();};
 window.addEventListener('keydown',down);window.addEventListener('keyup',up);window.addEventListener('blur',blur);document.addEventListener('visibilitychange',visibility);
 return()=>{window.removeEventListener('keydown',down);window.removeEventListener('keyup',up);window.removeEventListener('blur',blur);document.removeEventListener('visibilitychange',visibility);clearInput();};
 },[]);return null;}
