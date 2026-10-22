import {PRESETS} from './quality';
import {useMemo,useRef,useEffect} from 'react';
import {useFrame} from '@react-three/fiber';
import {BufferGeometry,BufferAttribute,ShaderMaterial} from 'three';
import {vehicle,getState,race} from './state';
// One pooled draw call; no textures, sorting, dynamic shadows or post-processing.
export default function DrivingEffects(){const glow=useRef(),flames=useRef(),light=useRef();
 const pool=useMemo(()=>{const count=48,positions=new Float32Array(count*3),ages=new Float32Array(count).fill(2),sizes=new Float32Array(count),opacity=new Float32Array(count);const geometry=new BufferGeometry();geometry.setAttribute('position',new BufferAttribute(positions,3));geometry.setAttribute('size',new BufferAttribute(sizes,1));geometry.setAttribute('alpha',new BufferAttribute(opacity,1));const material=new ShaderMaterial({transparent:true,depthWrite:false,vertexShader:'attribute float size; attribute float alpha; varying float opacity; void main(){opacity=alpha; vec4 p=modelViewMatrix*vec4(position,1.0); gl_Position=projectionMatrix*p; gl_PointSize=clamp(size*500.0/max(1.0,-p.z),1.0,64.0);}',fragmentShader:'varying float opacity; void main(){float d=length(gl_PointCoord-vec2(0.5))*2.0; float a=(1.0-smoothstep(0.2,1.0,d))*opacity; if(a<0.005)discard; gl_FragColor=vec4(0.59,0.65,0.75,a);}'});return {count,positions,ages,sizes,opacity,geometry,material,cursor:0,emit:0,reset:-1};},[]);
 useEffect(()=>()=>{pool.geometry.dispose();pool.material.dispose();},[pool]);
 useFrame((_,delta)=>{const dt=Math.min(delta,.05),v=vehicle,s=getState(),active=s.screen==='race'&&!s.paused&&race.phase==='racing';
  if(pool.reset!==s.reset){pool.ages.fill(2);pool.opacity.fill(0);pool.reset=s.reset;}
  glow.current.position.set(v.x,.05,v.z);glow.current.rotation.z=-v.heading;glow.current.material.uniforms.strength.value=v.boosting?.28:.12;
  flames.current.position.set(v.x,0,v.z);flames.current.rotation.y=v.heading;flames.current.visible=active&&v.boosting;
  light.current.position.set(v.x,1.5,v.z);light.current.intensity=s.effectiveQuality==='low'?0:active&&v.boosting?9:3;
  if(!s.paused){for(let i=0;i<pool.count;i++){pool.ages[i]+=dt;const age=pool.ages[i];pool.opacity[i]=age<1?(1-age)*.28:0;if(age<1){pool.positions[i*3+1]+=dt*.8;pool.sizes[i]=.45+age*1.5;}}
   if(active&&(v.drifting||v.impact>.4)){pool.emit+=dt;const interval=s.effectiveQuality==='low'?.12:s.touch?.07:.04;if(pool.emit>=interval){pool.emit=0;for(const side of [-1,1]){const i=pool.cursor++%PRESETS[s.effectiveQuality].smoke;pool.ages[i]=0;pool.positions[i*3]=v.x-Math.sin(v.heading)*1.6+Math.cos(v.heading)*side;pool.positions[i*3+1]=.25;pool.positions[i*3+2]=v.z-Math.cos(v.heading)*1.6-Math.sin(v.heading)*side;}}}
  }
  pool.geometry.attributes.position.needsUpdate=true;pool.geometry.attributes.size.needsUpdate=true;pool.geometry.attributes.alpha.needsUpdate=true;
 });
 return <group><points geometry={pool.geometry} material={pool.material} frustumCulled={false}/>
 <mesh ref={glow} rotation={[-Math.PI/2,0,0]}><planeGeometry args={[3.2,5.5]}/><shaderMaterial transparent depthWrite={false} uniforms={{strength:{value:.12}}} vertexShader="varying vec2 uvPosition; void main(){uvPosition=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}" fragmentShader="uniform float strength; varying vec2 uvPosition; void main(){float alpha=(1.0-smoothstep(0.12,0.5,length(uvPosition-vec2(0.5))))*strength;gl_FragColor=vec4(0.06,0.7,0.95,alpha);}"/></mesh>
 <pointLight ref={light} color="#29c7ff" distance={9} decay={2} intensity={3}/>
 <group ref={flames}>{[-.72,.72].map(x=><mesh key={x} position={[x,.5,-2.75]} rotation={[-Math.PI/2,0,0]}><coneGeometry args={[.17,1.1,6]}/><meshBasicMaterial color="#68e5ff" transparent opacity={.85}/></mesh>)}</group>
 </group>;
}
