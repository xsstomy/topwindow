## Why
The TopWindow website currently has redundant navigation elements where users can return to the homepage through both the main navigation header and "Back to TopWindow" links on feature pages. This creates confusion and clutter in the user interface.

## What Changes
- Remove all "Back to TopWindow" links from feature sub-pages
- Keep the main navigation header with complete navigation menu (Home, Features, Pricing, Download, Docs, FAQ)
- Maintain consistent user experience through primary navigation only

## Impact
- **Affected specs**: UI Navigation patterns
- **Affected code**:
  - `src/app/features/page.tsx`
  - `src/app/features/always-on-top/page.tsx`
  - `src/app/features/hotkeys/page.tsx`
  - `src/app/features/lightweight/page.tsx`
  - `src/app/features/screencapturekit/page.tsx`
  - `src/app/top-windows/page.tsx`
- **User experience**: Cleaner interface with single, clear navigation path
- **Maintainability**: Reduced code complexity and fewer navigation elements to manage