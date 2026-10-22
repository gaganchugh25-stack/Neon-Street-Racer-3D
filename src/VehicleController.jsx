import {useRef} from 'react';
import {useFrame} from '@react-three/fiber';
import VehicleModel from './VehicleModel';
import {vehicle,getState,advanceRace,useGame} from './state';
import {CARS} from './progress';
export default function VehicleController(){const car=useRef(),acc=useRef(0),{progress,screen}=useGame(),selected=CARS.find(c=>c.id===progress.selectedCar)||CARS[0];
 useFrame((_,delta)=>{if(screen==='race'&&!getState().paused){acc.current+=Math.min(delta,.1);while(acc.current>=1/120){advanceRace(1/120);acc.current-=1/120;}}else acc.current=0;
 car.current.position.set(vehicle.x,0,vehicle.z);car.current.rotation.y=vehicle.heading;car.current.rotation.z=-vehicle.steer*Math.min(Math.abs(vehicle.speed)/52,1)*.035;
 },-2);return <VehicleModel ref={car} paint={selected.paint} variant={selected.id}/>;}
