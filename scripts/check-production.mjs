import {readFile,access,readdir,stat} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import assert from 'node:assert/strict';
const root=resolve('dist'),html=await readFile(resolve(root,'index.html'),'utf8');
assert.ok(!html.includes('/src/')&&!html.includes('@vite/client'),'Production HTML must not load development modules');
const assets=[...html.matchAll(/(?:src|href)="([^"]+)"/g)].map(x=>x[1]);
for(const asset of assets){assert.ok(asset.startsWith('./'),'Use relative assets for static hosting');await access(resolve(root,asset));}
const files=await readdir(resolve(root,'assets'));
for(const file of files.filter(x=>x.endsWith('.css'))){const path=resolve(root,'assets',file),css=await readFile(path,'utf8');for(const match of css.matchAll(/url\(([^)]+)\)/g)){const url=match[1].replace(/["']/g,'');if(url.startsWith('data:'))continue;assert.ok(!/^(https?:|\/)/.test(url),'Fonts and CSS assets must remain local and relative');await access(resolve(dirname(path),url));}}
assert.ok(files.some(x=>x.startsWith('GameScene-')),'3D scene should be loaded separately');
const bytes=(await Promise.all(files.map(async file=>(await stat(resolve(root,'assets',file))).size))).reduce((a,b)=>a+b,0);
console.log(`Production check passed: ${files.length} asset files, ${(bytes/1024/1024).toFixed(2)} MB uncompressed; local asset links resolve.`);
