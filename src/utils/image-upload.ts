/**
 * Image Upload and Compression Utilities
 * Issue 3: Photo upload with base64 conversion, compression, and management
 */

import imageCompression from 'browser-image-compression';
import type { PropertyPhoto } from '../types';

const MAX_PHOTOS = 10;
const MAX_FILE_SIZE_MB = 2;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

/**
 * Compress and convert image to base64
 */
export async function compressAndConvertImage(file: File): Promise<string> {
  // Validate file type
  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  // Validate file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    throw new Error(`Image size must not exceed ${MAX_FILE_SIZE_MB}MB`);
  }

  try {
    // Compression options
    const options = {
      maxSizeMB: 0.5, // Compress to max 500KB
      maxWidthOrHeight: 1920, // Max dimension
      useWebWorker: true,
      fileType: 'image/jpeg',
    };

    // Compress the image
    const compressedFile = await imageCompression(file, options);

    // Convert to base64
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          resolve(reader.result);
        } else {
          reject(new Error('Failed to convert image to base64'));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(compressedFile);
    });
  } catch (error) {
    console.error('[Image Compression Error]', error);
    throw new Error('Failed to compress image. Please try a different image.');
  }
}

/**
 * Handle multiple file selection
 */
export async function handleMultipleFiles(
  files: FileList,
  existingPhotos: PropertyPhoto[] = []
): Promise<{ photos: PropertyPhoto[]; errors: string[] }> {
  const errors: string[] = [];
  const newPhotos: PropertyPhoto[] = [];

  // Check total count
  if (existingPhotos.length + files.length > MAX_PHOTOS) {
    errors.push(`Maximum ${MAX_PHOTOS} photos allowed. You can upload ${MAX_PHOTOS - existingPhotos.length} more.`);
    return { photos: existingPhotos, errors };
  }

  // Process each file
  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const base64 = await compressAndConvertImage(file);
      newPhotos.push({
        data: base64,
        caption: '',
        order: existingPhotos.length + newPhotos.length,
      });
    } catch (error) {
      errors.push(`Failed to upload ${file.name}: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return {
    photos: [...existingPhotos, ...newPhotos],
    errors,
  };
}

/**
 * Delete photo from array
 */
export function deletePhoto(photos: PropertyPhoto[], index: number): PropertyPhoto[] {
  const updatedPhotos = photos.filter((_, i) => i !== index);
  // Reorder remaining photos
  return updatedPhotos.map((photo, i) => ({ ...photo, order: i }));
}

/**
 * Update photo caption
 */
export function updatePhotoCaption(
  photos: PropertyPhoto[],
  index: number,
  caption: string
): PropertyPhoto[] {
  return photos.map((photo, i) =>
    i === index ? { ...photo, caption } : photo
  );
}

/**
 * Reorder photos (drag and drop)
 */
export function reorderPhotos(
  photos: PropertyPhoto[],
  fromIndex: number,
  toIndex: number
): PropertyPhoto[] {
  const result = [...photos];
  const [removed] = result.splice(fromIndex, 1);
  result.splice(toIndex, 0, removed);
  // Update order property
  return result.map((photo, i) => ({ ...photo, order: i }));
}

/**
 * Move photo up in order
 */
export function movePhotoUp(photos: PropertyPhoto[], index: number): PropertyPhoto[] {
  if (index === 0) return photos;
  return reorderPhotos(photos, index, index - 1);
}

/**
 * Move photo down in order
 */
export function movePhotoDown(photos: PropertyPhoto[], index: number): PropertyPhoto[] {
  if (index === photos.length - 1) return photos;
  return reorderPhotos(photos, index, index + 1);
}

/**
 * Create image preview element
 */
export function createImagePreview(
  photo: PropertyPhoto,
  index: number,
  onDelete: (index: number) => void,
  onCaptionChange: (index: number, caption: string) => void,
  onMoveUp: (index: number) => void,
  onMoveDown: (index: number) => void,
  isFirst: boolean,
  isLast: boolean
): HTMLElement {
  const container = document.createElement('div');
  container.className = 'photo-preview-item';
  container.setAttribute('data-index', index.toString());
  container.setAttribute('draggable', 'true');

  container.innerHTML = `
    <div class="photo-preview-image-wrapper">
      <img src="${photo.data}" alt="Property photo ${index + 1}" class="photo-preview-image" loading="lazy">
      <div class="photo-preview-controls">
        <button type="button" class="btn-icon" data-action="move-up" ${isFirst ? 'disabled' : ''} 
                aria-label="Move photo up" title="Move up">
          ↑
        </button>
        <button type="button" class="btn-icon" data-action="move-down" ${isLast ? 'disabled' : ''}
                aria-label="Move photo down" title="Move down">
          ↓
        </button>
        <button type="button" class="btn-icon btn-danger" data-action="delete"
                aria-label="Delete photo" title="Delete">
          ×
        </button>
      </div>
    </div>
    <input 
      type="text" 
      class="photo-caption-input" 
      placeholder="Add caption (optional)" 
      value="${photo.caption || ''}"
      maxlength="200"
      aria-label="Photo caption"
    />
    <div class="photo-preview-order">Photo ${index + 1}</div>
  `;

  // Add event listeners
  const deleteBtn = container.querySelector('[data-action="delete"]');
  const moveUpBtn = container.querySelector('[data-action="move-up"]');
  const moveDownBtn = container.querySelector('[data-action="move-down"]');
  const captionInput = container.querySelector('.photo-caption-input') as HTMLInputElement;

  deleteBtn?.addEventListener('click', () => onDelete(index));
  moveUpBtn?.addEventListener('click', () => onMoveUp(index));
  moveDownBtn?.addEventListener('click', () => onMoveDown(index));
  captionInput?.addEventListener('input', (e) => 
    onCaptionChange(index, (e.target as HTMLInputElement).value)
  );

  return container;
}

/**
 * Get file size estimate for base64 string
 */
export function getBase64Size(base64String: string): number {
  // Remove data:image prefix
  const base64Data = base64String.split(',')[1] || base64String;
  // Calculate size (base64 is ~33% larger than binary)
  return Math.ceil((base64Data.length * 3) / 4);
}

/**
 * Format file size for display
 */
export function formatImageFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${Math.round((bytes / Math.pow(k, i)) * 100) / 100} ${sizes[i]}`;
}

/**
 * Validate image before upload
 */
export function validateImage(file: File): { valid: boolean; error?: string } {
  // Check file type
  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  // Check file size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return {
      valid: false,
      error: `Image size must not exceed ${MAX_FILE_SIZE_MB}MB. Current size: ${formatImageFileSize(file.size)}`,
    };
  }

  return { valid: true };
}

/**
 * Setup drag and drop for photo reordering
 */
export function setupPhotoDragAndDrop(
  container: HTMLElement,
  onReorder: (fromIndex: number, toIndex: number) => void
): void {
  let draggedElement: HTMLElement | null = null;
  let draggedIndex: number | null = null;

  container.addEventListener('dragstart', (e) => {
    if ((e.target as HTMLElement).classList.contains('photo-preview-item')) {
      draggedElement = e.target as HTMLElement;
      draggedIndex = parseInt(draggedElement.getAttribute('data-index') || '0');
      draggedElement.style.opacity = '0.5';
    }
  });

  container.addEventListener('dragend', (e) => {
    if ((e.target as HTMLElement).classList.contains('photo-preview-item')) {
      (e.target as HTMLElement).style.opacity = '1';
    }
  });

  container.addEventListener('dragover', (e) => {
    e.preventDefault();
  });

  container.addEventListener('drop', (e) => {
    e.preventDefault();
    const dropTarget = (e.target as HTMLElement).closest('.photo-preview-item') as HTMLElement;
    if (dropTarget && draggedElement && draggedIndex !== null) {
      const dropIndex = parseInt(dropTarget.getAttribute('data-index') || '0');
      if (draggedIndex !== dropIndex) {
        onReorder(draggedIndex, dropIndex);
      }
    }
    draggedElement = null;
    draggedIndex = null;
  });
}
