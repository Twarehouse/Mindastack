# MINDA GUI ROBOT FRONTEND

A React + Vite + Tailwind frontend for the Minda robot GUI, packaged as a desktop app using Electron.

## Tech Stack

- **React** – UI library
- **Vite** – build tool / dev server
- **Tailwind CSS** – styling
- **Electron** – desktop app packaging

## Project Structure

```
.
├── assets/              # All images used across the app
├── electron/
│   └── main.js           # Electron main process (window creation, kiosk mode, shortcuts)
├── src/
│   ├── context/
│   │   └── RosContext.jsx  # Handles all communication with the robot (ROS)
│   └── pages/             # All robot GUI pages/screens
├── dist/                 # Production build output (generated)
├── package.json
└── README.md
```

### Key Files

- **`src/context/RosContext.jsx`** — Central context for all robot communication. Any component that needs to talk to the robot (send commands, read robot state, subscribe to topics, etc.) should consume this context rather than talking to ROS directly.
- **`electron/main.js`** — Electron entry point. Configures the app window (kiosk mode on non-Windows platforms, maximized windowed mode on Windows), disables the application menu, blocks `Esc`/`F4` from exiting kiosk mode, and binds `Ctrl+Shift+Q` as the quit shortcut.
- **`src/pages/`** — Each robot GUI screen lives here as its own page component.
- **`assets/`** — Static images used throughout the UI (icons, logos, illustrations, etc.).

## Prerequisites

- [Node.js](https://nodejs.org/) (LTS recommended)
- npm (comes with Node.js)

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Start the dev server

```bash
npm run dev -- --host
```

The `--host` flag exposes the dev server on your local network, so the app can also be opened from other devices (e.g. a tablet or another PC) connected to the same network.

Once running, open the URL shown in the terminal — usually:

```
http://localhost:5173
```

## Running as a Desktop App (Electron)

The Electron shell (`electron/main.js`) loads the production build (`dist/index.html`), so you need to build the frontend first.

```bash
npm run build
```

Then launch Electron pointing at the built app (adjust the script name to match your `package.json`, e.g. `npm run electron` or `npm start`).

### Window Behavior

- **Windows:** Runs in a normal, resizable, maximized window (1280×800 default) with the frame visible.
- **Linux/macOS:** Runs in **kiosk mode** (fullscreen, no frame) — intended for the robot's onboard touchscreen display.
- **Escape / F4** are blocked while in kiosk mode to prevent accidentally exiting.
- **Ctrl+Shift+Q** quits the app from anywhere.
- The application menu bar is disabled on all platforms.
- Only a single instance of the app can run at a time (enforced via `requestSingleInstanceLock`).

To enable DevTools for debugging, uncomment this line in `electron/main.js`:

```js
// win.webContents.openDevTools({ mode: "detach" });
```

## Building for Production

```bash
npm run build
```

This generates the static production build in the `dist/` folder, which `electron/main.js` loads at runtime (`../dist/index.html` in dev, or `dist/index.html` inside the packaged app).

## Notes

- Make sure the robot's ROS bridge/server is reachable from the device running this frontend — connection details are configured in `src/context/RosContext.jsx`.
- When testing from another device on the network, ensure both devices are on the same network and that no firewall is blocking port `5173`.
