import { zipSync, unzipSync, strToU8, strFromU8 } from './vendor/browser.js';
export const VERSION = '0.1.1';
export const uid = () => crypto.randomUUID();
export const emptyBoard = () => ({items:[],strokes:[],grid:false,viewport:{x:0,y:0,scale:1}});
export function makeNote(type='Page', parentId=null) { const now=Date.now(); return {id:uid(),title:'',body:'',type,parentId,createdAt:now,updatedAt:now,pinned:false,sortOrder:-now,photos:[],content:emptyBoard()}; }
export const refs = n => [...new Set([...n.photos, ...n.content.items.map(i=>i.photo).filter(Boolean)])];
export const sorted = notes => [...notes].sort((a,b)=>Number(b.pinned)-Number(a.pinned)||a.sortOrder-b.sortOrder||b.createdAt-a.createdAt||b.id.localeCompare(a.id));
export function listEdit(before, after, oldStart, oldEnd, caret) {
  if(oldStart!==oldEnd || caret!==oldStart+1 || after.length!==before.length+1 || after.slice(0,oldStart)+after.slice(oldStart+1)!==before) return {text:after,caret};
  const start=before.lastIndexOf('\n',oldStart-1)+1, line=before.slice(start,oldStart), added=after[oldStart];
  if(added===' ' && /^[\t ]*-$/.test(line)) return {text:after.slice(0,oldStart-1)+'•'+after.slice(oldStart),caret};
  if(added!=='\n') return {text:after,caret};
  const m=line.match(/^([\t ]*)(?:(\d+)\.|([-•]))(?:[\t ]+(.*))?$/);
  if(!m) return {text:after,caret};
  const end=before.indexOf('\n',oldStart), rest=before.slice(oldStart,end<0?before.length:end);
  if(!(m[4]||'').trim()&&!rest.trim()) return {text:after.slice(0,start)+after.slice(caret),caret:start};
  if(m[2]&&!Number.isSafeInteger(Number(m[2])+1)) return {text:after,caret};
  const prefix=m[1]+(m[3]?'•':`${Number(m[2])+1}.`)+' ';
  return {text:after.slice(0,caret)+prefix+after.slice(caret),caret:caret+prefix.length};
}
export async function openDB() {
  return new Promise((resolve,reject)=>{const r=indexedDB.open('notesferatu-web',1);r.onupgradeneeded=()=>{r.result.createObjectStore('notes',{keyPath:'id'});r.result.createObjectStore('photos');r.result.createObjectStore('meta');};r.onsuccess=()=>{const db=r.result;db.onversionchange=()=>db.close();resolve(db);};r.onerror=()=>reject(r.error);r.onblocked=()=>reject(new Error('Close other Notesferatu tabs and reopen.'));});
}
export async function readAll(db) {
  return new Promise((resolve,reject)=>{const tx=db.transaction(['notes','photos','meta']);const rows=tx.objectStore('notes').getAll(), keys=tx.objectStore('photos').getAllKeys(), blobs=tx.objectStore('photos').getAll(), meta=tx.objectStore('meta').get('lastBackup');tx.oncomplete=()=>resolve({notes:rows.result,photos:new Map(keys.result.map((k,i)=>[k,blobs.result[i]])),lastBackup:meta.result||null});tx.onerror=()=>reject(tx.error);});
}
export function persist(db,notes,photos,lastBackup) {
  return new Promise((resolve,reject)=>{const tx=db.transaction(['notes','photos','meta'],'readwrite');tx.oncomplete=resolve;tx.onabort=()=>reject(tx.error||new Error('Storage write failed'));tx.onerror=()=>reject(tx.error);try{const n=tx.objectStore('notes'),p=tx.objectStore('photos');n.clear();p.clear();notes.forEach(x=>n.put(x));photos.forEach((b,k)=>p.put(b,k));if(lastBackup)tx.objectStore('meta').put(lastBackup,'lastBackup');}catch(e){tx.abort();reject(e);}});
}
const MAX_TOTAL=128*1024*1024, MAX_PHOTO=32*1024*1024;
const safePhoto=n=>/^[a-f0-9-]+\.photo$/.test(n);
export function validateZip(bytes) {
  if(bytes.length>MAX_TOTAL)throw new Error('Backup exceeds 128 MB.');
  const v=new DataView(bytes.buffer,bytes.byteOffset,bytes.byteLength);let e=-1;
  for(let i=bytes.length-22;i>=Math.max(0,bytes.length-65557);i--)if(v.getUint32(i,true)===0x06054b50&&i+22+v.getUint16(i+20,true)===bytes.length){e=i;break;}
  if(e<0||v.getUint16(e+4,true)||v.getUint16(e+6,true))throw new Error('Unsupported ZIP archive.');
  const count=v.getUint16(e+10,true);if(count>10001)throw new Error('Too many backup files.');
  let at=v.getUint32(e+16,true), total=0;const names=new Set();
  for(let i=0;i<count;i++){
    if(at+46>e||v.getUint32(at,true)!==0x02014b50)throw new Error('Invalid ZIP directory.');
    const flags=v.getUint16(at+8,true), size=v.getUint32(at+24,true),len=v.getUint16(at+28,true),extra=v.getUint16(at+30,true),comment=v.getUint16(at+32,true);
    const name=strFromU8(bytes.slice(at+46,at+46+len));
    if(flags&1||names.has(name)||!(name==='notebook.json'||name.startsWith('photos/')&&safePhoto(name.slice(7))))throw new Error('Unsafe or duplicate backup entry.');
    if(size>(name==='notebook.json'?8*1024*1024:MAX_PHOTO)||(total+=size)>MAX_TOTAL)throw new Error('Backup exceeds safe storage limits.');
    names.add(name);at+=46+len+extra+comment;
  }
  if(!names.has('notebook.json'))throw new Error('Missing notebook.json.');
}
export async function backupBytes(notes, photos) {
  const files={}, needed=new Set(notes.flatMap(refs));
  const rows=sorted(notes).map(n=>({...n,photos:JSON.stringify(n.photos),content:JSON.stringify(n.content)}));
  files['notebook.json']=strToU8(JSON.stringify({format:'Notesferatu',version:2,notes:rows}));
  for(const name of needed){if(!safePhoto(name)||!photos.has(name))throw new Error('A note photo is missing.');files['photos/'+name]=new Uint8Array(await photos.get(name).arrayBuffer());}
  const zipped=zipSync(files,{level:0});validateZip(zipped);return zipped;
}
function finite(v,fallback=0){return typeof v==='number'&&Number.isFinite(v)?v:fallback;}
export function restoreBytes(bytes) {
  validateZip(bytes);const files=unzipSync(bytes),root=JSON.parse(strFromU8(files['notebook.json']));
  if(root.format!=='Notesferatu'||![1,2].includes(root.version)||!Array.isArray(root.notes)||root.notes.length>5000)throw new Error('Not a supported Notesferatu backup.');
  const ids=new Map(),photos=new Map(),photoMap=new Map();
  for(const [idx,n] of root.notes.entries()){const id=n.id??`legacy-${idx}`;if(typeof id!=='string'||ids.has(id))throw new Error('Duplicate note IDs.');ids.set(id,uid());}
  for(const [name,data] of Object.entries(files))if(name.startsWith('photos/')){const fresh=uid()+'.photo';photoMap.set(name.slice(7),fresh);photos.set(fresh,new Blob([data]));}
  const remap=name=>{if(!photoMap.has(name))throw new Error('Backup refers to a missing photo.');return photoMap.get(name);};
  const notes=root.notes.map((n,index)=>{
    if(!['Page','Canvas'].includes(n.type)||typeof n.title!=='string'||typeof n.body!=='string'||!Number.isFinite(n.createdAt)||!Number.isFinite(n.updatedAt))throw new Error('Invalid note data.');
    const original=typeof n.content==='string'?JSON.parse(n.content):n.content||{}, list=typeof n.photos==='string'?JSON.parse(n.photos):n.photos||[];
    if(!Array.isArray(list)||!Array.isArray(original.items||[])||!Array.isArray(original.strokes||[]))throw new Error('Invalid photo or board data.');
    const content={grid:!!original.grid,viewport:original.viewport||{x:0,y:0,scale:1},items:(original.items||[]).map(i=>({id:uid(),text:String(i.text||''),photo:i.photo?remap(i.photo):'',x:finite(i.x,24),y:finite(i.y,24),w:Math.max(24,finite(i.w,260)),h:Math.max(24,finite(i.h,200)),r:finite(i.r),locked:!!i.locked,frame:!!i.frame,crop:finite(i.crop),native:!!i.native,presetRatio:finite(i.presetRatio)})),strokes:(original.strokes||[]).map(s=>({color:s.color,width:Math.max(1,finite(s.width,3)),points:(s.points||[]).map(p=>{if(!Array.isArray(p)||p.length<2||!p.every(Number.isFinite))throw new Error('Invalid ink.');return p.slice(0,2);})}))};
    if(n.parentId!=null&&!ids.has(n.parentId))throw new Error('Missing parent note.');
    return {id:ids.get(n.id??`legacy-${index}`),title:n.title,body:n.body,type:n.type,createdAt:n.createdAt,updatedAt:n.updatedAt,pinned:!!n.pinned,parentId:n.parentId==null?null:ids.get(n.parentId),sortOrder:index,photos:list.map(remap),content};
  });
  const byId=new Map(notes.map(n=>[n.id,n]));
  for(const note of notes){const visited=new Set([note.id]);let parent=note.parentId;while(parent){if(visited.has(parent)||byId.get(parent)?.type!=='Page')throw new Error('Invalid subnote hierarchy.');visited.add(parent);parent=byId.get(parent).parentId;}}
  const keep=new Set(notes.flatMap(refs));for(const key of photos.keys())if(!keep.has(key))photos.delete(key);
  return {notes,photos};
}
