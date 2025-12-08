/**
 * UI Helper Functions
 * Common UI utilities for all pages
 */

import { sanitizeInput } from './error-handler';
import type { PropertyPhoto } from '../types';
import {
  createImagePreview,
  deletePhoto,
  updatePhotoCaption,
  movePhotoUp,
  movePhotoDown,
  handleMultipleFiles,
} from './image-upload';

/**
 * Render photo upload UI
 * Issue 3: Complete photo upload implementation
 */
export function renderPhotoUploadUI(
  containerId: string,
  photos: PropertyPhoto[],
  onPhotosChange: (photos: PropertyPhoto[]) => void,
  maxPhotos: number = 10
): void {
  const container = document.getElementById(containerId);
  if (!container) return;

  // Create upload section
  const uploadSection = document.createElement('div');
  uploadSection.className = 'photo-upload-section';
  uploadSection.innerHTML = `
    <div class="form-group">
      <label class="form-label">
        Property Photos (${photos.length}/${maxPhotos})
        <span class="text-sm text-gray-500 ml-2">Max 10 photos, 2MB each</span>
      </label>
      <input 
        type="file" 
        id="photoInput" 
        accept="image/*" 
        multiple 
        class="hidden" 
        ${photos.length >= maxPhotos ? 'disabled' : ''}
      />
      <button 
        type="button" 
        id="selectPhotosBtn" 
        class="btn btn-secondary touch-target"
        ${photos.length >= maxPhotos ? 'disabled' : ''}
        aria-label="Select photos to upload">
        <span>📷 Select Photos</span>
      </button>
      <p class="text-sm text-gray-500 mt-2" id="uploadHint" role="status" aria-live="polite">
        Click to select up to ${maxPhotos - photos.length} more photo(s)
      </p>
    </div>
    <div id="photoPreviewContainer" class="photo-preview-container"></div>
  `;

  container.innerHTML = '';
  container.appendChild(uploadSection);

  // Get elements
  const photoInput = document.getElementById('photoInput') as HTMLInputElement;
  const selectPhotosBtn = document.getElementById('selectPhotosBtn');
  const photoPreviewContainer = document.getElementById('photoPreviewContainer');
  const uploadHint = document.getElementById('uploadHint');

  // Handle button click
  selectPhotosBtn?.addEventListener('click', () => {
    photoInput?.click();
  });

  // Handle file selection
  photoInput?.addEventListener('change', async (e) => {
    const files = (e.target as HTMLInputElement).files;
    if (!files || files.length === 0) return;

    // Show loading
    if (selectPhotosBtn) {
      selectPhotosBtn.textContent = 'Uploading...';
      selectPhotosBtn.setAttribute('disabled', 'true');
    }

    try {
      const result = await handleMultipleFiles(files, photos);
      
      // Show errors if any
      if (result.errors.length > 0) {
        alert('Upload errors:\n' + result.errors.join('\n'));
      }

      // Update photos
      onPhotosChange(result.photos);
      renderPhotoPreviews(result.photos);

      // Reset input
      photoInput.value = '';
    } catch (error) {
      console.error('[Photo Upload] Error:', error);
      alert('Failed to upload photos. Please try again.');
    } finally {
      // Restore button
      if (selectPhotosBtn) {
        selectPhotosBtn.textContent = '📷 Select Photos';
        if (photos.length < maxPhotos) {
          selectPhotosBtn.removeAttribute('disabled');
        }
      }
    }
  });

  // Render existing photos
  function renderPhotoPreviews(currentPhotos: PropertyPhoto[]): void {
    if (!photoPreviewContainer) return;

    photoPreviewContainer.innerHTML = '';

    if (currentPhotos.length === 0) {
      photoPreviewContainer.innerHTML = `
        <p class="text-gray-500 text-center py-8 col-span-full">
          No photos added yet. Click "Select Photos" to add property images.
        </p>
      `;
      return;
    }

    currentPhotos.forEach((photo, index) => {
      const preview = createImagePreview(
        photo,
        index,
        // onDelete
        (idx) => {
          const updatedPhotos = deletePhoto(currentPhotos, idx);
          onPhotosChange(updatedPhotos);
          renderPhotoPreviews(updatedPhotos);
          
          // Update button state
          if (selectPhotosBtn && updatedPhotos.length < maxPhotos) {
            selectPhotosBtn.removeAttribute('disabled');
          }
          
          // Update hint
          if (uploadHint) {
            uploadHint.textContent = `Click to select up to ${maxPhotos - updatedPhotos.length} more photo(s)`;
          }
        },
        // onCaptionChange
        (idx, caption) => {
          const updatedPhotos = updatePhotoCaption(currentPhotos, idx, sanitizeInput(caption));
          onPhotosChange(updatedPhotos);
        },
        // onMoveUp
        (idx) => {
          const updatedPhotos = movePhotoUp(currentPhotos, idx);
          onPhotosChange(updatedPhotos);
          renderPhotoPreviews(updatedPhotos);
        },
        // onMoveDown
        (idx) => {
          const updatedPhotos = movePhotoDown(currentPhotos, idx);
          onPhotosChange(updatedPhotos);
          renderPhotoPreviews(updatedPhotos);
        },
        index === 0,
        index === currentPhotos.length - 1
      );

      photoPreviewContainer.appendChild(preview);
    });

    // Update button state
    if (selectPhotosBtn) {
      if (currentPhotos.length >= maxPhotos) {
        selectPhotosBtn.setAttribute('disabled', 'true');
      } else {
        selectPhotosBtn.removeAttribute('disabled');
      }
    }

    // Update hint
    if (uploadHint) {
      if (currentPhotos.length >= maxPhotos) {
        uploadHint.textContent = 'Maximum number of photos reached';
      } else {
        uploadHint.textContent = `Click to select up to ${maxPhotos - currentPhotos.length} more photo(s)`;
      }
    }
  }

  // Initial render
  renderPhotoPreviews(photos);
}

/**
 * Show loading button state
 * Issue 10: Loading states
 */
export function setButtonLoading(button: HTMLButtonElement, loading: boolean): void {
  if (loading) {
    button.classList.add('btn-loading');
    button.setAttribute('disabled', 'true');
    button.setAttribute('aria-busy', 'true');
  } else {
    button.classList.remove('btn-loading');
    button.removeAttribute('disabled');
    button.setAttribute('aria-busy', 'false');
  }
}

/**
 * Create loading overlay
 */
export function showLoadingOverlay(message: string = 'Processing...'): HTMLElement {
  const overlay = document.createElement('div');
  overlay.id = 'loadingOverlay';
  overlay.className = 'loading-overlay';
  overlay.setAttribute('role', 'alert');
  overlay.setAttribute('aria-live', 'assertive');
  overlay.innerHTML = `
    <div class="text-center">
      <div class="loading-spinner"></div>
      <p class="text-white mt-4 text-lg">${sanitizeInput(message)}</p>
    </div>
  `;
  document.body.appendChild(overlay);
  return overlay;
}

/**
 * Hide loading overlay
 */
export function hideLoadingOverlay(): void {
  const overlay = document.getElementById('loadingOverlay');
  if (overlay) {
    overlay.remove();
  }
}

/**
 * Confirm dialog with custom message
 */
export function confirmDialog(message: string, onConfirm: () => void, onCancel?: () => void): void {
  if (confirm(message)) {
    onConfirm();
  } else if (onCancel) {
    onCancel();
  }
}

/**
 * Debounce function for search/filter inputs
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;

  return function (...args: Parameters<T>) {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Scroll to element smoothly
 */
export function scrollToElement(elementId: string, offset: number = 0): void {
  const element = document.getElementById(elementId);
  if (element) {
    const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  }
}

/**
 * Copy text to clipboard
 */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    console.error('[Clipboard] Failed to copy:', error);
    return false;
  }
}

/**
 * Format currency input as user types
 */
export function formatCurrencyInput(input: HTMLInputElement): void {
  input.addEventListener('input', (e) => {
    const target = e.target as HTMLInputElement;
    let value = target.value.replace(/[^0-9]/g, '');
    if (value) {
      value = parseInt(value, 10).toLocaleString('en-PH');
    }
    target.value = value;
  });
}

/**
 * Toggle password visibility
 */
export function setupPasswordToggle(inputId: string, toggleBtnId: string): void {
  const input = document.getElementById(inputId) as HTMLInputElement;
  const toggleBtn = document.getElementById(toggleBtnId);

  if (!input || !toggleBtn) return;

  toggleBtn.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    toggleBtn.textContent = isPassword ? '🙈' : '👁️';
    toggleBtn.setAttribute('aria-label', isPassword ? 'Hide password' : 'Show password');
  });
}
