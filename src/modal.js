import {useEffect} from 'react';
// Keep keyboard and assistive-technology focus inside the active dialog.
export function useModal(ref,active){useEffect(()=>{if(!active||!ref.current)return;const dialog=ref.current,previous=document.activeElement,hidden=[];let branch=dialog;while(branch.parentElement){for(const sibling of branch.parentElement.children){if(sibling!==branch&&!sibling.inert){hidden.push(sibling);sibling.inert=true;}}branch=branch.parentElement;if(branch.id==='root')break;}
 const focusables=()=>[...dialog.querySelectorAll('button:not(:disabled),select,input,a[href],[tabindex="0"]')];focusables()[0]?.focus();
 const trap=e=>{if(e.key!=='Tab')return;const items=focusables(),first=items[0],last=items.at(-1);if(!items.length){e.preventDefault();return;}if(e.shiftKey&&document.activeElement===first){e.preventDefault();last.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first.focus();}};
 dialog.addEventListener('keydown',trap);return()=>{dialog.removeEventListener('keydown',trap);hidden.forEach(node=>node.inert=false);if(previous?.isConnected)previous.focus();};},[active,ref]);}
