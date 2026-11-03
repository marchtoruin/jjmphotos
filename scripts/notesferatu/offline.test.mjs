import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFile,access} from 'node:fs/promises';
import vm from 'node:vm';
test('offline installation precaches every runtime asset with only local URLs',async()=>{
 const events={},cached=[];const root=new URL('../../public/notesferatu/',import.meta.url);const context={self:{addEventListener:(name,fn)=>events[name]=fn},caches:{open:async()=>({addAll:async list=>cached.push(...list)})},URL,Promise};
 vm.runInNewContext(await readFile(new URL('sw.js',root),'utf8'),context);
 let done;events.install({waitUntil:p=>done=p});await done;
 assert.ok(cached.some(p=>p.startsWith('./app.js')));assert.ok(cached.some(p=>p.startsWith('./board.js')));assert.ok(cached.includes('./vendor/browser.js'));
 for(const path of cached){assert.ok(path.startsWith('./'));await access(new URL(path==='./'?'./index.html':path,root));}
 const manifest=JSON.parse(await readFile(new URL('manifest.webmanifest',root),'utf8'));assert.equal(manifest.scope,'./');assert.equal(manifest.start_url,'./');assert.equal(manifest.display,'standalone');
});
