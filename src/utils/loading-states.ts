/**
 * Loading States (Issue 10)
 * Spinners on buttons, skeleton loaders, prepare for async operations
 */

/**
 * Add loading state to button
 */
export function setButtonLoading(
  button: HTMLButtonElement,
  loading: boolean,
  loadingText: string = 'Loading...'
): void {
  if (loading) {
    button.disabled = true;
    button.dataset.originalText = button.textContent || '';
    button.innerHTML = `
      <svg class="spinner" width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="8" cy="8" r="7" stroke="currentColor" stroke-width="2" stroke-dasharray="40" stroke-dashoffset="10" />
      </svg>
      <span>${loadingText}</span>
    `;
    button.classList.add('loading');
  } else {
    button.disabled = false;
    button.textContent = button.dataset.originalText || 'Submit';
    button.classList.remove('loading');
    delete button.dataset.originalText;
  }
}

/**
 * Show skeleton loader
 */
export function showSkeletonLoader(container: HTMLElement): void {
  const skeletonHTML = `
    <div class="skeleton-loader" role="status" aria-label="Loading content">
      <div class="skeleton-line"></div>
      <div class="skeleton-line"></div>
      <div class="skeleton-line short"></div>
    </div>
  `;
  container.innerHTML = skeletonHTML;
}

/**
 * Show card skeleton loader
 */
export function showCardSkeletonLoader(container: HTMLElement, count: number = 3): void {
  const skeletons = Array.from(
    { length: count },
    () => `
      <div class="skeleton-card">
        <div class="skeleton-image"></div>
        <div class="skeleton-content">
          <div class="skeleton-line"></div>
          <div class="skeleton-line short"></div>
        </div>
      </div>
    `
  ).join('');

  container.innerHTML = `<div class="skeleton-grid">${skeletons}</div>`;
}

/**
 * Show table skeleton loader
 */
export function showTableSkeletonLoader(
  tableBody: HTMLElement,
  rows: number = 5,
  columns: number = 4
): void {
  const rowsHTML = Array.from(
    { length: rows },
    () => `
      <tr class="skeleton-row">
        ${Array.from({ length: columns }, () => '<td><div class="skeleton-line"></div></td>').join('')}
      </tr>
    `
  ).join('');

  tableBody.innerHTML = rowsHTML;
}

/**
 * Create loading overlay
 */
export function showLoadingOverlay(message: string = 'Loading...'): HTMLElement {
  const overlay = document.createElement('div');
  overlay.className = 'loading-overlay';
  overlay.setAttribute('role', 'status');
  overlay.setAttribute('aria-live', 'polite');
  overlay.innerHTML = `
    <div class="loading-content">
      <svg class="spinner large" width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="20" stroke="currentColor" stroke-width="4" stroke-dasharray="120" stroke-dashoffset="30" />
      </svg>
      <p class="loading-message">${message}</p>
    </div>
  `;

  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Hide loading overlay
 */
export function hideLoadingOverlay(overlay: HTMLElement): void {
  if (overlay && overlay.parentNode) {
    overlay.parentNode.removeChild(overlay);
  }
}

/**
 * Async operation with loading state
 */
export async function withLoading<T>(
  operation: () => Promise<T>,
  options: {
    button?: HTMLButtonElement;
    loadingText?: string;
    overlay?: boolean;
    overlayMessage?: string;
  } = {}
): Promise<T> {
  const { button, loadingText, overlay, overlayMessage } = options;

  let overlayElement: HTMLElement | null = null;

  try {
    if (button) {
      setButtonLoading(button, true, loadingText);
    }

    if (overlay) {
      overlayElement = showLoadingOverlay(overlayMessage);
    }

    const result = await operation();
    return result;
  } finally {
    if (button) {
      setButtonLoading(button, false);
    }

    if (overlayElement) {
      hideLoadingOverlay(overlayElement);
    }
  }
}

/**
 * Create Alpine.js loading state
 */
export function createLoadingState() {
  return {
    isLoading: false,
    loadingMessage: 'Loading...',

    startLoading(message: string = 'Loading...') {
      this.isLoading = true;
      this.loadingMessage = message;
    },

    stopLoading() {
      this.isLoading = false;
    },

    async withLoading<T>(operation: () => Promise<T>, message?: string): Promise<T> {
      this.startLoading(message);
      try {
        return await operation();
      } finally {
        this.stopLoading();
      }
    },
  };
}

/**
 * Progress bar for long operations
 */
export class ProgressBar {
  private element: HTMLElement;
  private progressBar: HTMLElement;
  private progressText: HTMLElement;

  constructor(container: HTMLElement) {
    this.element = document.createElement('div');
    this.element.className = 'progress-bar-container';
    this.element.setAttribute('role', 'progressbar');
    this.element.setAttribute('aria-valuemin', '0');
    this.element.setAttribute('aria-valuemax', '100');

    this.element.innerHTML = `
      <div class="progress-bar">
        <div class="progress-fill"></div>
      </div>
      <div class="progress-text">0%</div>
    `;

    this.progressBar = this.element.querySelector('.progress-fill') as HTMLElement;
    this.progressText = this.element.querySelector('.progress-text') as HTMLElement;

    container.appendChild(this.element);
  }

  setProgress(percentage: number, text?: string): void {
    const progress = Math.max(0, Math.min(100, percentage));
    this.progressBar.style.width = `${progress}%`;
    this.element.setAttribute('aria-valuenow', progress.toString());

    if (text) {
      this.progressText.textContent = text;
    } else {
      this.progressText.textContent = `${Math.round(progress)}%`;
    }
  }

  complete(): void {
    this.setProgress(100, 'Complete!');
    setTimeout(() => {
      this.remove();
    }, 1000);
  }

  remove(): void {
    if (this.element.parentNode) {
      this.element.parentNode.removeChild(this.element);
    }
  }
}

/**
 * Debounce loading state updates
 */
export function debounceLoading<T extends (...args: any[]) => any>(
  func: T,
  delay: number = 300
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  return (...args: Parameters<T>) => {
    if (timeoutId !== null) {
      clearTimeout(timeoutId);
    }

    timeoutId = setTimeout(() => {
      func(...args);
      timeoutId = null;
    }, delay);
  };
}
