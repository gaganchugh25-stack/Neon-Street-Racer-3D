import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import VehicleModel from './VehicleModel';
import {race,useGame} from './state';
import {colours,GATES,pointOnTrack} from './race';
function Opponent({racer}){const ref=useRef();useFrame(()=>{ref.current.position.set(racer.car.x,0,racer.car.z);ref.current.rotation.y=racer.car.heading;},-1);return <VehicleModel ref={ref} telemetry={racer.car} paint={colours[racer.id]}/>;}
function Gate({index}){const ref=useRef(),p=pointOnTrack(index/GATES);useFrame(()=>{const active=race.racers[0].cleared%GATES===(index-1+GATES)%GATES;ref.current.color.set(active?'#55f5b6':'#506781');ref.current.emissive.set(active?'#159b5d':'#10283d');});return <group position={[p.x,0,p.z]} rotation={[0,p.heading,0]}>
 {[-10,10].map(x=><mesh key={x} position={[x,2.5,0]}><boxGeometry args={[.2,5,.2]}/><meshStandardMaterial color="#96d8e8" emissive="#175173"/></mesh>)}
 <mesh position={[0,5,0]}><boxGeometry args={[20.2,.12,.15]}/><meshStandardMaterial ref={ref} color="#55f5b6" emissiveIntensity={2}/></mesh>
 </group>;}
export default function RaceScene(){const {reset}=useGame();return <group>{race.racers.slice(1).map(r=><Opponent key={`${reset}-${r.id}`} racer={r}/>)}{Array.from({length:GATES},(_,i)=><Gate key={i} index={i+1}/>)}</group>;}
