import test from 'node:test';import assert from 'node:assert/strict';
import {input,press,release,clearInput,pause,getState,vehicle,reset,startRace,openGarage} from '../src/state.js';
test('simultaneous touch inputs and independent releases',()=>{clearInput();press('touch-1','gas');press('touch-2','left');assert.ok(input.gas&&input.left);release('touch-2');assert.ok(input.gas&&!input.left);release('touch-1');assert.equal(input.gas,false);});
test('keyboard and touch can share an action',()=>{press('KeyW','gas');press('touch-1','gas');release('touch-1');assert.ok(input.gas);clearInput();});
test('pause releases all held controls',()=>{startRace();press('touch-1','gas');pause(true);assert.ok(getState().paused);assert.ok(Object.values(input).every(v=>!v));pause(false);});
test('garage cannot be paused and clears race inputs',()=>{press('KeyW','gas');openGarage();assert.equal(getState().screen,'garage');assert.equal(input.gas,false);pause(true);assert.equal(getState().paused,false);});
test('restart clears speed, position, distance and held controls',()=>{vehicle.speed=40;vehicle.distance=100;press('KeyW','gas');reset(true);assert.equal(vehicle.speed,0);assert.equal(vehicle.distance,0);assert.equal(vehicle.x,85);assert.ok(!input.gas);});
