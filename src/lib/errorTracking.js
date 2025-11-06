/**
 * Error Tracking Service
 * Captures and logs all console errors, warnings, and unhandled exceptions
 */

class ErrorTracker {
  constructor() {
    this.errors = [];
    this.maxErrors = 100; // Keep last 100 errors
    this.listeners = [];
    this.initialize();
  }

  initialize() {
    // Override console.error
    const originalError = console.error;
    console.error = (...args) => {
      this.logError('console.error', args);
      originalError.apply(console, args);
    };

    // Override console.warn
    const originalWarn = console.warn;
    console.warn = (...args) => {
      this.logError('console.warn', args);
      originalWarn.apply(console, args);
    };

    // Capture unhandled promise rejections
    window.addEventListener('unhandledrejection', (event) => {
      this.logError('unhandledrejection', [event.reason], {
        promise: event.promise,
      });
    });

    // Capture global errors
    window.addEventListener('error', (event) => {
      this.logError('window.error', [event.error || event.message], {
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    console.log('🔍 Error tracking initialized');
  }

  logError(type, args, metadata = {}) {
    const error = {
      id: Date.now() + Math.random(),
      type,
      timestamp: new Date().toISOString(),
      message: this.formatMessage(args),
      stack: this.getStackTrace(args),
      metadata,
      url: window.location.href,
      userAgent: navigator.userAgent,
    };

    // Add to errors array
    this.errors.unshift(error);
    
    // Keep only max errors
    if (this.errors.length > this.maxErrors) {
      this.errors.pop();
    }

    // Store in localStorage
    this.saveToStorage();

    // Notify listeners
    this.notifyListeners(error);

    // Send to backend (optional)
    this.sendToBackend(error);
  }

  formatMessage(args) {
    return args
      .map((arg) => {
        if (typeof arg === 'object') {
          try {
            return JSON.stringify(arg, null, 2);
          } catch {
            return String(arg);
          }
        }
        return String(arg);
      })
      .join(' ');
  }

  getStackTrace(args) {
    for (const arg of args) {
      if (arg instanceof Error && arg.stack) {
        return arg.stack;
      }
    }
    
    // Try to get current stack
    try {
      throw new Error();
    } catch (e) {
      return e.stack;
    }
  }

  saveToStorage() {
    try {
      localStorage.setItem('errorTracking', JSON.stringify({
        errors: this.errors.slice(0, 50), // Store only last 50
        lastUpdated: new Date().toISOString(),
      }));
    } catch (e) {
      // Storage might be full
      console.warn('Failed to save errors to localStorage:', e);
    }
  }

  loadFromStorage() {
    try {
      const data = localStorage.getItem('errorTracking');
      if (data) {
        const parsed = JSON.parse(data);
        this.errors = parsed.errors || [];
        return this.errors;
      }
    } catch (e) {
      console.warn('Failed to load errors from localStorage:', e);
    }
    return [];
  }

  sendToBackend() {
    // Optional: Send to your backend API
    // Uncomment and configure when needed
    /*
    fetch('/api/errors', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(error),
    }).catch(err => {
      // Silently fail to avoid infinite loop
    });
    */
  }

  subscribe(callback) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter(cb => cb !== callback);
    };
  }

  notifyListeners(error) {
    this.listeners.forEach(callback => {
      try {
        callback(error);
      } catch {
        // Prevent callback errors from breaking the tracker
      }
    });
  }

  getErrors(filter = {}) {
    let filtered = [...this.errors];

    if (filter.type) {
      filtered = filtered.filter(e => e.type === filter.type);
    }

    if (filter.since) {
      const since = new Date(filter.since);
      filtered = filtered.filter(e => new Date(e.timestamp) >= since);
    }

    return filtered;
  }

  clearErrors() {
    this.errors = [];
    this.saveToStorage();
  }

  getErrorStats() {
    const stats = {
      total: this.errors.length,
      byType: {},
      last24Hours: 0,
      lastHour: 0,
    };

    const now = Date.now();
    const hour = 60 * 60 * 1000;
    const day = 24 * hour;

    this.errors.forEach(error => {
      // Count by type
      stats.byType[error.type] = (stats.byType[error.type] || 0) + 1;

      // Count by time
      const errorTime = new Date(error.timestamp).getTime();
      if (now - errorTime < hour) {
        stats.lastHour++;
      }
      if (now - errorTime < day) {
        stats.last24Hours++;
      }
    });

    return stats;
  }
}

// Create singleton instance
const errorTracker = new ErrorTracker();

// Load previous errors
errorTracker.loadFromStorage();

export default errorTracker;
