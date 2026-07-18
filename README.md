<div align="center">

# 🔷 No-code Form Builder

### Drag-Drop Form Builder | JSON Save | HTML/CSS/JS Export

[![React](https://img.shields.io/badge/React-18.2-61DAFB?logo=react)](https://reactjs.org/)
[![Vite](https://img.shields.io/badge/Vite-5.0-646CFF?logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

**A powerful no-code form builder that lets you create, customize, and export HTML forms through an intuitive drag-and-drop interface — all client-side, no server required.**

[Live Demo](http://localhost:3000) • [Features](#-features) • [Quick Start](#-quick-start) • [Documentation](#-documentation) • [Specifications](SPECIFICATIONS.md)

</div>

---

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Quick Start](#-quick-start)
- [Project Structure](#-project-structure)
- [Architecture](#-architecture)
- [Features Documentation](#-features-documentation)
  - [Field Management](#1-field-management)
  - [Property Configuration](#2-property-configuration)
  - [Live Preview](#3-live-preview)
  - [JSON Schema](#4-json-schema)
  - [Code Export](#5-code-export)
  - [Form Submissions](#6-form-submissions)
  - [Persistence](#7-persistence)
- [Validation System](#-validation-system)
- [State Management](#-state-management)
- [JSON Schema Format](#-json-schema-format)
- [API Reference](#-api-reference)
- [Keyboard Shortcuts](#-keyboard-shortcuts)
- [Browser Support](#-browser-support)
- [Performance](#-performance)
- [Error Handling](#-error-handling)
- [FAQ](#-faq)
- [Contributing](#-contributing)

---

## 🔍 Overview

**No-code Form Builder** is a client-side web application that enables users to create, customize, and manage HTML forms through an intuitive drag-and-drop interface. The system generates form schemas in JSON format and provides export capabilities for HTML, CSS, and JavaScript code.

### What Problem Does It Solve?

Building HTML forms traditionally requires knowledge of HTML, CSS, and JavaScript. This tool eliminates that barrier by providing a visual form builder that generates production-ready code — making form creation accessible to designers, content creators, and non-technical users.

### How It Works

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│  Drag Fields │────▶│ Configure    │────▶│ Preview      │────▶│ Export       │
│  to Canvas   │     │ Properties   │     │ Live Form    │     │ JSON/HTML/   │
│              │     │              │     │              │     │ CSS/JS       │
└──────────────┘     └──────────────┘     └──────────────┘     └──────────────┘
```

---

## ✨ Key Features

### Core Features

| Feature | Description |
|---------|-------------|
| 🖱️ **Drag & Drop** | 7 field types: Text, Email, Number, Checkbox, Radio, Select, File |
| ⚙️ **Field Properties** | Label, Name, Placeholder, Required, Validation rules |
| 📋 **Live Preview** | Real-time form rendering with interactive testing |
| 💾 **JSON Schema Save** | Complete form configuration saved as JSON |
| 📤 **Code Export** | Download HTML, CSS, JS files or complete package |
| 📊 **Submissions** | Capture, view, search, sort, and export form responses |
| 💽 **Auto-Save** | Automatic persistence to localStorage every 5 seconds |

### Advanced Features

| Feature | Description |
|---------|-------------|
| 🔀 **Field Reordering** | Drag fields within canvas or use arrow buttons |
| ✅ **Validation Engine** | Comprehensive field-level and form-level validation |
| 📱 **Responsive Design** | Works on desktop and tablet screens |
| 🎨 **Dark Theme** | Modern glassmorphism UI with smooth animations |
| 📁 **Multiple Forms** | Create, load, switch between, and delete multiple forms |
| 🔔 **Toast Notifications** | User-friendly feedback for all actions |
| 🛡️ **Error Boundary** | Graceful error recovery with detailed error info |

---

## 🛠️ Tech Stack

| Technology | Purpose | Version |
|------------|---------|---------|
| **React** | UI Framework | 18.2 |
| **Vite** | Build Tool & Dev Server | 5.0 |
| **react-dnd** | Drag & Drop Library | 16.0 |
| **react-dnd-html5-backend** | HTML5 DnD Backend | 16.0 |
| **Lucide React** | Icon Library | Latest |
| **localStorage** | Client-side Persistence | Browser API |

---

## 🚀 Quick Start

### Prerequisites

- **Node.js** 18+ (recommended: 20+)
- **npm** 9+ or **yarn** 1.22+

### Installation

```bash
# Clone the repository
git clone https://github.com/your-username/no-code-form-builder.git

# Navigate to project directory
cd no-code-form-builder

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will open at **http://localhost:3000**

### Build for Production

```bash
# Build optimized production bundle
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
no-code-form-builder/
├── index.html                     # Entry HTML
├── package.json                   # Dependencies & Scripts
├── vite.config.js                 # Vite Configuration
├── public/
│   └── vite.svg                   # Favicon
└── src/
    ├── main.jsx                   # React Entry Point
    ├── App.jsx                    # Root Component
    ├── index.css                  # Global Styles (Dark Theme)
    │
    ├── context/
    │   ├── FormBuilderContext.jsx  # React Context
    │   ├── FormBuilderProvider.jsx # Context Provider + Auto-save
    │   └── reducer.js             # State Reducer (20+ actions)
    │
    ├── components/
    │   ├── common/
    │   │   ├── Header.jsx         # Navigation + Form Management
    │   │   ├── Toast.jsx          # Notification System
    │   │   ├── ErrorBoundary.jsx  # Error Recovery UI
    │   │   └── FormList.jsx       # Saved Forms Dialog
    │   │
    │   ├── toolbox/
    │   │   └── Toolbox.jsx        # Draggable Field Types
    │   │
    │   ├── canvas/
    │   │   ├── Canvas.jsx         # Drop Zone + Field Rendering
    │   │   └── CanvasField.jsx    # Individual Canvas Fields
    │   │
    │   ├── properties/
    │   │   └── PropertiesPanel.jsx # Field Configuration Panel
    │   │
    │   ├── preview/
    │   │   └── Preview.jsx        # Live Form Preview
    │   │
    │   ├── submissions/
    │   │   └── Submissions.jsx    # Submissions Dashboard
    │   │
    │   └── export/
    │       └── ExportDialog.jsx   # JSON/HTML/CSS/JS Export
    │
    └── utils/
        ├── helpers.js             # ID Generation, Field Creation
        ├── validation.js          # Validation Engine (30+ rules)
        ├── exportUtils.js         # Code Generators
        └── storage.js             # localStorage Management
```

---

## 🏗️ Architecture

### State Management Flow

```
┌─────────────────────────────────────────────────────────────┐
│                    USER ACTIONS                              │
│  Drag Drop │ Click │ Type │ Toggle │ Button                 │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    DISPATCH                                  │
│  ADD_FIELD │ UPDATE_FIELD │ DELETE_FIELD │ TOGGLE_PREVIEW    │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                    REDUCER                                   │
│  State Management │ Validation │ Side Effects               │
└────────────────────┬────────────────────────────────────────┘
                     │
          ┌──────────┼──────────┐
          ▼          ▼          ▼
    ┌──────────┐ ┌──────────┐ ┌──────────┐
    │ Canvas   │ │ Preview  │ │ Storage  │
    │ Render   │ │ Render   │ │ Persist  │
    └──────────┘ └──────────┘ └──────────┘
```

### Component Hierarchy

```
App
├── ErrorBoundary
│   └── DndProvider
│       └── FormBuilderProvider
│           ├── Header
│           │   └── FormListDialog
│           ├── Builder Layout
│           │   ├── Toolbox (Drag Source)
│           │   ├── Canvas (Drop Target)
│           │   │   └── CanvasField (Drag + Drop)
│           │   └── PropertiesPanel
│           │       ├── FieldProperties
│           │       ├── OptionsEditor
│           │       └── ValidationEditor
│           ├── Preview
│           │   └── PreviewField (x N)
│           ├── Submissions
│           ├── ExportDialog
│           └── Toast
```

---

## 📖 Features Documentation

### 1. Field Management

#### Available Field Types

| Type | Icon | Default Label | Configuration Options |
|------|------|---------------|----------------------|
| `text` | Type | Text Input | Label, Name, Placeholder, Required, Min/Max Length, Pattern |
| `email` | Mail | Email Address | Label, Name, Placeholder, Required |
| `number` | Hash | Number | Label, Name, Placeholder, Required, Min, Max |
| `checkbox` | CheckSquare | Checkbox | Label, Name, Required |
| `radio` | CircleDot | Radio Group | Label, Name, Options (min 2), Required |
| `select` | ChevronDown | Dropdown | Label, Name, Options (min 1), Required |
| `file` | Paperclip | File Upload | Label, Name, Required, Max Size, Allowed Types |

#### Drag & Drop

1. **Drag from Toolbox**: Click and drag any field type from the left panel
2. **Drop on Canvas**: Release on the canvas area to add the field
3. **Position**: Fields can be dropped at specific positions based on cursor location
4. **Reorder**: Use ↑/↓ buttons or drag fields within the canvas to reorder

#### Field Operations

- **Select**: Click any field on canvas to edit its properties
- **Delete**: Click × button on field or press Delete key
- **Reorder**: Use ↑/↓ buttons on field header
- **Maximum**: 50 fields per form

---

### 2. Property Configuration

#### General Properties

| Property | Description | Validation |
|----------|-------------|------------|
| **Label** | Display text for the field | Required, Max 100 chars |
| **Name** | HTML name attribute | Alphanumeric + underscores, must start with letter, unique, max 50 chars |
| **Placeholder** | Hint text in empty fields | Max 200 chars |
| **Required** | Toggle mandatory status | Boolean |

#### Type-Specific Properties

**Text Field:**
- Min Length — Minimum character count
- Max Length — Maximum character count
- Pattern — Regular expression pattern
- Custom Error — Custom validation message

**Number Field:**
- Min Value — Minimum allowed number
- Max Value — Maximum allowed number

**Radio/Select Fields:**
- Options — Add, edit, remove options (2-50 for radio, 1-50 for select)
- Duplicate detection
- Empty option detection

**File Field:**
- Max Size — 1MB to 50MB
- Allowed Types — Images, PDF, Word, or custom

**Email Field:**
- Email format validation is auto-enabled

---

### 3. Live Preview

The Preview mode provides a real-time interactive form preview:

- **Real-time Updates**: Preview updates instantly on any property change
- **Field Rendering**: All field types rendered with proper HTML elements
- **Custom Styling**: Custom checkboxes, radio buttons, styled selects
- **Validation Testing**: All validation rules apply in preview
- **Form Submission**: Submit test data to capture submissions
- **Error Display**: Inline error messages with visual indicators
- **Error Counter**: Badge showing total validation errors

#### Submitting in Preview

1. Fill in form fields
2. Click "Submit Form"
3. Validation runs on all fields
4. Success: Data captured, success message shown
5. Error: Inline errors displayed, toast notification

---

### 4. JSON Schema

The form schema follows a structured JSON format:

```json
{
  "form": {
    "id": "form-abc123",
    "title": "Contact Form",
    "description": "Get in touch with us",
    "fields": [
      {
        "type": "text",
        "id": "field-xyz789",
        "label": "Full Name",
        "name": "fullName",
        "required": true,
        "placeholder": "Enter your name",
        "validation": {
          "minLength": "2",
          "maxLength": "100"
        },
        "options": []
      },
      {
        "type": "email",
        "id": "field-abc456",
        "label": "Email",
        "name": "email",
        "required": true,
        "placeholder": "you@example.com",
        "validation": {},
        "options": []
      }
    ],
    "createdAt": "2026-07-18T10:00:00.000Z",
    "updatedAt": "2026-07-18T10:30:00.000Z"
  },
  "submissions": [
    {
      "submissionId": "sub-abc123",
      "timestamp": "2026-07-18T10:35:00.000Z",
      "formId": "form-abc123",
      "data": {
        "fullName": "John Doe",
        "email": "john@example.com"
      }
    }
  ]
}
```

#### Schema Properties

| Property | Type | Required | Description |
|----------|------|----------|-------------|
| `form.id` | string | ✅ | Unique form identifier |
| `form.title` | string | ✅ | Display title |
| `form.description` | string | | Form description |
| `form.fields` | array | ✅ | Array of field objects |
| `form.createdAt` | string | ✅ | ISO 8601 timestamp |
| `form.updatedAt` | string | ✅ | ISO 8601 timestamp |
| `submissions` | array | | Array of submission objects |

---

### 5. Code Export

#### Export Options

| Format | Description | File |
|--------|-------------|------|
| **JSON** | Complete form schema | `form-schema-{id}.json` |
| **HTML** | Valid HTML5 markup | `form.html` |
| **CSS** | Responsive styles | `styles.css` |
| **JS** | Validation + submission logic | `script.js` |
| **All** | Complete package | All 4 files |

#### Generated HTML Features

- Valid HTML5 document structure
- Semantic form elements
- Proper label-input associations
- Required field indicators
- Responsive meta viewport
- Accessible markup
- ARIA attributes

#### Generated CSS Features

- Mobile-first responsive design
- Modern, clean styling
- Form layout and spacing
- Validation state styling (error/success)
- Focus and hover states
- Custom checkbox/radio styles
- Professional appearance

#### Generated JavaScript Features

- Form validation logic
- Field-level validation
- Real-time validation feedback
- Submit handler with data capture
- Form reset functionality
- Submission data JSON generation
- Error display management
- Event listeners for all fields

---

### 6. Form Submissions

#### Submissions Dashboard

- **Table View**: All submissions in a responsive table
- **Search**: Filter submissions by any text
- **Sort**: Click column headers to sort (ascending/descending)
- **Pagination**: 10 items per page with navigation
- **Detail View**: Click "View" to see full submission JSON
- **Export**: Download all submissions as JSON
- **Clear**: Delete all submissions (with confirmation)

#### Submission Data Structure

```json
{
  "submissionId": "sub-abc123",
  "timestamp": "2026-07-18T10:35:00.000Z",
  "formId": "form-abc123",
  "data": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "age": "25"
  }
}
```

---

### 7. Persistence

#### Auto-Save

- **Interval**: Every 5 seconds
- **Trigger**: On any state change (isDirty flag)
- **Storage**: localStorage
- **Visual**: Unsaved changes indicator (orange dot)

#### Manual Save

- Click "Save" button in header
- Validates schema before saving
- Shows success/error toast

#### Storage Keys

| Key | Description |
|-----|-------------|
| `formbuilder_form_{id}` | Form schema data |
| `formbuilder_submissions_{id}` | Form submissions |
| `formbuilder_forms_list` | List of all saved forms |

#### Storage Management

- Auto-cleanup when storage is near limit
- Removes oldest forms first
- QuotaExceededError handling
- Storage availability detection

---

## ✅ Validation System

### Field Name Validation

| Rule | Description |
|------|-------------|
| Required | Cannot be empty |
| Format | Only letters, numbers, underscores |
| Start | Must start with letter or underscore |
| Length | Maximum 50 characters |
| Unique | No duplicates across form fields |

### Label Validation

| Rule | Description |
|------|-------------|
| Required | Cannot be empty |
| Length | Maximum 100 characters |

### Placeholder Validation

| Rule | Description |
|------|-------------|
| Length | Maximum 200 characters |

### Options Validation (Radio/Select)

| Rule | Radio | Select |
|------|-------|--------|
| Minimum | 2 options | 1 option |
| Maximum | 50 options | 50 options |
| Empty | Not allowed | Not allowed |
| Duplicates | Not allowed | Not allowed |

### Number Validation

| Rule | Description |
|------|-------------|
| Format | Must be valid number |
| Min | Minimum allowed value |
| Max | Maximum allowed value |
| Range | Min cannot exceed Max |

### Text Validation

| Rule | Description |
|------|-------------|
| Min Length | Minimum character count |
| Max Length | Maximum character count |
| Pattern | Valid regex pattern |
| Custom Error | Custom error message |

### Email Validation

| Rule | Description |
|------|-------------|
| Format | Standard email regex pattern |

### File Validation

| Rule | Description |
|------|-------------|
| Max Size | 1-50 MB limit |
| Types | MIME type validation |

### Form-Level Validation

| Rule | Description |
|------|-------------|
| Fields | At least 1 field required |
| Limit | Maximum 50 fields |
| Names | All field names must be unique |
| ID | Valid form ID format |

---

## 🔄 State Management

### Application States

```
INITIAL_START → IDLE → BUILDING ↔ PREVIEW → SUBMITTING → SUBMISSIONS
                       ↕                      ↕
                    SAVING                EXPORTING
```

### State Variables

| Variable | Type | Description |
|----------|------|-------------|
| `appState` | string | Current application state |
| `currentFormId` | string | ID of loaded form |
| `formTitle` | string | Form display title |
| `formDescription` | string | Form description |
| `fields` | array | Array of field objects |
| `selectedFieldId` | string | Currently selected field |
| `submissions` | array | Form submissions |
| `isDirty` | boolean | Unsaved changes flag |
| `lastSaved` | string | Last save timestamp |
| `isPreviewMode` | boolean | Preview mode active |
| `showSubmissions` | boolean | Submissions view active |
| `showExportDialog` | boolean | Export dialog open |
| `toastMessages` | array | Active notifications |

### Reducer Actions

| Action | Description |
|--------|-------------|
| `CREATE_FORM` | Create new form |
| `LOAD_FORM` | Load saved form |
| `SET_FORM_TITLE` | Update form title |
| `SET_FORM_DESCRIPTION` | Update form description |
| `ADD_FIELD` | Add field to canvas |
| `UPDATE_FIELD` | Update field properties |
| `DELETE_FIELD` | Remove field |
| `SELECT_FIELD` | Select field for editing |
| `REORDER_FIELDS` | Change field order |
| `TOGGLE_PREVIEW` | Toggle preview mode |
| `SET_PREVIEW_MODE` | Set preview mode |
| `SHOW_SUBMISSIONS` | Toggle submissions view |
| `SHOW_EXPORT` | Toggle export dialog |
| `ADD_SUBMISSION` | Capture submission |
| `CLEAR_SUBMISSIONS` | Remove all submissions |
| `DELETE_SUBMISSION` | Remove single submission |
| `SET_SAVED` | Mark as saved |
| `ADD_TOAST` | Show notification |
| `REMOVE_TOAST` | Hide notification |
| `SET_FORMS_LIST` | Update forms list |
| `SET_APP_STATE` | Set application state |
| `RESET` | Reset to initial state |

---

## 📐 JSON Schema Format

### Complete Schema Structure

```json
{
  "form": {
    "id": "string (required)",
    "title": "string (required)",
    "description": "string (optional)",
    "fields": [
      {
        "type": "text|email|number|checkbox|radio|select|file",
        "id": "string (required)",
        "label": "string (required)",
        "name": "string (required, unique)",
        "required": "boolean",
        "placeholder": "string",
        "validation": {
          "pattern": "string (regex)",
          "minLength": "string (number)",
          "maxLength": "string (number)",
          "min": "string (number)",
          "max": "string (number)",
          "maxSize": "number (MB)",
          "allowedTypes": ["string (MIME)"],
          "customError": "string"
        },
        "options": ["string"]  // For radio/select only
      }
    ],
    "createdAt": "string (ISO 8601)",
    "updatedAt": "string (ISO 8601)"
  },
  "submissions": [
    {
      "submissionId": "string",
      "timestamp": "string (ISO 8601)",
      "formId": "string",
      "data": "object (key-value pairs)"
    }
  ]
}
```

---

## 📚 API Reference

### Utility Functions

#### `createFieldObject(type, existingNames)`
Creates a new field with default properties.

```javascript
import { createFieldObject } from './utils/helpers'
const field = createFieldObject('text', ['email', 'name'])
// Returns: { id: 'field-...', type: 'text', label: 'Text Input', ... }
```

#### `validateFieldValue(field, value)`
Validates a field value against its rules.

```javascript
import { validateFieldValue } from './utils/validation'
const errors = validateFieldValue(field, 'test@email.com')
// Returns: [] (empty if valid)
```

#### `validateFormSchema(form)`
Validates entire form schema.

```javascript
import { validateFormSchema } from './utils/validation'
const result = validateFormSchema(form)
// Returns: { isValid: boolean, errors: [] }
```

#### `generateJSONSchema(form)`
Generates exportable JSON schema.

```javascript
import { generateJSONSchema } from './utils/exportUtils'
const schema = generateJSONSchema(form)
```

#### `generateHTML(form)` / `generateCSS()` / `generateJS(form)`
Generates exportable code files.

```javascript
import { generateHTML, generateCSS, generateJS } from './utils/exportUtils'
const html = generateHTML(form)
const css = generateCSS()
const js = generateJS(form)
```

### Storage Functions

```javascript
import {
  saveFormToStorage,     // Save form → { success, error? }
  loadFormFromStorage,   // Load form → { data, error }
  deleteFormFromStorage, // Delete form → boolean
  getAllSavedForms,      // List forms → array
  isStorageAvailable,    // Check storage → boolean
  getStorageUsage        // Get usage → { used, usedMB, available }
} from './utils/storage'
```

---

## ⌨️ Keyboard Shortcuts

| Action | Shortcut |
|--------|----------|
| Delete Field | `Delete` / `Backspace` |
| Create New Form | Click "+ New" button |
| Save Form | Click "Save" button |
| Toggle Preview | Click "Preview" button |
| Export | Click "Export" button |

---

## 🌐 Browser Support

| Browser | Version | Status |
|---------|---------|--------|
| Chrome | 90+ | ✅ Fully Supported |
| Edge | 90+ | ✅ Fully Supported |
| Firefox | 88+ | ✅ Fully Supported |
| Safari | 14+ | ✅ Fully Supported |

### Requirements

- JavaScript ES6+ enabled
- localStorage available
- HTML5 Drag & Drop API support

---

## ⚡ Performance

| Metric | Target | Condition |
|--------|--------|-----------|
| Page Load | < 2s | Initial load |
| Drag Response | < 50ms | Field drag operation |
| Preview Update | < 200ms | Property change |
| JSON Export | < 100ms | 50 fields |
| Code Generation | < 500ms | 50 fields |
| Auto-save | < 100ms | Form data save |
| Max Fields | 50 | Per form |
| Max Submissions | 10,000 | Per form |

---

## 🛡️ Error Handling

### Error Types

| Error | Cause | Resolution |
|-------|-------|------------|
| `storageFull` | localStorage quota exceeded | Delete old forms |
| `storageUnavailable` | localStorage blocked | Enable cookies |
| `invalidName` | Duplicate field name | Use unique name |
| `invalidRegex` | Bad regex pattern | Fix pattern syntax |
| `fileTooLarge` | File exceeds size limit | Upload smaller file |
| `fileTypeNotAllowed` | Invalid file type | Upload allowed type |
| `validationFailed` | Form has errors | Fix validation errors |
| `exportFailed` | Code generation error | Try again |

### Error Boundary

The app includes a React Error Boundary that:
- Catches JavaScript errors
- Displays user-friendly error screen
- Provides "Try Again" and "Reload" buttons
- Shows error details for debugging

---

## ❓ FAQ

### Q: Is this a server-side application?
**A:** No. Everything runs client-side in your browser. No server, no database, no authentication required.

### Q: Where is my data stored?
**A:** All data is stored in your browser's localStorage. Data persists across page refreshes but is specific to your browser.

### Q: Can I use this offline?
**A:** Yes! After the initial load, the app works completely offline.

### Q: What's the maximum number of fields?
**A:** 50 fields per form for optimal performance.

### Q: Can I import existing forms?
**A:** Currently, forms are created visually. You can paste JSON schema in future versions.

### Q: How do I share my form?
**A:** Export as HTML/CSS/JS and host the files on any web server.

### Q: Is the generated code production-ready?
**A:** Yes! The exported HTML/CSS/JS is clean, semantic, and ready to use.

### Q: Can I customize the generated styles?
**A:** Yes! Export the CSS file and modify it to match your design system.

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

### Development Setup

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Run linting
npm run lint

# Build for production
npm run build
```

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 🙏 Acknowledgments

- [React](https://reactjs.org/) - UI Framework
- [Vite](https://vitejs.dev/) - Build Tool
- [react-dnd](https://github.com/react-dnd/react-dnd/) - Drag & Drop
- [Lucide](https://lucide.dev/) - Icons

---

<div align="center">

**Built with ❤️ for the no-code community**

[⬆ Back to Top](#-no-code-form-builder)

</div>
