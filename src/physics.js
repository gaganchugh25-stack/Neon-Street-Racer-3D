export const RX = 85, RZ = 120, ROAD_HALF = 10, BARRIER = 13;
export const samples = Array.from({length: 240}, (_,i) => { const t=i/240*Math.PI*2; return {x:RX*Math.cos(t),z:RZ*Math.sin(t),heading:Math.atan2(-RX*Math.sin(t), RZ*Math.cos(t))}; });
export function nearest(x,z) {
  let best=Infinity, index=0;
  for(let i=0;i<samples.length;i++){const p=samples[i],d=(x-p.x)**2+(z-p.z)**2;if(d<best){best=d;index=i;}}
  return { ...samples[index], distance:Math.sqrt(best), index };
}
export function createVehicle(){return {x:RX,z:0,heading:0,speed:0,steer:0,wheel:0,offroad:false,distance:0,nitro:100,boosting:false,boostLocked:false,rechargeDelay:0,slip:0,drifting:false,impact:0,impactCooldown:0,impactCount:0,spec:null};}
export function resetVehicle(v, start=false){const p=start?samples[0]:nearest(v.x,v.z);Object.assign(v,{x:p.x,z:p.z,heading:p.heading,speed:0,steer:0,wheel:0,offroad:false,slip:0,drifting:false,boosting:false,impact:0,impactCooldown:0});if(start){v.distance=0;v.nitro=100;v.boostLocked=false;v.rechargeDelay=0;v.impactCount=0;}}
export function stepVehicle(v,input,dt){
  const near=nearest(v.x,v.z); v.offroad=near.distance>ROAD_HALF-0.9;
  v.impact=Math.max(0,v.impact-dt*2.5);v.impactCooldown=Math.max(0,v.impactCooldown-dt);
  if(!input.nitro)v.boostLocked=false;
  v.boosting=!!input.nitro&&!v.boostLocked&&v.nitro>0&&v.speed>5&&!input.brake&&!v.offroad;
  if(v.boosting){v.nitro=Math.max(0,v.nitro-(v.spec?.nitroDrain??28)*dt);v.rechargeDelay=1.4;if(v.nitro===0){v.boostLocked=true;v.boosting=false;}}
  else {v.rechargeDelay=Math.max(0,v.rechargeDelay-dt);if(v.rechargeDelay===0)v.nitro=Math.min(100,v.nitro+(v.spec?.nitroRecharge??13)*dt);}
  const gas=Number(!!input.gas),brake=Number(!!input.brake);
  let force=gas?(v.speed<-.4?24:(v.spec?.acceleration??13)):0;
  if(brake)force-=v.speed>.4?27:7;
  if(!gas&&!brake){const drag=2.2+Math.abs(v.speed)*.025;v.speed=Math.sign(v.speed)*Math.max(0,Math.abs(v.speed)-drag*dt);}
  if(v.boosting)force+=21;
  v.speed+=force*dt;
  v.speed*=Math.exp(-(v.offroad?1.6:.055)*dt);
  const limit=(v.spec?.topSpeed??52)+(v.boosting?16:0);
  if(v.speed>limit)v.speed=Math.max(limit,v.speed-10*dt);
  v.speed=Math.max(-10,Math.min((v.spec?.topSpeed??52)+16,v.speed));
  const desired=Number(!!input.left)-Number(!!input.right);
  v.steer+=(desired-v.steer)*(1-Math.exp(-9*dt));
  v.drifting=!!input.drift&&v.speed>12&&Math.abs(v.steer)>.12&&!v.offroad;
  const slipTarget=v.drifting?v.steer*.43:0;
  v.slip+=(slipTarget-v.slip)*(1-Math.exp(-(v.drifting?5:8)*dt));
  if(v.drifting)v.speed*=Math.exp(-.12*dt);
  v.heading+=v.steer*v.speed/(9+Math.abs(v.speed)*.62)*(v.drifting?1.2:1)*(v.spec?.handling??1)*dt;
  v.x+=Math.sin(v.heading-v.slip)*v.speed*dt;v.z+=Math.cos(v.heading-v.slip)*v.speed*dt;
  v.wheel+=v.speed*dt/.43;v.distance+=Math.abs(v.speed)*dt;
  const after=nearest(v.x,v.z);
  if(after.distance>BARRIER-1.3){registerImpact(v,Math.abs(v.speed)*.5);const f=(BARRIER-1.3)/after.distance;v.x=after.x+(v.x-after.x)*f;v.z=after.z+(v.z-after.z)*f;v.speed*=Math.exp(-5*dt);}
  if(!Number.isFinite(v.x+v.z+v.speed))resetVehicle(v,true);
}

export function registerImpact(v,speed){if(v.impactCooldown>0||speed<2)return false;v.impact=Math.min(1,.2+speed/35);v.impactCooldown=.45;v.impactCount++;v.boosting=false;return true;}
// A pair of circles approximates each car's footprint; no rigid-body engine.
export function collideCars(player,other){
 if(Math.hypot(player.x-other.x,player.z-other.z)>6)return false;
 for(const a of [-1,1])for(const b of [-1,1]){
  let dx=player.x+Math.sin(player.heading)*a-other.x-Math.sin(other.heading)*b;
  let dz=player.z+Math.cos(player.heading)*a-other.z-Math.cos(other.heading)*b;
  let d=Math.hypot(dx,dz);if(d>=2.15)continue;
  if(d<.001){dx=Math.cos(other.heading);dz=-Math.sin(other.heading);d=1;}
  const depth=2.15-d;player.x+=dx/d*depth;player.z+=dz/d*depth;
  if(registerImpact(player,Math.abs(player.speed-other.speed)+4)){player.speed*=.68;other.speed*=.88;}
  return true;
 }
 return false;
}
