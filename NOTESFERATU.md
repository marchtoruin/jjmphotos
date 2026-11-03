# Notesferatu web app

Entry point: https://jjmphotos.com/notesferatu/

This is an independent static web app under `public/notesferatu/`. Vite copies it unchanged into the existing Netlify publish directory. It has no accounts, billing, analytics, database server or dependency on the photography interface. The service worker is scoped to `/notesferatu/`; it cannot control the rest of the website.

## Install on iPhone

1. Open the address above in Safari while online.
2. Use Share > Add to Home Screen; enable Open as Web App if offered, then Add.
3. Close the Safari tab and launch Notesferatu using its new Home Screen icon. Use that installed copy consistently.
4. Create a disposable note, close/reopen the app and confirm it remains. After allowing the app to cache online, check opening it in Airplane Mode, then reconnect.
5. Under Settings, request persistent storage and use Export notebook ZIP regularly. Verify that the ZIP is saved in Files or another safe destination. Restore adds copies with fresh IDs rather than replacing existing notes.

The exact menus vary by iOS version. Real-device Safari camera, photo picker, keyboard, pinch gestures, PNG share/download, offline launch and backup restore still need testing on the owner's mother's phone. There is no native iPhone widget. All Page/Canvas editing features are unlocked.

## Data

Notes and photo blobs stay in IndexedDB on that device/browser. Website hosting requests do not contain notebook contents. The app caches only its static runtime assets, not note content. A shared website origin means other trusted code on jjmphotos.com can access the same origin's browser storage; this is not encryption or a separate security boundary.

Local storage is not cloud backup. Website data clearing, storage pressure, changing browsers/addresses or device loss can remove access to notes. Persistent storage is best-effort. Backups are unencrypted. Photo imports are normalized to JPEG with maximum edge 2400 px. Web ZIPs are bounded to 128 MB total uncompressed, 32 MB per photo, 8 MB manifest and 5,000 notes. Large Android backups may exceed these web limits.

Notes created in the local `127.0.0.1` prototype do not automatically transfer here. Export/import a notebook ZIP if you want to move them. Installing/launching a Home Screen app can also use a separate browser storage context; install first, then use that copy as the notebook.

## Maintenance

- App source is plain JavaScript/CSS in `public/notesferatu/`; it needs no additional runtime packages or separate build step. The fflate ZIP module and Pirata One font are bundled with licenses.
- Production build and photography source are unchanged. Netlify routes for this subdirectory precede the photography SPA fallback. Missing app assets return an app-specific 404 instead of photography HTML.
- When changing app runtime assets, bump the cache name in `sw.js` and versioned imports/styles in `index.html` and `app.js`. Do not clear IndexedDB or auto-reload unsaved edits to apply updates.
- Built-in server requests are limited to the same origin's app assets. Keep the restrictive app-only CSP, JavaScript MIME types and no-cache headers. Do not add tracking scripts to this subdirectory.
- Run `node --test scripts/notesferatu/*.test.mjs` for the dependency-free list, ordering, ZIP and offline-inventory tests. Broader local prototype checks also exercise IndexedDB rollback/reconnect and DOM editing; those passed before integration.
- A single-editor Web Lock prevents two active tabs from overwriting each other's notebook where supported. Close other app windows if the app says the crypt is already open.

Current app version: 0.1.1. Android app code and paid Google Play setup are maintained separately.
