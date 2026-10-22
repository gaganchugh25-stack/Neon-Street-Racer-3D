export const SETTINGS_KEY='neon-street-racer-settings-v1';
export const PRESETS={low:{label:'Low',dpr:.8,smoke:16,reflections:false},balanced:{label:'Balanced',dpr:1,smoke:32,reflections:true},high:{label:'High',dpr:1.5,smoke:48,reflections:true}};
export function loadSettings(storage){try{const data=JSON.parse((storage??globalThis.localStorage).getItem(SETTINGS_KEY));return {quality:['auto',...Object.keys(PRESETS)].includes(data?.quality)?data.quality:'auto',showPerformance:data?.showPerformance===true};}catch{return {quality:'auto',showPerformance:false};}}
export function saveSettings(settings,storage){try{(storage??globalThis.localStorage).setItem(SETTINGS_KEY,JSON.stringify(settings));return true;}catch{return false;}}
// Ignore resumed-tab stalls. These measurements describe rendered frames, not GPU time.
export function createProfile(){return {seconds:0,frames:0,slow:0,worst:0};}
export function sampleProfile(profile,dt){if(!Number.isFinite(dt)||dt<=0||dt>.25)return null;profile.seconds+=dt;profile.frames++;profile.slow+=Number(dt>1/30);profile.worst=Math.max(profile.worst,dt);if(profile.seconds<1)return null;const result={fps:Math.round(profile.frames/profile.seconds),frameMs:Math.round(profile.seconds/profile.frames*10000)/10,slowFrames:Math.round(profile.slow/profile.seconds),worstMs:Math.round(profile.worst*1000)};Object.assign(profile,createProfile());return result;}
export function autoQuality(current,fps){return fps<28?'low':fps<45&&current==='high'?'balanced':current;}
