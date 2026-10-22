import test from 'node:test';import assert from 'node:assert/strict';import {createVehicle,stepVehicle,resetVehicle,nearest,samples,BARRIER} from '../src/physics.js';
const idle={gas:false,brake:false,left:false,right:false};
function run(v,input,seconds,rate=120){for(let i=0;i<seconds*rate;i++)stepVehicle(v,{...idle,...input},1/rate);return v;}
test('accelerates, brakes and reverses',()=>{const v=run(createVehicle(),{gas:true},2);assert.ok(v.speed>20);const before=v.speed;run(v,{brake:true},.5);assert.ok(v.speed<before);run(v,{brake:true},2);assert.ok(v.speed<0);});
test('steering responds in both directions',()=>{const l=run(createVehicle(),{gas:true,left:true},1),r=run(createVehicle(),{gas:true,right:true},1);assert.ok(l.heading>0);assert.ok(r.heading<0);assert.ok(l.x>r.x);});
test('coasting slows naturally',()=>{const v=run(createVehicle(),{gas:true},1);const speed=v.speed;run(v,{},1);assert.ok(v.speed<speed);});
test('offroad slows and barriers contain vehicle',()=>{const v=createVehicle();v.x+=11;v.speed=30;run(v,{},.1);assert.ok(v.offroad);assert.ok(v.speed<26);run(v,{gas:true,right:true},20);assert.ok(nearest(v.x,v.z).distance<=BARRIER-1.29);});
test('reset recovers to nearest track and restart to grid',()=>{const v=createVehicle();v.x=0;v.z=122;v.speed=25;resetVehicle(v);assert.equal(v.speed,0);assert.ok(nearest(v.x,v.z).distance<.01);resetVehicle(v,true);assert.equal(v.x,85);assert.equal(v.z,0);});
test('track closes with continuous evenly spaced samples',()=>{for(let i=0;i<samples.length;i++){const a=samples[i],b=samples[(i+1)%samples.length];assert.ok(Math.hypot(a.x-b.x,a.z-b.z)<3.2);}});
test('handling is consistent across frame rates',()=>{const a=run(createVehicle(),{gas:true,left:true},1,60),b=run(createVehicle(),{gas:true,left:true},1,120);assert.ok(Math.abs(a.speed-b.speed)<.02);assert.ok(Math.hypot(a.x-b.x,a.z-b.z)<.15);});
