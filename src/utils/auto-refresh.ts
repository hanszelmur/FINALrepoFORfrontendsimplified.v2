/**
 * Optimized Auto-Refresh (Issue 4)
 * Only refresh when page is visible, manual refresh button, show last refresh time
 */

export interface AutoRefreshOptions {
  interval: number; // in milliseconds
  onRefresh: () => Promise<void> | void;
  onError?: (error: Error) => void;
  enabled?: boolean;
}

export class AutoRefresh {
  private interval: number;
  private onRefresh: () => Promise<void> | void;
  private onError?: (error: Error) => void;
  private enabled: boolean;
  private timerId: number | null = null;
  private lastRefreshTime: Date | null = null;
  private isRefreshing: boolean = false;

  constructor(options: AutoRefreshOptions) {
    this.interval = options.interval;
    this.onRefresh = options.onRefresh;
    this.onError = options.onError;
    this.enabled = options.enabled !== false;

    this.setupVisibilityListener();
  }

  /**
   * Setup Page Visibility API listener
   */
  private setupVisibilityListener(): void {
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.pause();
      } else {
        this.resume();
      }
    });
  }

  /**
   * Start auto-refresh
   */
  start(): void {
    if (!this.enabled) return;

    this.stop(); // Clear any existing timer
    
    this.timerId = window.setInterval(() => {
      if (!document.hidden) {
        this.refresh();
      }
    }, this.interval);
  }

  /**
   * Stop auto-refresh
   */
  stop(): void {
    if (this.timerId !== null) {
      clearInterval(this.timerId);
      this.timerId = null;
    }
  }

  /**
   * Pause auto-refresh (can be resumed)
   */
  pause(): void {
    this.stop();
  }

  /**
   * Resume auto-refresh
   */
  resume(): void {
    if (this.enabled) {
      this.start();
    }
  }

  /**
   * Manual refresh
   */
  async refresh(): Promise<void> {
    if (this.isRefreshing) {
      return; // Prevent concurrent refreshes
    }

    try {
      this.isRefreshing = true;
      await this.onRefresh();
      this.lastRefreshTime = new Date();
    } catch (error) {
      console.error('[Auto-Refresh] Error during refresh:', error);
      if (this.onError) {
        this.onError(error as Error);
      }
    } finally {
      this.isRefreshing = false;
    }
  }

  /**
   * Get last refresh time
   */
  getLastRefreshTime(): Date | null {
    return this.lastRefreshTime;
  }

  /**
   * Get last refresh time as formatted string
   */
  getLastRefreshTimeString(): string {
    if (!this.lastRefreshTime) {
      return 'Never';
    }

    const now = new Date();
    const diff = now.getTime() - this.lastRefreshTime.getTime();
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);

    if (seconds < 60) {
      return `${seconds} second${seconds !== 1 ? 's' : ''} ago`;
    } else if (minutes < 60) {
      return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`;
    } else if (hours < 24) {
      return `${hours} hour${hours !== 1 ? 's' : ''} ago`;
    } else {
      return this.lastRefreshTime.toLocaleString('en-PH', {
        timeZone: 'Asia/Manila',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    }
  }

  /**
   * Check if currently refreshing
   */
  isCurrentlyRefreshing(): boolean {
    return this.isRefreshing;
  }

  /**
   * Enable auto-refresh
   */
  enable(): void {
    this.enabled = true;
    this.start();
  }

  /**
   * Disable auto-refresh
   */
  disable(): void {
    this.enabled = false;
    this.stop();
  }

  /**
   * Check if auto-refresh is enabled
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * Update refresh interval
   */
  setInterval(interval: number): void {
    this.interval = interval;
    if (this.enabled) {
      this.start(); // Restart with new interval
    }
  }

  /**
   * Cleanup - call this when component unmounts (Issue 16 - Memory Leaks)
   */
  cleanup(): void {
    this.stop();
    document.removeEventListener('visibilitychange', this.setupVisibilityListener);
  }
}

/**
 * Create auto-refresh for Alpine.js component
 */
export function createAutoRefreshState(
  refreshFunction: () => Promise<void>,
  interval: number = 30000 // 30 seconds
) {
  let autoRefresh: AutoRefresh | null = null;

  return {
    lastRefreshTime: null as string | null,
    isRefreshing: false,

    init() {
      autoRefresh = new AutoRefresh({
        interval,
        onRefresh: async () => {
          this.isRefreshing = true;
          try {
            await refreshFunction();
            this.lastRefreshTime = autoRefresh?.getLastRefreshTimeString() || null;
          } finally {
            this.isRefreshing = false;
          }
        },
        enabled: true,
      });
      autoRefresh.start();
    },

    async manualRefresh() {
      if (autoRefresh && !this.isRefreshing) {
        await autoRefresh.refresh();
        this.lastRefreshTime = autoRefresh.getLastRefreshTimeString();
      }
    },

    destroy() {
      if (autoRefresh) {
        autoRefresh.cleanup();
        autoRefresh = null;
      }
    },
  };
}

/**
 * Setup cleanup on page unload (Issue 16 - Memory Leaks)
 */
export function setupAutoRefreshCleanup(autoRefresh: AutoRefresh): void {
  window.addEventListener('beforeunload', () => {
    autoRefresh.cleanup();
  });
}
