# 04 — The Four Arcade Games

[← FolioForge README](../../README.md) · [فارسی](../fa/04-arcade-games.md)

The arcade is an optional demonstration of browser interaction, input handling, score tracking, and a separate server validation flow. Do not include it in every résumé automatically; use it when a personal touch or coding demonstration helps your audience.

## Snake

**Goal:** collect food and avoid the walls and your own body.

- The game board is a 20 × 20 grid.
- Each food item adds 10 points.
- Movement begins slowly and becomes faster as the score rises.
- Arrow keys and WASD change direction.
- The server replays the direction trace using the same seed, movement rules, and timing curve.

## Tetris

**Goal:** arrange falling pieces to clear complete rows.

- The board is 10 columns × 20 rows.
- Clearing rows earns more points for multi-row clears.
- Left/Right move, Down soft-drops, Up/W rotates, and Space hard-drops.
- Gravity becomes faster gradually as the score increases.
- The server mirrors the random seed and scoring rules.

## Breakout

**Goal:** bounce the ball off the paddle to break bricks.

- Move the paddle using Left/Right or A/D.
- Each brick adds 10 points.
- Losing the ball uses one life; the round ends after lives are depleted.
- The server replays paddle input, ball movement, brick collision, and scoring.

## Pac-Man

**Goal:** collect pellets in a maze while avoiding ghosts.

- Use arrow keys or WASD.
- Each pellet adds 10 points.
- Ghost movement uses a deterministic rule so the same input trace can be simulated again.
- The round ends when the player loses all lives or clears the maze.

## How score verification works

A new round gets a run ID and seed from the server. The browser records compact input codes. At the end of a round, the server simulates the same game and calculates the score. The shared record is saved only when the simulated score matches the submitted score and the session is valid and unused.

This prevents simple number editing from becoming a valid shared score. It does not stop every bot, exploit, or multi-account attack.

## Game-change checklist

- Test a normal round from start to game over.
- Confirm all scoring events.
- Check keyboard and mobile touch input.
- Confirm the restart starts a clean state.
- Compare frontend physics with server replay rules.
- If the replay is inconsistent, fix the rule difference. Do not disable verification just to make scores save.
- Verify the shared API response before saying the shared score was recorded.

## Accessibility

Game canvases provide text labels and keyboard focus. Keep buttons labeled and touch targets large. Do not require rapid repeated tapping as the only way to play. Respect reduced-motion settings when adding effects.
