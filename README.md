# NEON STREET RACER 3D — Phase 5
Choose one of three original cars, upgrade its performance and race on the procedural city circuit. Progress stays in this browser. No account, backend, downloaded 3D models or paid services.

## Open locally
Install Node.js 22.12+ (or Node.js 24). In this folder run `npm install`, then `npm run dev`. Open the local URL printed in the terminal. Keep the terminal running.

For a phone on the same Wi-Fi, open the Network URL printed by Vite. Allow local-network access if your computer asks. Landscape works best. The game also supports portrait.

## Controls
- Garage: select a car, buy per-car upgrades with earned coins, then start Quick Race or Time Trial.
- W / Up: accelerate
- S / Down: brake, then reverse
- A/D or Left/Right: steer
- Shift: hold rechargeable nitro (while moving forward)
- Space: hold drift while steering above 43 km/h
- Speaker button: mute/unmute sound
- Esc: pause/resume
- R: recover to the last cleared checkpoint
- Restart: restart the current mode, lap counters and countdown
- Touch: hold GAS/BRAKE and a steering button together. Controls are detected automatically; the pause menu also has a touch-control toggle.

Switching tabs or losing window focus pauses the drive and releases inputs. Resume through the pause screen. A reset clears held inputs: release and press again to drive. The pause and results screens offer a return to the garage.

## Checks and build
`npm test` runs vehicle-handling and circuit tests. `npm run build` creates the production `dist/` folder. `npm run preview` serves that build. Serve the game over HTTP; opening index.html directly is unsupported.

## Architecture
GameScene composes Track, City, VehicleController and Camera. VehicleModel is procedural geometry with three player variants. physics.js holds deterministic fixed-step vehicle movement and reads the selected car's performance. race.js handles countdown, ordered gates, laps, AI paths, standings and finish times for both modes. RaceScene reuses VehicleModel for rivals; RaceHUD shows race progress and results. InputManager and MobileControls manage shared input sources. state.js is a minimal external store; progress.js validates and saves local progress. The HUD reads telemetry at 10 Hz without rerendering the scene every frame.

## Scope and limits
Three AI opponents follow the circuit at different speeds. Clear eight ordered checkpoints on each of three laps; the next gate glows green. A 3–2–1 countdown locks the cars before the race. Position tracks validated progress; finish order and per-lap times appear on the results screen. Remaining opponents continue until they finish. Car contact now uses simple arcade collision separation and speed loss; barrier impacts also trigger feedback. No multiplayer. Arcade barriers reduce speed and constrain the car; this is not a collision simulator. Rendering caps pixel ratio at 1.5 and reduces it to 1 if the initial measured rate is low. Buildings/windows use instancing; no dynamic shadows or expensive post-processing. Smoke is capped at 48 pooled particles with a reduced emission rate on touch devices. Reflection lighting is baked once from tiny procedural panels; road colour reflections are approximations. Paused and fully finished scenes render on demand. Performance depends on the device. Barlow fonts and their open-source licences are bundled locally; no external assets are fetched during play.

## Browser gameplay check
The development-only `/tests/browser-race.html` fixture drives the actual vehicle physics at accelerated speed to exercise three laps and the results screen. It also uses nitro for a Phase 3 regression check. It is not part of the production build.

## Phase 3 driving and effects
Nitro drains over roughly 3.6 seconds and recharges after a 1.4-second delay. Release and press again after running the tank empty. Brake, reverse and off-road conditions disable boost. Recovery keeps your remaining charge; restarting refills it. Normal maximum is about 187 km/h; nitro allows about 245 km/h, with gradual speed reduction afterwards.

Drift adds sideways slip while steering at speed; releasing Space restores grip. Touch has dedicated DRIFT and NITRO hold buttons. Smoke and brief impact glow provide feedback without camera shake. Reduced-motion preferences use a simple impact border.

Engine, tyre/boost noise and collision thumps are synthesised with Web Audio. Sound begins only after a key press or tap, silences while paused/backgrounded or finished, and can be muted with the speaker button. Audio nodes and graphics resources are cleaned up on unmount. No downloaded sound assets or new dependencies.

## Phase 4 garage and progress
- Pulse GT is balanced, Volt R accelerates and turns more sharply, and Nocturne X has a higher top speed. All three are available immediately and have distinct procedural body details.
- Engine, Handling and Nitro have three upgrade levels per car. The garage shows costs, remaining coins and the resulting performance. Purchases never spend more than the available balance.
- Quick Race keeps the original three-lap, four-car race and awards 140/110/80/50 coins by finishing position. Time Trial is one solo lap with the same ordered checkpoints and awards 70 coins on completion. Both modes save a personal best.
- The selected car, last mode, upgrades, coins, completed-race count, wins and best times are stored under `neon-street-racer-progress-v1` in browser localStorage. Invalid saved data falls back to safe defaults. Clearing this site's data resets progress; browsers with storage disabled can still play, but progress cannot survive a reload.

## Phase 5 polish
Auto, Low, Balanced and High graphics presets are available in the garage and pause menu. They control resolution, smoke, reflections and city-window detail without changing physics. Auto starts Balanced and can reduce detail when frame rate is low. Preferences survive reload in a separate localStorage entry.

The optional performance monitor reports rendered FPS, average frame time, draw calls, triangles and slow frames once per second. It excludes long background stalls and shows an idle message when rendering on demand. These are frame-interval measurements, not GPU timings.

The 3D scene loads separately behind a loading screen. Mobile menus scroll, short landscape driving controls leave the centre clear, dialogs contain keyboard focus and make the background inert, and button/selection keyboard actions no longer trigger driving shortcuts. On-screen pedals support held Space/Enter as well as pointers. Storage failure is shown in the garage. WebGL context loss displays a reload recovery message.

Run `npm run check:production` for the production build and local-asset checks. See [DEPLOYMENT.md](DEPLOYMENT.md) for beginner-friendly preview, phone and folder-upload steps. The deployment ZIP contains only the built website.
