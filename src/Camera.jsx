import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {Vector3} from 'three';
import {vehicle,getState} from './state';
export default function Camera(){const data=useRef({eye:new Vector3(),target:new Vector3(),look:new Vector3(),reset:-1});
 useFrame(({camera},dt)=>{const d=data.current,v=vehicle,dist=9+Math.abs(v.speed)*.055,s=Math.sin(v.heading),c=Math.cos(v.heading);
 d.eye.set(v.x-s*dist,4.7+Math.abs(v.speed)*.015,v.z-c*dist);d.target.set(v.x+s*7,1.25,v.z+c*7);
 if(d.reset!==getState().reset){camera.position.copy(d.eye);d.look.copy(d.target);d.reset=getState().reset;}else{camera.position.lerp(d.eye,1-Math.exp(-6*dt));d.look.lerp(d.target,1-Math.exp(-8*dt));}camera.lookAt(d.look);
 },-1);return null;}
