# Dory to the Ocean

Browser game — Dory swims through sewer pipes to reach the ocean. Flappy Bird mechanics.

## Run locally

```bash
make run
```

Open http://localhost:5173

## Deploy to GitHub Pages

```bash
git tag v1.0.0
git push origin v1.0.0
```

Game at `https://<username>.github.io/fishgame/`

## Install as app (PWA)

On the start screen, tap **Add to Home Screen** when the button appears (Chrome/Edge on Android or desktop). Requires HTTPS (GitHub Pages).

## Controls

- Tap / click — swim up (gravity pulls down)
- Collect friends (+1 friend, +10 score)
- Avoid rusty pipes, sharks (-2 HP) and pufferfish (-1 HP)
