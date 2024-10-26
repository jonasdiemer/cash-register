# Masterplan: Kids Cash Register App

## 1. Overview

A browser-based single-page application for simulating a cash register, primarily designed for children. The application enables product inventory management, barcode scanning, and receipt creation, without a server backend. The app supports multiple languages (initially German and English).

## 2. Target Audience

- Primary: Children who want to play "store"
- Focus on intuitive, playful operation
- Clear visual and acoustic feedback
- Child-friendly error handling
- Support for German and English speaking users

## 3. Core Features

### 3.1 Inventory Management

- Product management with:
  - Barcode/EAN code
  - Product name (multilingual)
  - Price
  - Stock quantity
- Edit and delete products
- Sorting by name, price, and stock
- Automatic stock updates during sales

### 3.2 Cash Register Process

- Barcode scanning via webcam
  - Live camera preview on screen
  - Configurable scan area with visual overlay
  - Automatic detection with feedback:
    - Sound effect on successful scan
    - Visual highlight/animation on successful scan
  - Configurable camera selection
- Alternative manual entry methods:
  - Keyboard input for barcode/product lookup
  - Touch-friendly search interface
- Quantity input per article
- Payment processing
  - Cash payment options:
    - Calculator-style numeric keypad
    - Preset denomination buttons (€5, €10, €20, €50)
    - Physical keyboard input support
  - Card payment (simulated)
  - Change calculation for cash payments
  - Visual display of:
    - Given amount
    - Change due
    - Running total

### 3.3 Receipt System

- Display and printing of receipts
- Included information:
  - Store name
  - Cashier name
  - Date and time
  - Article list (name, quantity, unit price)
  - Total sum
  - For cash payments: Amount given and change
  - Payment method
- Print-optimized layout (A4)

### 3.4 Settings

- Store information
- Cashier name
- Camera/scan area configuration
- Language selection (German/English)
- Sound effects toggle
- Scanner feedback preferences
  - Sound volume
  - Visual feedback style

## 4. Technical Architecture

### 4.1 Frontend Stack

- **Svelte with TypeScript**
  - Using pnpm as package manager
  - Rationale:
    - Simple, clean code with minimal boilerplate
    - Built-in reactive state management
    - Excellent performance
    - Good TypeScript support
    - Smaller learning curve compared to React

- **State Management**
  - Svelte's built-in stores
  - Rationale:
    - Native to Svelte
    - Simple to use
    - Perfect for our use case
    - Good TypeScript integration

- **UI Framework**
  - Tailwind CSS
  - Rationale:
    - Flexible styling capabilities
    - Good print style support
    - Utility-first approach for rapid development
    - Easy adaptation for child-friendly design

### 4.2 Data Storage

- **IndexedDB with Dexie.js**
  - For inventory data only
  - Rationale:
    - Persistent storage for product data
    - Good performance for larger datasets
    - Supports complex queries

- **localStorage**
  - For settings and UI preferences
  - Simple transaction history
  - Rationale:
    - Sufficient for configuration data
    - Good for recent transaction history
    - Simpler implementation for non-critical data

### 4.3 Barcode Processing

- **zbar.wasm**
  - For barcode recognition
  - Rationale:
    - Excellent performance through WebAssembly
    - Wide format support
    - Pure client-side processing

- **MediaDevices API**
  - For camera integration
  - Rationale:
    - Native browser API
    - Simple integration with Svelte
    - Good performance

### 4.4 Payment Processing

- **Cash Payment System**
  - Calculator-style input component
  - Preset denomination buttons
  - Keyboard input support
  - Change calculation logic

- **Payment UI Components**
  - Split into subcomponents:
    - NumericKeypad
    - PresetButtons
    - ChangeDisplay
  - Shared payment state management

### 4.5 Internationalization

- **i18n Solution**
  - svelte-i18n
  - Rationale:
    - Native Svelte integration
    - Support for multiple locales
    - Easy to use with TypeScript
    - Handles pluralization and formatting

- **Translation Structure**
  - Separate JSON files for each language
  - Translation keys organized by feature
  - Support for interpolation
  - Number and currency formatting

### 4.6 UI Components

- Tab-based navigation
- Responsive design with Tailwind CSS
- Separate print styles
- Component structure:
  - Shared Components (Buttons, Inputs, etc.)
  - Feature-based Components (Scanner, Cart, etc.)
  - Layout Components (Header, Navigation, etc.)
  - Page Components (Inventory, Register, Settings)

## 5. Development Phases

### Phase 1: Foundation

1. Basic setup (Svelte app with TypeScript)
2. I18n implementation
3. Basic UI structure and navigation
4. Settings page with language selection

### Phase 2: Core Features

1. Inventory management (CRUD operations)
2. Data persistence (IndexedDB integration)
3. Translations for all inventory-related features

### Phase 3: Register Functions

1. Barcode scanner integration
2. Register interface
3. Payment processing
4. Translations for register operations

### Phase 4: Output

1. Receipt display
2. Print functionality
3. Display/Print styling
4. Translations for receipts

### Phase 5: Refinement

1. Settings completion
2. Feedback systems
3. Error handling
4. Testing and optimization
5. Translation review and completion

## 6. Potential Challenges

1. Barcode scanner configuration for different webcams
2. Print layout optimization
3. Offline functionality
4. Browser compatibility
5. Maintaining consistent translations
6. Handling of currency formats in different locales

## 7. Future Extension Possibilities

1. Professional mode
2. Multiple stores
3. Extended statistics
4. Import/Export of inventory data
5. Customizable receipt templates
6. Additional languages

## 8. Technical Requirements

- Modern browser with:
  - IndexedDB support
  - WebRTC (camera access)
  - localStorage
- Webcam for barcode scanning (optional)
- Printer for receipt output (optional)

## 9. Security Aspects

- Secure camera permissions
- Local-only data storage
- No sensitive data

## Implementation Priorities for Phase 3

1. Scanner Interface
   - Camera preview implementation
   - Visual scan area overlay
   - Feedback system integration
   - Camera device selection

2. Payment Processing
   - Calculator component
   - Preset denominations
   - Keyboard input handling
   - Change calculation

3. Audio/Visual Feedback
   - Scan success/error sounds
   - Visual animations
   - Volume controls
   - Performance optimization

4. Data Management
   - Inventory persistence
   - Recent transaction storage
   - Settings persistence
   - Error handling

5. User Interface Integration
   - Component composition
   - State management
   - Error handling
   - Loading states

## Technical Notes

### Audio Implementation

- Use Web Audio API for low-latency feedback
- Preload sounds on component mount
- Handle mobile audio contexts appropriately
- Provide fallback for unsupported browsers

### Scanner Feedback

- Visual overlay using CSS transitions
- Sound effects < 100ms latency
- Debounce scan attempts (100ms)
- Clear success/error indicators

### Payment Interface

- Support touch and keyboard input
- Validate input in real-time
- Clear visual feedback for all actions
- Prevent double-submission

### Performance Considerations

- Lazy load camera components
- Efficient scanner processing
- Smooth animations (60fps target)
- Responsive UI without blocking
