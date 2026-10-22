import {useMemo} from 'react';
import {Instances} from './Track';
export default function City({low=false}){const city=useMemo(()=>{let seed=92;const random=()=>{seed=(seed*16807)%2147483647;return seed/2147483647;};const buildings=[],windows=[],crowns=[],inner=[];
 for(let i=0;i<100;i++){const a=i/100*Math.PI*2,r=165+random()*140,x=Math.cos(a)*r,z=Math.sin(a)*r,h=12+random()*72,w=8+random()*15,d=9+random()*13;buildings.push({p:[x,h/2,z],s:[w,h,d]});if(i%3===0)crowns.push({p:[x,h+.1,z],s:[w+.2,.25,d+.2]});for(let y=4;y<h-2;y+=4){for(let dx=-w/2+2;dx<w/2-1;dx+=3){if(random()>.38){windows.push({p:[x+dx,y,z-d/2-.03],s:[1,.8,.06]});windows.push({p:[x+dx,y,z+d/2+.03],s:[1,.8,.06]});}}}}
 for(let i=0;i<10;i++){const a=i/10*Math.PI*2;inner.push({p:[Math.cos(a)*38,1,Math.sin(a)*65],s:[12,2,12]});}
 return {buildings,windows,crowns,inner};},[]);
 return <group><Instances items={city.buildings} color="#18243a"/><Instances items={useMemo(()=>low?city.windows.filter((_,i)=>i%3===0):city.windows,[city,low])} color="#6c9dc6" emissive="#325573"/><Instances items={city.crowns} color="#7a4adb" emissive="#522090"/><Instances items={city.inner} color="#141c2b"/>
 <mesh position={[-250,170,360]}><sphereGeometry args={[18,24,16]}/><meshBasicMaterial color="#7f9fae"/></mesh>
 <mesh position={[0,17,0]}><cylinderGeometry args={[5,8,34,6]}/><meshStandardMaterial color="#24314d" metalness={.6} roughness={.4}/></mesh>
 <mesh position={[0,38,0]} rotation={[.2,0,.3]}><torusGeometry args={[11,.3,6,48]}/><meshStandardMaterial color="#2cd5e9" emissive="#1798bc" emissiveIntensity={3}/></mesh>
 </group>;
}
