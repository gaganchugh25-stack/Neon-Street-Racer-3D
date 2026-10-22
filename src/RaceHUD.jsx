import {useModal} from './modal';
import {useEffect,useRef,useState} from 'react';
import {race,useGame,reset,openGarage} from './state';
import {GATES,standings,formatTime} from './race';
export default function RaceHUD(){const {paused,lastReward,newRecord}=useGame(),[,tick]=useState(0),results=useRef(),panel=useRef();
 useEffect(()=>{const id=setInterval(()=>tick(n=>n+1),100);return()=>clearInterval(id);},[]);
 const player=race.racers[0],order=standings(race),finished=player.finishTime!==null,trial=race.mode==='trial';
 useModal(panel,finished&&!paused);
 return <>
 <div className="race-stats" aria-label="Race progress"><span>LAP <strong>{Math.min(race.laps,1+Math.floor(player.cleared/GATES))} / {race.laps}</strong></span><span>{trial?'MODE':'POSITION'} <strong>{trial?'SOLO':`${order.findIndex(r=>r.id===0)+1} / ${order.length}`}</strong></span><span>CHECKPOINT <strong>{finished?GATES:player.cleared%GATES} / {GATES}</strong></span><span>TIME <strong>{formatTime(player.finishTime??race.elapsed)}</strong></span></div>
 {!paused&&race.phase==='countdown'&&<div className="race-countdown" role="status"><strong>{Math.ceil(race.countdown)}</strong><span>GET READY · {trial?'TIME TRIAL':'3 LAPS'}</span></div>}
 {!paused&&race.phase==='racing'&&race.elapsed<1&&<div className="race-countdown"><strong>GO</strong></div>}
 {!paused&&finished&&<div className="pause-shade race-results"><section ref={panel} className="pause-panel" role="dialog" aria-modal="true" aria-labelledby="result-title"><h2 id="result-title">{trial?'Time trial complete.':order[0].id===0?'You take the win.':'Race complete.'}</h2><p>{trial?'Your lap':`Position ${order.findIndex(r=>r.id===0)+1} of ${order.length}`} · {formatTime(player.finishTime)}{newRecord?' · New personal best':''}</p><div className="reward-line">+ ◈ {lastReward} coins earned</div>{!trial&&<table><thead><tr><th>POS</th><th>DRIVER</th><th>TIME</th></tr></thead><tbody>{order.map((r,i)=><tr key={r.id} className={r.id===0?'player-result':''}><td>{i+1}</td><td>{r.name}</td><td>{formatTime(r.finishTime)}</td></tr>)}</tbody></table>}<p className="lap-results">{player.lapTimes.map((t,i)=><span key={i}>Lap {i+1}: {formatTime(t)}</span>)}</p><button ref={results} className="primary" onClick={()=>reset(true)}>Race again</button><button onClick={openGarage}>Back to garage</button>{!trial&&<p className="pause-help">{race.phase==='finished'?'All drivers finished.':'Remaining drivers are still racing.'}</p>}</section></div>}
 </>;
}
