# Phase 2 verification — 21 October 2026

## Automated checks
22 tests pass, including the original vehicle/input checks plus countdown lock, pause freezing the timer and all racers, all 24 ordered checkpoints, reverse crossing rejection, teleport rejection, recovery without checkpoint gain, ranking and finished order, all three AI completing the race, a complete three-lap drive using actual vehicle physics, player freeze after finishing and results continuation. Time formatting covers minute rounding.

Production build passes. The existing non-blocking Three.js chunk-size warning remains.

## Browser checks
- Normal game: three-second countdown resets lap, position, checkpoints and timer; opponents are visible on the starting grid.
- Development-only browser fixture: an accelerated test driver uses the real physics and race update path, without setting checkpoint or finish state. All four drivers finished. The player completed three laps in 1:09.88 and placed third in this test run.
- Results display all four finishing times and three player lap times. Race again resets all cars and race counters and starts a fresh countdown.
- Results inspected at 1280 × 720; race HUD inspected at 425 × 664.
- No errors reported in the browser console during the race/results check.

## Limits
Phase 2 originally used non-colliding opponents; Phase 3 adds player/opponent contact as described below. Physical mobile multitouch and sustained frame rates have not been measured. The accelerated browser test verifies race completion but does not substitute for a human-driven phone playtest.

# Phase 3 verification — 21 October 2026

## Passed
- 35 automated tests, including nitro acceleration/drain/delayed recharge/empty lockout, drift in both directions and grip recovery, barrier and car contact feedback/cooldown, recovery/restart state, paused effects, 60/120 Hz consistency, audio pitch/silence targets, and audio resource cleanup with a test context.
- Production build succeeds; no dependencies added. Existing renderer chunk-size warning remains non-blocking.
- Normal browser driving: Shift+W depleted nitro to 71%, followed by recharge to 100%; Space+D produced a visible drift and tyre smoke. Collision edge feedback and the new lighting rendered without browser errors.
- Audio context reported enabled after a real keyboard/pointer gesture. Mute control changed to Unmute. Signal targets and cleanup tested automatically; speaker output was not independently listened to.
- Touch controls checked at 320 × 640 and 640 × 360. Landscape nitro meter moved above minimap to prevent overlap. Holding the on-screen GAS then NITRO buttons depleted charge to 85% and reached 83 km/h in the observed run.
- Accelerated browser regression with real physics, nitro and collisions completed all three laps. The player finished second at 1:05.70; all opponents finished and results showed lap times.

## Performance choices and limits
48 pooled smoke points, fewer emissions in touch mode, one unshadowed accent light, one-time baked reflection environment, no screen-space reflections/post-processing, capped/adaptive pixel ratio and on-demand rendering when paused or fully finished. Physical multitouch, sustained FPS, thermal load and speaker sound quality still need real-device testing. Reflections and collisions are arcade approximations.

# Phase 4 verification — 22 October 2026

## Automated checks
- `npm test` covers the existing driving and three-lap race behavior plus car selection, upgrade costs/effects, malformed and blocked storage, both mode lengths, rewards and once-only saving on finish.
- `npm run build` passes without new dependencies. The existing Three.js bundle-size warning remains non-blocking.

## Browser checks
- Garage selection changed to Volt R; its acceleration, top speed and handling updated. The selected car survived a page reload.
- Time Trial launched as a one-lap solo race. The development-only accelerated driver completed the real checkpoint/physics path, displayed a finish time and awarded coins.
- An Engine upgrade reduced coins and raised Volt R acceleration and top speed. Both the new balance and upgrade level survived a reload in the normal game tab.
- The same accelerated driver completed all three laps of Quick Race with the three opponents; the results showed position, four finish times and a coin award.

The accelerated driver is a development fixture, not a substitute for physical phone steering or sustained frame-rate testing.

# Phase 5 verification — 22 October 2026

- 48 automated tests pass: prior driving/race/progress checks plus quality persistence, invalid/blocked settings storage, frame profiling, adaptive-quality decisions and a partial-input regression.
- `npm run check:production` builds and validates the output: no development entry, local relative HTML/CSS/font references resolve, and the 3D scene is a separate lazy-loaded chunk. No dependencies added.
- Production browser: loading screen appears before scene readiness. Low/High settings switch during play, and High plus the monitor preference survive reload. Existing coins and the engine upgrade remain intact.
- Keyboard: Space starts a race and resumes from the pause menu; Tab wraps from the last pause control to the first. Background content has `inert` applied while the dialog is open.
- Mobile layout inspected at 320 × 640 and 640 × 360. Landscape controls occupy the corners with speed/nitro in the centre; portrait controls remain within the viewport. A held on-screen GAS pedal reached 56 km/h, then pause froze the race.
- Short desktop in-app browser profiling samples showed 60 FPS / 16.7 ms per frame for both Low and High. Observed workloads were about 43k triangles on Low and 93k on High. These were short gameplay samples, not a controlled hardware benchmark or a guarantee of sustained phone performance.

The Three.js bundle remains about 243 kB gzip and produces Vite's existing size advisory. It is requested with the lazy 3D scene; the garage and loading message can appear first. Physical multi-touch, sustained phone FPS/thermal behaviour and screen-reader spoken output still require real-device checks.
