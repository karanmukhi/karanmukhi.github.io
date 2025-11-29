const socket = io();

// Initialize xterm.js
const term = new Terminal({
    cursorBlink: true,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: 8.8,
    theme: {
        background: '#000000',
        foreground: '#f0f0f0'
    }
});

// Load FitAddon
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);

// Open terminal in the container
term.open(document.getElementById('terminal-container'));
fitAddon.fit();

// Handle window resize
window.addEventListener('resize', () => {
    fitAddon.fit();
    socket.emit('resize', { cols: term.cols, rows: term.rows });
});

// Send input to server
term.onData(data => {
    socket.emit('input', data);
});

// Receive output from server
socket.on('output', data => {
    term.write(data);
});

// Initial resize to sync server pty size
socket.emit('resize', { cols: term.cols, rows: term.rows });
