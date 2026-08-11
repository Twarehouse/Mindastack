


// const { app, BrowserWindow, Menu } = require("electron");
// const path = require("path");

// Menu.setApplicationMenu(null);

// function createWindow() {
//   const isWindows = process.platform === "win32";

//   const win = new BrowserWindow({
//     width: isWindows ? 1280 : 1024,
//     height: isWindows ? 800 : 600,

//     kiosk: !isWindows,

//     frame: isWindows,
//     fullscreen: false,

//     resizable: isWindows,
//     movable: true,

//     minimizable: isWindows,
//     maximizable: isWindows,
//     closable: true,

//     autoHideMenuBar: true,

//     webPreferences: {
//       nodeIntegration: false,
//       contextIsolation: false,
//       webSecurity: true,
//     },
//   });

//   if (isWindows) {
//     win.maximize(); // Fit laptop screen automatically
//   }

//   const htmlPath = app.isPackaged
//     ? path.join(app.getAppPath(), "dist", "index.html")
//     : path.join(__dirname, "../dist/index.html");

//   win.loadFile(htmlPath);

//   win.webContents.openDevTools({ mode: "detach" });   // this line for debugging of software

//   win.webContents.on("before-input-event", (event, input) => {
//     if (
//       input.control &&
//       input.shift &&
//       input.key.toLowerCase() === "q"
//     ) {
//       app.quit();
//     }

//     if (!isWindows && (input.key === "Escape" || input.key === "F4")) {
//       event.preventDefault();
//     }
//   });
// }

// if (!app.requestSingleInstanceLock()) {
//   app.quit();
// }

// app.whenReady().then(createWindow);

// app.on("window-all-closed", () => {
//   if (process.platform !== "darwin") {
//     app.quit();
//   }
// });

// app.on("activate", () => {
//   if (BrowserWindow.getAllWindows().length === 0) {
//     createWindow();
//   }
// });





const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");

Menu.setApplicationMenu(null);


function createWindow() {
  const isWindows = process.platform === "win32";

  const win = new BrowserWindow({
    width: isWindows ? 1280 : 1024,
    height: isWindows ? 800 : 600,

    kiosk: !isWindows,

    frame: isWindows,
    fullscreen: false,

    resizable: isWindows,
    movable: true,

    minimizable: isWindows,
    maximizable: isWindows,
    closable: true,

    autoHideMenuBar: true,

    webPreferences: {
      nodeIntegration: false,
      contextIsolation: false,
      webSecurity: true,
    },
  });

  if (isWindows) {
    win.maximize(); // Fit laptop screen automatically
  }

  const htmlPath = app.isPackaged
    ? path.join(app.getAppPath(), "dist", "index.html")
    : path.join(__dirname, "../dist/index.html");

  win.loadFile(htmlPath);

  // win.webContents.openDevTools({ mode: "detach" });   // this line for debugging of software and console logs

  win.webContents.on("before-input-event", (event, input) => {
    if (
      input.control &&
      input.shift &&
      input.key.toLowerCase() === "q"
    ) {
      app.quit();
    }

    if (!isWindows && (input.key === "Escape" || input.key === "F4")) {
      event.preventDefault();
    }
  });
}

if (!app.requestSingleInstanceLock()) {
  app.quit();
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});