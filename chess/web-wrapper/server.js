const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});
const pty = require('node-pty');
const path = require('path');
const os = require('os');

// Enable CORS for Express
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// Set up static file serving
// Serve the repository root so we can see the main website
app.use(express.static(path.join(__dirname, '../../')));

// Handle socket connections
io.on('connection', (socket) => {
  console.log('Client connected');

  // Spawn the C++ process
  // We assume the 'run' executable is in the sibling directory 'ConsoleChess'
  const shell = path.join(__dirname, '../ConsoleChess/run');

  // Check if the executable exists, if not try to make it or warn
  // For now, we assume it exists as per the plan.

  const ptyProcess = pty.spawn(shell, [], {
    name: 'xterm-color',
    cols: 80,
    rows: 24,
    cwd: path.join(__dirname, '../ConsoleChess'),
    env: process.env
  });

  // Send data from pty to client
  ptyProcess.on('data', (data) => {
    socket.emit('output', data);
  });

  // Receive data from client and write to pty
  socket.on('input', (data) => {
    ptyProcess.write(data);
  });

  // Handle resize
  socket.on('resize', (size) => {
    ptyProcess.resize(size.cols, size.rows);
  });

  // Cleanup on disconnect
  socket.on('disconnect', () => {
    console.log('Client disconnected');
    ptyProcess.kill();
  });
});

const PORT = process.env.PORT || 3000;
http.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
