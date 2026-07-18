# Specification Documents

## Overview

This project was built using a structured specification-driven development approach with four key documents: **OST**, **FST**, **SST**, and **LST**. These documents define the complete requirements, architecture, and implementation details of the No-code Form Builder.

---

## Document Index

| Document | Full Name | Purpose |
|----------|-----------|---------|
| **OST** | Operational Specification Template | Defines what the system does |
| **FST** | Functional Specification Template | Defines how each feature works |
| **SST** | System Specification Template | Defines technical architecture |
| **LST** | Logical Specification Template | Defines implementation logic |

---

## 1. OST — Operational Specification Template

### 1.1 System Overview

**System Name:** No-code Form Builder
**Version:** 1.0
**Type:** Client-side Web Application
**Framework:** React 18 + Vite

### 1.2 Purpose

A no-code drag-and-drop form builder that enables users to create, customize, and export HTML forms through an intuitive visual interface. The system generates form schemas in JSON format and provides export capabilities for HTML, CSS, and JavaScript code.

### 1.3 Objectives

| # | Objective | Priority |
|---|-----------|----------|
| O1 | Enable visual form creation without coding | High |
| O2 | Support 7 field types with drag-drop | High |
| O3 | Provide real-time preview | High |
| O4 | Export production-ready code | High |
| O5 | Capture and manage submissions | Medium |
| O6 | Persist data locally | Medium |
| O7 | Validate all inputs | High |

### 1.4 User Roles

| Role | Description | Permissions |
|------|-------------|-------------|
| Form Builder | Primary user | Create, edit, delete, export forms |
| Form Viewer | End user | Fill and submit forms (in preview/export) |

### 1.5 System Scope

**In Scope:**
- Form creation and editing
- Field configuration and validation
- Live preview mode
- JSON schema generation
- HTML/CSS/JS code export
- Form submission capture
- Local data persistence

**Out of Scope:**
- Server-side processing
- User authentication
- Database storage
- Form sharing/linking
- Multi-user collaboration

### 1.6 Constraints

| Constraint | Description |
|------------|-------------|
| C1 | No server - all client-side |
| C2 | No external database |
| C3 | No authentication required |
| C4 | Maximum 50 fields per form |
| C5 | Maximum 10,000 submissions per form |

---

## 2. FST — Functional Specification Template

### 2.1 Feature List

| ID | Feature | Description | Status |
|----|---------|-------------|--------|
| F1 | Field Management | Add, edit, delete, reorder fields | ✅ |
| F2 | Drag & Drop | Visual field placement | ✅ |
| F3 | Property Configuration | Field-specific settings | ✅ |
| F4 | Live Preview | Real-time form rendering | ✅ |
| F5 | JSON Schema | Form data serialization | ✅ |
| F6 | Code Export | HTML/CSS/JS generation | ✅ |
| F7 | Submissions | Data capture and management | ✅ |
| F8 | Persistence | localStorage auto-save | ✅ |
| F9 | Validation | Input validation engine | ✅ |
| F10 | Multiple Forms | Create, load, switch, delete | ✅ |

### 2.2 Field Types

| Type | Icon | Configuration Options |
|------|------|----------------------|
| Text | Type | Label, Name, Placeholder, Required, Min/Max Length, Pattern, Custom Error |
| Email | Mail | Label, Name, Placeholder, Required |
| Number | Hash | Label, Name, Placeholder, Required, Min, Max |
| Checkbox | CheckSquare | Label, Name, Required |
| Radio | CircleDot | Label, Name, Options (2-50), Required |
| Select | ChevronDown | Label, Name, Options (1-50), Required |
| File | Paperclip | Label, Name, Required, Max Size (1-50MB), Allowed Types |

### 2.3 Field Operations

| Operation | Description | Trigger |
|-----------|-------------|---------|
| Add | Create new field | Drag from toolbox |
| Edit | Modify field properties | Click field in canvas |
| Delete | Remove field | Click × or press Delete |
| Reorder | Change field position | Drag or use ↑/↓ buttons |
| Select | Focus field for editing | Click field in canvas |

### 2.4 Validation Rules

#### Field Name
- Required
- Alphanumeric + underscores only
- Must start with letter or underscore
- Maximum 50 characters
- Unique within form

#### Label
- Required
- Maximum 100 characters

#### Placeholder
- Maximum 200 characters

#### Options (Radio/Select)
- Radio: 2-50 options required
- Select: 1-50 options required
- No empty options
- No duplicate options

#### Number
- Valid number format
- Min ≤ Max when both specified

#### Text
- Min Length ≥ 0
- Max Length ≥ Min Length
- Valid regex pattern

#### Email
- Standard email format validation

#### File
- Max Size: 1-50 MB
- Valid MIME types

### 2.5 Form Operations

| Operation | Description | Constraints |
|-----------|-------------|-------------|
| Create | New empty form | — |
| Load | Open saved form | From localStorage |
| Save | Persist form | Schema validation required |
| Delete | Remove form | With confirmation |
| Switch | Change active form | Auto-save current first |
| Export | Generate code | Valid schema required |

### 2.6 Submission Operations

| Operation | Description |
|-----------|-------------|
| Capture | Store form submission data |
| View | Display submission details |
| Search | Filter submissions by text |
| Sort | Order by any column |
| Paginate | 10 items per page |
| Export | Download as JSON |
| Clear | Delete all submissions |

---

## 3. SST — System Specification Template

### 3.1 Technology Stack

| Layer | Technology | Version |
|-------|------------|---------|
| UI Framework | React | 18.2 |
| Build Tool | Vite | 5.0 |
| Drag & Drop | react-dnd | 16.0 |
| DnD Backend | react-dnd-html5-backend | 16.0 |
| Icons | Lucide React | Latest |
| Persistence | localStorage | Browser API |
| Language | JavaScript (ES6+) | — |

### 3.2 Project Structure

```
src/
├── main.jsx                    # Entry point
├── App.jsx                     # Root component
├── index.css                   # Global styles
├── context/                    # State management
│   ├── FormBuilderContext.jsx   # Context definition
│   ├── FormBuilderProvider.jsx  # Provider + effects
│   └── reducer.js              # State reducer
├── components/                 # UI components
│   ├── common/                 # Shared components
│   ├── toolbox/                # Field palette
│   ├── canvas/                 # Drop zone
│   ├── properties/             # Field config
│   ├── preview/                # Live preview
│   ├── submissions/            # Data management
│   └── export/                 # Code generation
└── utils/                      # Utilities
    ├── helpers.js              # ID generation, etc.
    ├── validation.js           # Validation engine
    ├── exportUtils.js          # Code generators
    └── storage.js              # localStorage ops
```

### 3.3 State Architecture

#### Global State

| State Variable | Type | Default | Description |
|----------------|------|---------|-------------|
| appState | string | 'idle' | Current application state |
| currentFormId | string | null | Active form ID |
| formTitle | string | 'Untitled Form' | Form title |
| formDescription | string | '' | Form description |
| fields | array | [] | Array of field objects |
| selectedFieldId | string | null | Selected field ID |
| submissions | array | [] | Form submissions |
| isDirty | boolean | false | Unsaved changes |
| lastSaved | string | null | Last save timestamp |
| isPreviewMode | boolean | false | Preview active |
| showSubmissions | boolean | false | Submissions visible |
| showExportDialog | boolean | false | Export dialog open |
| toastMessages | array | [] | Active notifications |

#### Reducer Actions

| Action | Description |
|--------|-------------|
| CREATE_FORM | Initialize new form |
| LOAD_FORM | Load saved form data |
| SET_FORM_TITLE | Update form title |
| SET_FORM_DESCRIPTION | Update form description |
| ADD_FIELD | Add field to canvas |
| UPDATE_FIELD | Update field properties |
| DELETE_FIELD | Remove field |
| SELECT_FIELD | Select field for editing |
| REORDER_FIELDS | Change field order |
| TOGGLE_PREVIEW | Toggle preview mode |
| SET_PREVIEW_MODE | Set preview state |
| SHOW_SUBMISSIONS | Toggle submissions view |
| SHOW_EXPORT | Toggle export dialog |
| ADD_SUBMISSION | Store submission |
| CLEAR_SUBMISSIONS | Remove all submissions |
| DELETE_SUBMISSION | Remove single submission |
| SET_SAVED | Mark form as saved |
| ADD_TOAST | Show notification |
| REMOVE_TOAST | Hide notification |
| SET_FORMS_LIST | Update forms list |
| SET_APP_STATE | Set application state |
| RESET | Reset to initial state |

### 3.4 Data Flow

```
User Action → Dispatch → Reducer → State Update → Component Re-render
                                        ↓
                                   Auto-save → localStorage
```

### 3.5 Component Hierarchy

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
│           ├── Preview
│           ├── Submissions
│           ├── ExportDialog
│           └── Toast
```

### 3.6 Storage Schema

| Key Pattern | Value | Description |
|-------------|-------|-------------|
| `formbuilder_form_{id}` | JSON | Form schema |
| `formbuilder_submissions_{id}` | JSON | Submission data |
| `formbuilder_forms_list` | JSON | List of all forms |

---

## 4. LST — Logical Specification Template

### 4.1 Core Algorithms

#### Field Creation

```
1. User drags field type from toolbox
2. System generates unique ID (field-{random})
3. System creates field object with defaults:
   - id: generated
   - type: from drag source
   - label: default by type
   - name: auto-generated (unique)
   - required: false
   - placeholder: ''
   - validation: {}
   - options: [] (for radio/select)
4. System adds field to state
5. System selects new field for editing
```

#### Field Validation

```
1. User modifies field property
2. System runs validation rules:
   a. Check required fields
   b. Check format (name, email, etc.)
   c. Check constraints (min/max, length)
   d. Check uniqueness (name)
3. If valid: Update state, clear errors
4. If invalid: Show inline errors, prevent save
```

#### Form Save

```
1. User clicks Save or auto-save triggers
2. System validates all fields:
   a. Check at least 1 field exists
   b. Check all field names unique
   c. Check all labels valid
   d. Check all validation rules pass
3. If valid:
   a. Generate form schema JSON
   b. Store in localStorage
   c. Update forms list
   d. Show success toast
4. If invalid:
   a. Show error count
   b. Highlight errors
   c. Show error toast
```

#### Code Export

```
1. User opens Export dialog
2. System validates form schema
3. User selects export format:
   - JSON: Serialize schema
   - HTML: Generate semantic markup
   - CSS: Generate responsive styles
   - JS: Generate validation + handlers
   - All: Generate all files
4. System generates code
5. System creates downloadable file(s)
```

#### Submission Capture

```
1. User fills form in Preview
2. User clicks Submit
3. System validates all fields
4. If valid:
   a. Create submission object:
      - submissionId: unique
      - timestamp: ISO 8601
      - formId: current form
      - data: {name: value, ...}
   b. Add to submissions array
   c. Store in localStorage
   d. Show success message
5. If invalid:
   a. Show inline errors
   b. Show error toast
```

### 4.2 State Transitions

```
IDLE ─────────────────────────────────────────────────────┐
  │                                                       │
  ├─[Create Form]─→ BUILDING                             │
  │                    │                                  │
  │                    ├─[Add Field]─→ BUILDING           │
  │                    ├─[Edit Field]─→ BUILDING          │
  │                    ├─[Delete Field]─→ BUILDING        │
  │                    ├─[Save]─→ SAVING ─→ BUILDING     │
  │                    │                                  │
  │                    ├─[Preview]─→ PREVIEW              │
  │                    │                    │              │
  │                    │                    ├─[Submit]─→ SUBMITTING ─→ PREVIEW
  │                    │                    └─[Back]─→ BUILDING
  │                    │                                  │
  │                    ├─[Submissions]─→ SUBMISSIONS ─→ BUILDING
  │                    └─[Export]─→ EXPORTING ─→ BUILDING
  │                                                       │
  ├─[Load Form]─→ BUILDING                               │
  └─[New Form]─→ BUILDING                                │
```

### 4.3 Validation Logic

#### Field Name Validation

```
function validateName(name, existingNames):
  if name is empty: return error("Name required")
  if name.length > 50: return error("Max 50 chars")
  if not /^[a-zA-Z_]/.test(name): return error("Must start with letter/_")
  if not /^[a-zA-Z0-9_]+$/.test(name): return error("Only alphanumeric/_")
  if existingNames.includes(name): return error("Name must be unique")
  return valid
```

#### Email Validation

```
function validateEmail(value):
  pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if not pattern.test(value): return error("Invalid email")
  return valid
```

#### Number Validation

```
function validateNumber(value, min, max):
  if isNaN(value): return error("Must be a number")
  if min !== undefined and value < min: return error("Min value is {min}")
  if max !== undefined and value > max: return error("Max value is {max}")
  return valid
```

#### Options Validation

```
function validateOptions(options, type):
  min = type === 'radio' ? 2 : 1
  if options.length < min: return error("Min {min} options required")
  if options.length > 50: return error("Max 50 options")
  if options.some(o => o.trim() === ''): return error("No empty options")
  if new Set(options).size !== options.length: return error("No duplicates")
  return valid
```

### 4.4 Storage Operations

#### Save Form

```
function saveForm(form):
  if storageQuotaExceeded():
    cleanupOldForms()
  if storageStillFull():
    return error("Storage full")
  
  key = `formbuilder_form_${form.id}`
  localStorage.setItem(key, JSON.stringify(form))
  updateFormsList(form)
  return success
```

#### Load Form

```
function loadForm(formId):
  key = `formbuilder_form_${formId}`
  data = localStorage.getItem(key)
  if data is null: return error("Form not found")
  return JSON.parse(data)
```

### 4.5 Export Generation

#### HTML Generator

```
function generateHTML(form):
  html = '<!DOCTYPE html>\n<html lang="en">\n<head>'
  html += '<meta charset="UTF-8">'
  html += '<meta name="viewport" content="width=device-width, initial-scale=1.0">'
  html += `<title>${form.title}</title>`
  html += '<link rel="stylesheet" href="styles.css">'
  html += '</head>\n<body>'
  html += `<form id="${form.id}">`
  
  for field in form.fields:
    html += generateFieldHTML(field)
  
  html += '<button type="submit">Submit</button>'
  html += '</form>'
  html += '<script src="script.js"></script>'
  html += '</body>\n</html>'
  
  return html
```

#### CSS Generator

```
function generateCSS():
  css = '/* No-code Form Builder - Generated Styles */\n'
  css += '* { box-sizing: border-box; margin: 0; padding: 0; }'
  css += 'body { font-family: system-ui; padding: 2rem; }'
  css += '.form-group { margin-bottom: 1rem; }'
  css += 'label { display: block; margin-bottom: 0.5rem; font-weight: 600; }'
  css += 'input, select, textarea { width: 100%; padding: 0.75rem; border: 1px solid #ddd; border-radius: 8px; }'
  css += 'input:focus, select:focus { outline: none; border-color: #3b82f6; box-shadow: 0 0 0 3px rgba(59,130,246,0.1); }'
  css += '.error { color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; }'
  css += 'input.error, select.error { border-color: #ef4444; }'
  css += 'button { background: #3b82f6; color: white; padding: 0.75rem 2rem; border: none; border-radius: 8px; cursor: pointer; }'
  css += 'button:hover { background: #2563eb; }'
  return css
```

#### JS Generator

```
function generateJS(form):
  js = '// No-code Form Builder - Generated Script\n\n'
  js += `const formId = "${form.id}";\n`
  js += `const fields = ${JSON.stringify(form.fields)};\n\n`
  js += 'function validateField(name, value) { ... }\n'
  js += 'function validateForm() { ... }\n'
  js += 'document.getElementById(formId).addEventListener("submit", function(e) { ... });\n'
  return js
```

---

## 5. Validation Matrix

### 5.1 Field Validation Rules

| Field | Rule | Condition | Error Message |
|-------|------|-----------|---------------|
| name | required | empty | "Field name is required" |
| name | format | not alphanumeric/_ | "Only letters, numbers, underscores" |
| name | start | not letter/_ | "Must start with letter or underscore" |
| name | length | > 50 chars | "Maximum 50 characters" |
| name | unique | duplicate | "Field name must be unique" |
| label | required | empty | "Label is required" |
| label | length | > 100 chars | "Maximum 100 characters" |
| placeholder | length | > 200 chars | "Maximum 200 characters" |
| options | min | radio < 2 | "At least 2 options required" |
| options | min | select < 1 | "At least 1 option required" |
| options | max | > 50 | "Maximum 50 options" |
| options | empty | any empty | "Options cannot be empty" |
| options | unique | duplicates | "Options must be unique" |
| number | format | NaN | "Must be a valid number" |
| number | min | < min | "Minimum value is {min}" |
| number | max | > max | "Maximum value is {max}" |
| text | minLength | < min | "Minimum {min} characters" |
| text | maxLength | > max | "Maximum {max} characters" |
| text | pattern | no match | "Invalid format" |
| email | format | no match | "Invalid email address" |
| file | maxSize | > limit | "File size exceeds {limit}MB" |
| file | type | not allowed | "File type not allowed" |

### 5.2 Form Validation Rules

| Rule | Condition | Error |
|------|-----------|-------|
| fields | 0 fields | "At least 1 field required" |
| fields | > 50 fields | "Maximum 50 fields" |
| names | duplicate names | "All field names must be unique" |
| id | invalid format | "Invalid form ID" |

---

## 6. Performance Specifications

| Metric | Target | Measurement |
|--------|--------|-------------|
| Initial Load | < 2s | Time to interactive |
| Field Drag | < 50ms | Drag response time |
| Preview Update | < 200ms | Property change to render |
| JSON Export | < 100ms | For 50 fields |
| Code Generation | < 500ms | For 50 fields |
| Auto-save | < 100ms | State change to storage |
| Search | < 50ms | Input to results |
| Sort | < 50ms | Click to reorder |

---

## 7. Browser Compatibility

| Browser | Min Version | Status |
|---------|-------------|--------|
| Chrome | 90+ | ✅ Full |
| Edge | 90+ | ✅ Full |
| Firefox | 88+ | ✅ Full |
| Safari | 14+ | ✅ Full |

### Required APIs

- ES6+ JavaScript
- localStorage
- HTML5 Drag & Drop
- CSS3 (Flexbox, Grid)
- DOM manipulation

---

## 8. Error Handling Matrix

| Error Code | Type | Cause | Resolution |
|------------|------|-------|------------|
| storageFull | Storage | Quota exceeded | Delete old forms |
| storageUnavailable | Storage | localStorage blocked | Enable cookies |
| invalidName | Validation | Duplicate name | Use unique name |
| invalidRegex | Validation | Bad regex | Fix pattern |
| fileTooLarge | Validation | Size exceeded | Upload smaller |
| fileTypeNotAllowed | Validation | Invalid type | Upload allowed type |
| validationFailed | Validation | Form errors | Fix errors |
| exportFailed | Export | Generation error | Try again |
| loadFailed | Storage | Corrupted data | Rebuild form |
| saveFailed | Storage | Write error | Check storage |

---

## 9. Testing Strategy

### 9.1 Unit Tests

- Validation functions
- Storage operations
- Helper utilities
- Reducer logic

### 9.2 Integration Tests

- Field CRUD operations
- Form save/load cycle
- Export generation
- Submission capture

### 9.3 E2E Tests

- Complete form creation workflow
- Preview and submission flow
- Export and download flow
- Multi-form management

---

## 10. Future Enhancements

| Priority | Feature | Description |
|----------|---------|-------------|
| High | TypeScript | Add type safety |
| High | Unit Tests | Vitest + React Testing Library |
| Medium | ESLint/Prettier | Code quality tools |
| Medium | Import JSON | Load form from JSON file |
| Medium | Themes | Light/dark mode toggle |
| Low | Multi-page | Multi-step forms |
| Low | Collaborate | Real-time collaboration |
| Low | Cloud Save | Backend integration |

---

<div align="center">

**Built with ❤️ using OST/FST/SST/LST specification methodology**

</div>
