# Preview and publish the game

## Open the ready preview
Use the local link supplied with this project while its preview server is running. The garage opens first. Choose a car and race mode, then select Start.

In the garage or pause menu, Graphics quality offers Auto, Low, Balanced and High. Start with Auto. If a phone feels slow or becomes warm, choose Low. Show performance monitor displays FPS and frame time during racing; higher FPS and lower frame time are better. Paused and garage views render only when needed, so the monitor says “Rendering on demand”.

## Restart the preview yourself
1. Extract `neon-street-racer.zip` and open the `neon-street-racer` folder.
2. Install Node.js 22.12 or later if it is not already installed. Open Terminal in this folder.
3. Run these commands one at a time:

```sh
npm ci
npm run check:production
npm run preview
```

4. Open the Local address printed in Terminal (normally `http://localhost:4173`). Keep Terminal open while playing. Press Control+C in Terminal to stop it.
5. For a phone on the same Wi-Fi, use the Network address printed in Terminal. The computer must stay awake. Landscape gives the widest driving view.

Do not double-click `index.html`: the game needs an HTTP web server. `npm run preview` is for local checking, not permanent public hosting. [Vite's official deployment guide](https://vite.dev/guide/static-deploy.html) explains this distinction.

## Publish with a folder upload
The separate `neon-street-racer-deploy.zip` contains only the ready website files. You do not need to install Node.js to upload that package.

1. Extract the deployment ZIP into a folder. The folder should contain `index.html`, `assets` and `fonts` directly inside it.
2. Open [Netlify Drop](https://app.netlify.com/drop) and sign in to your own account if requested.
3. Drag that extracted folder onto the upload area. If publishing from the source project instead, upload its `dist` folder after running `npm run check:production`.
4. Wait for the site's address, then open it and test the garage, a race, sound after a tap, and save/load after a reload.
5. Share that public address. For later changes, rebuild and upload the new `dist` folder to the same site's deploy area.

Manual uploads use the already-built folder; they do not run the build for you. [Netlify's official manual-deploy instructions](https://docs.netlify.com/deploy/create-deploys/).

No backend, database, environment variables or login system are required. Do not upload `node_modules` or the source project as the published folder. Other static hosts can serve the same built files; relative asset paths support a subfolder as well as a site's root.

## Saved progress
Progress stays in the current browser for the current website address. A newly published address starts with fresh progress; localhost coins do not transfer automatically. Clearing site data removes progress. Private browsing or disabled storage may prevent saving. Graphics settings are saved separately from cars, upgrades and coins.

## Before sharing
- Run `npm test` and `npm run check:production` after code changes.
- Check one race and the garage on the actual phones you want to support.
- Try Low quality on slower devices. Desktop test FPS is not a guarantee for phones.
- Keep the source ZIP as your editable copy; use the deployment ZIP for hosting.
