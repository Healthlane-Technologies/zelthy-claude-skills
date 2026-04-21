# Configure Theme

## What this does
Sets app colors (primary, secondary, success, warning, error, gray, background, info) and typography (font family, size, line height). Changes take effect immediately on next page load - no rebuild needed.

## Prerequisites
- Inside an app → App Settings → Themes tab

## Navigation
`/platform/apps/{uuid}/app-settings/app-configuration/#themes`

## Steps

### Create new theme
1. Click "+ Add Theme" (top right, purple)
2. Fill color fields: Primary, Secondary, Background, Gray, Success, Warning, Error, Info
3. Set typography: Font Family, Font Size, Line Height
4. Save
5. Set as Active if needed

### Edit existing theme
1. Click pencil icon on the theme card
2. Update colors/typography
3. Save

### Set active theme
1. Click the theme card to set as ACTIVE
2. Verify: "ACTIVE" badge appears on the card

## Color Fields
- Primary: Brand color (generates --color-brand-* palette)
- Secondary: Secondary brand color
- Background: Page background
- Gray: Neutral palette (generates --color-gray-*)
- Success: Positive actions (green)
- Warning: Caution states (amber)
- Error: Danger states (red)
- Info: Informational (blue)

## Typography Fields
- Font Family: e.g., "Inter, sans-serif" or "Open Sans"
- Font Size: Base size, e.g., "14px"
- Line Height: e.g., 1.5 or 1.5715

## Important
- Only base colors needed - the framework auto-generates full shade palettes (25-950)
- Theme changes via panel don't require frontend rebuild
- The App Initializer API serves the active theme automatically
