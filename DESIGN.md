# Design System — Spelling Bee Quest

## Color Palette
- Primary: Honey Gold #F5C518
- Secondary: Bee Amber #FF8C00
- Background: Warm Cream #FFF8E7
- Dark Accent: Hive Brown #3D2B1F
- Success: Garden Green #4CAF50
- Info: Sky Blue #64B5F6
- Alert: Coral Red #FF5252
- Text Primary: #1A1A1A
- Text on Dark: #FFFFFF
- Board BG: #E8D5A3
- Tile BG: #F7E87C
- Bonus DW: #FFB3C6
- Bonus TL: #80CBC4
- Bonus HoneyPot: #FFD700

## Typography
- Headings: Fredoka One — rounded, playful, large titles
- UI Labels: Nunito Bold — clean and friendly
- Body: Nunito Regular
- Score/Numbers: Bebas Neue — bold game-feel numerics
- Letter Tiles: Fredoka One, large centered, with small subscript point value

## Visual Theme
- Bee mascot character: round, expressive, with idle float animation
- Honeycomb hex pattern as decorative background element
- Honey drip effects on score reveals
- Garden world illustrations (flowers, leaves) for world map backgrounds
- Hive architecture for UI frames and borders
- Warm gradient backgrounds per world (meadow green, twilight purple, ocean blue, etc.)

## UI Components
- Letter Tiles: 52x52px rounded squares (12px radius), honey-yellow gradient (#F7E87C → #E8C84A), embossed letter + small point value bottom-right, soft amber shadow
- Board Grid: Cream background (#E8D5A3), 2px honey-amber grid lines, bonus cells color-coded
- Buttons: Pill-shaped (28px radius), gradient fills, 3px bottom border for depth, min-height 48px
- Primary Button: Gold gradient (#F5C518 → #FF8C00), dark brown text
- Cards: 16px border-radius, white/cream fill, 8px warm shadow
- Progress Bars: Honey-fill left-to-right animation, rounded ends
- Modal: Frosted glass overlay (rgba white 0.95), warm amber border, 24px shadow
- Nav Bar: Hive-brown (#3D2B1F) background, gold active indicator
- Quest Cards: Illustrated header, progress bar, coin reward badge

## Animations
- Tile placement: 80ms snap + 120ms subtle bounce (cubic-bezier)
- Word submit success: 300ms glow ripple on tiles + coin burst particle effect (20 coins)
- Invalid word: 200ms shake animation on tiles, red flash
- Level up: Full-screen celebration overlay, confetti particles, bee dance loop
- Quest complete: Trophy scale-in (spring) + gold shimmer sweep
- Bee idle: 3s gentle float up/down (ease-in-out), slight wing flutter
- Coin collect: Arc trajectory from board to coin counter, scale pop on counter
- Chest open: Lid bounce animation, item reveal with sparkle
- World unlock: Zoom-in reveal with particle burst

## Elevation & Spacing
- Tiles in hand: 4px shadow, amber tint (rgba 255,140,0,0.3)
- Placed tiles: 2px inset shadow (pressed feel)
- Cards: box-shadow 0 4px 16px rgba(61,43,31,0.12)
- Modals: box-shadow 0 12px 48px rgba(0,0,0,0.24)
- Spacing unit: 8px base grid
- Board cell: 44px × 44px (desktop), 32px × 32px (mobile)

## Responsive Layout
- Mobile (360-767px): Single column, compact board, bottom nav, swipe gestures
- Tablet (768-1279px): Two-column layouts, larger board
- Desktop (1280px+): Full layout, sidebar navigation, large board view
- Touch targets: minimum 44×44px
- Board scrollable/zoomable on mobile