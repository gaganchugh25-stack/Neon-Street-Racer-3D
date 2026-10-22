import test from 'node:test';
import assert from 'node:assert/strict';
import {PRESETS,loadSettings,saveSettings,createProfile,sampleProfile,autoQuality} from '../src/quality.js';
import {createVehicle,stepVehicle} from '../src/physics.js';
test('graphics preferences round-trip independently of progress',()=>{const values=new Map(),storage={getItem:k=>values.get(k),setItem:(k,v)=>values.set(k,v)};const settings={quality:'low',showPerformance:true};assert.ok(saveSettings(settings,storage));assert.deepEqual(loadSettings(storage),settings);assert.equal(values.size,1);assert.ok(PRESETS.low.dpr<PRESETS.high.dpr);assert.ok(PRESETS.low.smoke<PRESETS.high.smoke);});
test('invalid and blocked settings storage safely defaults to auto',()=>{assert.deepEqual(loadSettings({getItem:()=>'{broken'}),{quality:'auto',showPerformance:false});assert.equal(loadSettings({getItem:()=>'{"quality":"ultra"}'}).quality,'auto');assert.equal(saveSettings({},{setItem(){throw Error('full');}}),false);});
test('profiler reports real frame intervals and excludes background stalls',()=>{const profile=createProfile();assert.equal(sampleProfile(profile,2),null);let result;for(let i=0;i<61;i++){const sample=sampleProfile(profile,1/60);if(sample)result=sample;}assert.equal(result.fps,60);assert.equal(result.slowFrames,0);assert.ok(result.frameMs>=16.6&&result.frameMs<=16.8);});
test('auto quality steps down without raising detail repeatedly',()=>{assert.equal(autoQuality('high',35),'balanced');assert.equal(autoQuality('balanced',20),'low');assert.equal(autoQuality('low',60),'low');});
test('partial controls no longer produce NaN and silently reset a vehicle',()=>{const car=createVehicle();stepVehicle(car,{gas:true},1/120);assert.ok(car.speed>0);assert.ok(Number.isFinite(car.x+car.z+car.heading));});
