import {createVehicle,stepVehicle,collideCars,RX,RZ,nearest} from './physics.js';
export const LAPS=3, GATES=8, TAU=Math.PI*2;
export const colours=['#e52b48','#32cbea','#b779ff','#f5bc54'];
export function pointOnTrack(turns,lane=0){const t=turns*TAU,s=Math.sin(t),c=Math.cos(t),h=Math.atan2(-RX*s,RZ*c);return {x:RX*c+Math.cos(h)*lane,z:RZ*s-Math.sin(h)*lane,heading:h};}
export function trackAngle(v){return Math.atan2(v.z/RZ,v.x/RX)/TAU;}
export function createRace(player=createVehicle(),mode='quick'){
 const validMode=mode==='trial'?'trial':'quick',names=validMode==='trial'?['YOU']:['YOU','ION','VIOLET','EMBER'];
 const racers=names.map((name,i)=>{const car=i?createVehicle():player,lane=[0,-5,5,-3][i],progress=i?.008*i:0,spec=car.spec;Object.assign(car,createVehicle(),pointOnTrack(progress,lane));car.spec=spec;return {id:i,name,car,lane,progress,previous:trackAngle(car),cleared:0,finishTime:null,lapTimes:[],lapStart:0,path:progress,topSpeed:32-i*1.4};});
 return {mode:validMode,laps:validMode==='trial'?1:LAPS,phase:'countdown',countdown:3,elapsed:0,racers,rewarded:false};
}
// Only ordered, forward gate crossings on the circuit count. Reject large jumps.
export function recordProgress(race,racer){
 if(racer.finishTime!==null)return;
 const angle=trackAngle(racer.car);let delta=angle-racer.previous;
 if(delta>.5)delta-=1;if(delta<-.5)delta+=1;racer.previous=angle;
 if(Math.abs(delta)>.08)return;
 const before=racer.progress;racer.progress+=delta;
 const gate=(racer.cleared+1)/GATES;
 if(delta>0&&before<gate&&racer.progress>=gate&&nearest(racer.car.x,racer.car.z).distance<=12){
  racer.cleared++;
  if(racer.cleared%GATES===0){racer.lapTimes.push(race.elapsed-racer.lapStart);racer.lapStart=race.elapsed;}
  if(racer.cleared===race.laps*GATES){racer.finishTime=race.elapsed;racer.car.speed=0;racer.car.boosting=false;racer.car.drifting=false;racer.car.slip=0;racer.car.impact=0;}
 }
}
export function standings(race){return [...race.racers].sort((a,b)=>{
 if(a.finishTime!==null||b.finishTime!==null){if(a.finishTime===null)return 1;if(b.finishTime===null)return -1;return a.finishTime-b.finishTime||a.id-b.id;}
 const score=r=>Math.min(r.progress,(r.cleared+1)/GATES);
 return score(b)-score(a)||a.id-b.id;
});}
export function recoverPlayer(race){const r=race.racers[0];if(r.finishTime!==null)return;r.progress=r.cleared/GATES;Object.assign(r.car,pointOnTrack(r.progress),{speed:0,steer:0,wheel:0,offroad:false,slip:0,drifting:false,boosting:false,impact:0,impactCooldown:0});r.previous=trackAngle(r.car);}
export function stepRace(race,input,dt,paused=false){
 if(paused||race.phase==='finished')return;
 if(race.phase==='countdown'){race.countdown=Math.max(0,race.countdown-dt);if(race.countdown<1e-8){race.countdown=0;race.phase='racing';}return;}
 race.elapsed+=dt;
 for(const r of race.racers){
  if(r.finishTime!==null)continue;
  if(r.id===0)stepVehicle(r.car,input,dt);
  else {
   r.car.speed=Math.min(r.topSpeed,r.car.speed+9*dt);
   const t=r.path*TAU,metresPerTurn=TAU*Math.hypot(RX*Math.sin(t),RZ*Math.cos(t));
   r.path+=r.car.speed*dt/metresPerTurn;
   Object.assign(r.car,pointOnTrack(r.path,r.lane));r.car.wheel+=r.car.speed*dt/.43;r.car.steer=-.13;
  }

 }
 if(race.racers[0].finishTime===null)for(let i=1;i<race.racers.length;i++)collideCars(race.racers[0].car,race.racers[i].car);
 for(const r of race.racers)recordProgress(race,r);
 if(race.racers[0].finishTime!==null)race.phase='results';
 if(race.racers.every(r=>r.finishTime!==null))race.phase='finished';
}
export function formatTime(seconds){if(seconds===null)return 'Racing';const centis=Math.round(seconds*100),m=Math.floor(centis/6000),s=((centis%6000)/100).toFixed(2).padStart(5,'0');return `${m}:${s}`;}
