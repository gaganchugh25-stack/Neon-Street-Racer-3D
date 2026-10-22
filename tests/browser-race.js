// Development-only browser fixture: the production entry never imports this.
// Drive the real physics with a simple test driver; do not alter lap/finish state.
import '../src/main.jsx';
import {race,input,advanceRace,clearInput,getState,startRace} from '../src/state.js';
import {pointOnTrack,trackAngle} from '../src/race.js';
let started=false;const timer=setInterval(()=>{
 if(getState().ready&&!started){startRace(new URLSearchParams(location.search).get('mode')==='trial'?'trial':'quick');started=true;}
 if(!getState().ready||getState().paused)return;
 for(let i=0;i<32;i++){
  const v=race.racers[0].car,p=pointOnTrack(trackAngle(v)+.024);
  const difference=Math.atan2(p.x-v.x,p.z-v.z)-v.heading,error=Math.atan2(Math.sin(difference),Math.cos(difference));
  Object.assign(input,{gas:v.speed<28,brake:false,left:error>.015,right:error<-.015,nitro:Math.abs(error)<.04&&v.nitro>20,drift:false});
  advanceRace(1/120);
  if(race.phase==='finished'){clearInput();clearInterval(timer);break;}
 }
},16);
