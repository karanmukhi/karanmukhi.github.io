// Connect to the local server
// We hardcode localhost:3000 because the static site might be served from a different port/origin
const socket = io('http://localhost:3000');

// Initialize xterm.js
const term = new Terminal({
    cursorBlink: true,
    fontFamily: 'Menlo, Monaco, "Courier New", monospace',
    fontSize: 8.8,
    theme: {
        background: '#000000',
        foreground: '#f0f0f0'
    },
    allowProposedApi: true
});

// Load FitAddon
const fitAddon = new FitAddon.FitAddon();
term.loadAddon(fitAddon);

// Open terminal in the container
const container = document.getElementById('terminal-container');
term.open(container);
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

// Connection status handling
socket.on('connect', () => {

    // Initial resize to sync server pty size
    socket.emit('resize', { cols: term.cols, rows: term.rows });
});

socket.on('connect_error', (err) => {
    term.write('\r\n\x1b[31mConnection failed. Is the server running?\x1b[0m\r\n');
    term.write('\x1b[90mRun: node chess/web-wrapper/server.js\x1b[0m\r\n');
});

socket.on('disconnect', () => {
    term.write('\r\n\x1b[31mDisconnected from server.\x1b[0m\r\n');
});
