# PWA Icons Generation

This directory should contain the following icon files for the Progressive Web App (PWA):

## Required Icons

Generate these icons from your logo or brand image:

- `icon-72x72.png` (72x72 pixels)
- `icon-96x96.png` (96x96 pixels)
- `icon-128x128.png` (128x128 pixels)
- `icon-144x144.png` (144x144 pixels)
- `icon-152x152.png` (152x152 pixels)
- `icon-192x192.png` (192x192 pixels)
- `icon-384x384.png` (384x384 pixels)
- `icon-512x512.png` (512x512 pixels)

## Optional Files

- `screenshot-wide.png` (1280x720 pixels) - Desktop screenshot
- `screenshot-narrow.png` (750x1334 pixels) - Mobile screenshot
- `placeholder.png` - Fallback image for failed image loads

## Tools for Icon Generation

You can use these tools to generate icons:

1. **PWA Asset Generator**
   ```bash
   npx @vite-pwa/assets-generator --preset minimal public/logo.png
   ```

2. **PWA Builder Image Generator**
   - Visit: https://www.pwabuilder.com/imageGenerator
   - Upload your source image
   - Download the generated icon pack

3. **Favicon Generator**
   - Visit: https://realfavicongenerator.net/
   - Upload your source image
   - Generate icons for all platforms

4. **Manual with ImageMagick**
   ```bash
   convert logo.png -resize 72x72 icon-72x72.png
   convert logo.png -resize 96x96 icon-96x96.png
   convert logo.png -resize 128x128 icon-128x128.png
   convert logo.png -resize 144x144 icon-144x144.png
   convert logo.png -resize 152x152 icon-152x152.png
   convert logo.png -resize 192x192 icon-192x192.png
   convert logo.png -resize 384x384 icon-384x384.png
   convert logo.png -resize 512x512 icon-512x512.png
   ```

## Design Guidelines

- Use a simple, recognizable logo or icon
- Ensure good contrast for visibility
- Use transparent background or solid color
- Test on both light and dark backgrounds
- Make sure the icon is centered in the canvas
- Use square or circular design for best results

## Color Recommendations

Current theme color: `#2563eb` (Blue)
- Use this color or your brand colors
- Ensure accessibility with sufficient contrast
- Test visibility on various backgrounds
