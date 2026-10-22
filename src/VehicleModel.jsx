import React,{forwardRef,useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import {vehicle,input} from './state';
function Part({position,scale,color='#c51c3a',metal=.6,rough=.3,...props}){return <mesh position={position} scale={scale} {...props}><boxGeometry/><meshStandardMaterial color={color} metalness={metal} roughness={rough}/></mesh>;}
export default forwardRef(function VehicleModel({telemetry=vehicle,paint='#c51c3a',variant='pulse',...props},ref){const wheels=useRef([]),front=useRef([]),brakes=useRef([]),wide=variant==='nocturne',low=variant==='volt';
 useFrame(()=>{wheels.current.forEach(w=>{if(w)w.rotation.x=telemetry.wheel;});front.current.forEach(w=>{if(w)w.rotation.y=telemetry.steer*.35;});brakes.current.forEach(m=>{if(m)m.emissiveIntensity=telemetry===vehicle&&input.brake?5:1.8;});});
 return <group ref={ref} {...props}>
 <Part position={[0,.62,0]} scale={[wide?2.42:low?2.08:2.18,low?.35:.47,wide?4.85:4.55]} color={paint}/><Part position={[0,low?.83:.88,.52]} scale={[wide?2.25:2.03,low?.24:.32,3.15]} color={paint}/>
 <Part position={[0,low?1.06:1.18,low?-.5:-.32]} scale={[wide?1.8:1.66,low?.4:.58,low?2.15:1.9]} color="#101f38" metal={.85} rough={.13}/>
 <Part position={[0,low?1.33:1.5,-.5]} scale={[wide?1.85:1.7,.12,1.35]} color={paint}/>
 <Part position={[0,1.13,.72]} scale={[1.65,.08,.85]} rotation={[-.6,0,0]} color="#5480a7"/>
 <Part position={[0,1.14,-1.28]} scale={[1.62,.08,.6]} rotation={[.65,0,0]} color="#243c60"/>
 <Part position={[0,.38,2.23]} scale={[2.25,.13,.28]} color="#111825"/>
 <Part position={[0,.43,-2.28]} scale={[2.3,.16,.25]} color="#111825"/>
 <Part position={[0,1.15,-2]} scale={[2.35,.1,.4]} color="#161c29"/>
 {low&&<><Part position={[0,.54,1.9]} scale={[1.7,.06,.72]} color="#062d39"/><Part position={[0,.61,-1.9]} scale={[1.85,.07,.25]} color="#8af4ff"/></>}
 {wide&&<><Part position={[0,.54,1.45]} scale={[.2,.025,1.4]} color="#d6a6ff"/><Part position={[0,1.35,-2.17]} scale={[2.65,.13,.4]} color={paint}/><Part position={[0,.64,-2.34]} scale={[2.55,.18,.2]} color="#4c276b"/></>}
 {[-.8,.8].map((x,i)=><group key={x}>
 <Part position={[x,.95,-2]} scale={[.1,.4,.1]} color="#333b4b"/>
 <mesh position={[x,.8,2.29]}><boxGeometry args={[.52,.12,.035]}/><meshStandardMaterial color="#ccf5ff" emissive="#92eaff" emissiveIntensity={4}/></mesh>
 <mesh position={[x,.75,-2.29]}><boxGeometry args={[.62,.13,.035]}/><meshStandardMaterial ref={m=>brakes.current[i]=m} color="#ff224a" emissive="#ff1239" emissiveIntensity={2}/></mesh>
 <Part position={[x*1.43,1.14,.35]} scale={[.32,.16,.32]} color={paint}/>
 </group>)}
 {[-1.1,1.1].flatMap((x,i)=>[-1.4,1.42].map((z,j)=><group key={`${i}-${j}`} position={[x,.47,z]} ref={g=>{if(j===1)front.current[i]=g;}}><group ref={g=>wheels.current[i*2+j]=g}>
 <mesh rotation={[0,0,Math.PI/2]}><cylinderGeometry args={[.46,.46,.32,16]}/><meshStandardMaterial color="#090c12" roughness={.9}/></mesh>
 <mesh rotation={[0,0,Math.PI/2]} position={[Math.sign(x)*.17,0,0]}><cylinderGeometry args={[.3,.3,.025,12]}/><meshStandardMaterial color="#9aafc5" metalness={.85} roughness={.25}/></mesh>
 {[0,1,2].map(k=><Part key={k} position={[Math.sign(x)*.19,0,0]} scale={[.025,.53,.045]} rotation={[k*Math.PI/3,0,0]} color="#263145"/>)}
 </group></group>))}
 <mesh rotation={[-Math.PI/2,0,0]} position={[0,.035,0]}><planeGeometry args={[2.5,4.9]}/><meshBasicMaterial color="#00030c" transparent opacity={.55} depthWrite={false}/></mesh>
 </group>;
});
