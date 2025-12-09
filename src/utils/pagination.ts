/**
 * Pagination (Issue 17)
 * 20 items per page with smooth navigation
 */

export interface PaginationOptions {
  currentPage: number;
  perPage: number;
  totalItems: number;
}

export interface PaginationResult<T> {
  items: T[];
  pagination: {
    currentPage: number;
    perPage: number;
    totalItems: number;
    totalPages: number;
    hasNext: boolean;
    hasPrevious: boolean;
    startIndex: number;
    endIndex: number;
  };
}

/**
 * Paginate array of items
 */
export function paginate<T>(
  items: T[],
  currentPage: number = 1,
  perPage: number = 20
): PaginationResult<T> {
  // Ensure valid page number
  const page = Math.max(1, currentPage);
  const itemsPerPage = Math.max(1, Math.min(100, perPage));

  const totalPages = Math.ceil(items.length / itemsPerPage);
  const validPage = Math.min(page, Math.max(1, totalPages));

  const startIndex = (validPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, items.length);

  const paginatedItems = items.slice(startIndex, endIndex);

  return {
    items: paginatedItems,
    pagination: {
      currentPage: validPage,
      perPage: itemsPerPage,
      totalItems: items.length,
      totalPages,
      hasNext: validPage < totalPages,
      hasPrevious: validPage > 1,
      startIndex: startIndex + 1, // 1-indexed for display
      endIndex,
    },
  };
}

/**
 * Get page numbers to display
 * Shows ... for large page counts
 */
export function getPageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisible: number = 7
): (number | 'ellipsis')[] {
  if (totalPages <= maxVisible) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  const pages: (number | 'ellipsis')[] = [];
  const halfVisible = Math.floor((maxVisible - 3) / 2); // -3 for first, last, and one ellipsis

  // Always show first page
  pages.push(1);

  if (currentPage <= halfVisible + 2) {
    // Near start
    for (let i = 2; i <= Math.min(maxVisible - 2, totalPages - 1); i++) {
      pages.push(i);
    }
    if (totalPages > maxVisible - 1) {
      pages.push('ellipsis');
    }
  } else if (currentPage >= totalPages - halfVisible - 1) {
    // Near end
    pages.push('ellipsis');
    for (let i = Math.max(2, totalPages - maxVisible + 3); i < totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Middle
    pages.push('ellipsis');
    for (let i = currentPage - halfVisible; i <= currentPage + halfVisible; i++) {
      pages.push(i);
    }
    pages.push('ellipsis');
  }

  // Always show last page
  if (totalPages > 1) {
    pages.push(totalPages);
  }

  return pages;
}

/**
 * Generate pagination summary text
 */
export function getPaginationSummary(pagination: PaginationResult<any>['pagination']): string {
  if (pagination.totalItems === 0) {
    return 'No items found';
  }

  if (pagination.totalItems === 1) {
    return 'Showing 1 item';
  }

  return `Showing ${pagination.startIndex}-${pagination.endIndex} of ${pagination.totalItems} items`;
}

/**
 * Get offset for database queries (0-indexed)
 */
export function getOffset(page: number, perPage: number): number {
  return (Math.max(1, page) - 1) * perPage;
}

/**
 * Calculate which page a specific index is on
 */
export function getPageForIndex(index: number, perPage: number): number {
  return Math.floor(index / perPage) + 1;
}

/**
 * Scroll to top of results smoothly
 */
export function scrollToTop(selector: string = '#main-content', smooth: boolean = true): void {
  const element = document.querySelector(selector);
  if (element) {
    element.scrollIntoView({
      behavior: smooth ? 'smooth' : 'auto',
      block: 'start',
    });
  } else {
    window.scrollTo({
      top: 0,
      behavior: smooth ? 'smooth' : 'auto',
    });
  }
}

/**
 * Create pagination state manager for Alpine.js
 */
export function createPaginationState(perPage: number = 20) {
  return {
    currentPage: 1,
    perPage,

    reset() {
      this.currentPage = 1;
    },

    nextPage() {
      this.currentPage++;
      scrollToTop();
    },

    previousPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
        scrollToTop();
      }
    },

    goToPage(page: number) {
      this.currentPage = Math.max(1, page);
      scrollToTop();
    },

    getPaginatedItems<T>(items: T[]): PaginationResult<T> {
      return paginate(items, this.currentPage, this.perPage);
    },
  };
}
