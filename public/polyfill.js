// Node.js polyfill for client-side compatibility
// This script must be loaded before any other scripts

if (typeof window !== 'undefined') {
  // Define Node.js globals for client-side compatibility
  if (typeof global === 'undefined') {
    window.global = window;
  }
  
  if (typeof __dirname === 'undefined') {
    window.__dirname = '/';
    global.__dirname = '/';
  }
  
  if (typeof __filename === 'undefined') {
    window.__filename = 'index.js';
    global.__filename = 'index.js';
  }
  
  if (typeof process === 'undefined') {
    window.process = {
      env: {},
      cwd: function() { return '/'; },
      nextTick: function(fn) { setTimeout(fn, 0); }
    };
    global.process = window.process;
  }
  
  // Ensure these are available globally
  Object.defineProperty(window, '__dirname', {
    value: '/',
    writable: false,
    enumerable: true,
    configurable: false
  });
  
  Object.defineProperty(window, '__filename', {
    value: 'index.js',
    writable: false,
    enumerable: true,
    configurable: false
  });
}