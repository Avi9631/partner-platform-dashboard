# ListDeveloper Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                         ListDeveloperV2.jsx                             │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Main Page                                                        │  │
│  │  • Stats cards (Total, Verified, Projects, Views)                │  │
│  │  • Search & Filter bar                                            │  │
│  │  • Developer cards grid                                           │  │
│  │  • "Add New Developer" button                                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                               ↓                                         │
│                    handleAddNewDeveloper()                              │
│                               ↓                                         │
│              developerDraftApi.createDeveloperDraft()                   │
│                               ↓                                         │
│                  setCurrentDraftId(draftId)                             │
│                               ↓                                         │
│                       setShowForm(true)                                 │
└─────────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                     DeveloperFormSheetV2.jsx                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  Sheet Overlay (Right Side)                                       │  │
│  │  • Header: "Add Developer Partner"                                │  │
│  │  • Dynamic step content                                           │  │
│  │  • Close button with confirmation                                 │  │
│  └──────────────────────────────────────────────────────────────────┘  │
│                               ↓                                         │
│                 DeveloperFormProviderV2 (Context)                       │
│                               ↓                                         │
│                  DeveloperFormContentV2                                 │
│                               ↓                                         │
│                    getStepComponent(currentStep)                        │
└─────────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                   DeveloperFormContextV2.jsx                            │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  State Management                                                 │  │
│  │  • currentStep: number                                            │  │
│  │  • formData: object                                               │  │
│  │  • completedSteps: Set                                            │  │
│  │  • draftId: string                                                │  │
│  │  • isCreatingDraft: boolean                                       │  │
│  ├──────────────────────────────────────────────────────────────────┤  │
│  │  Methods                                                          │  │
│  │  • saveAndContinue(stepData)                                      │  │
│  │  • previousStep()                                                 │  │
│  │  • goToStep(step)                                                 │  │
│  │  • saveDraft(data)                                                │  │
│  │  • resetForm()                                                    │  │
│  │  • getTotalSteps()                                                │  │
│  │  • getProgress()                                                  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                      stepConfiguration.js                               │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  STEP_CONFIG Array                                                │  │
│  │  ┌────────────────────────────────────────────────────────────┐  │  │
│  │  │ Step 0: Basic Information                                   │  │  │
│  │  │         • Component: BasicInfoStepV2                        │  │  │
│  │  │         • Always visible                                    │  │  │
│  │  ├────────────────────────────────────────────────────────────┤  │  │
│  │  │ Step 1: Contact Information                                 │  │  │
│  │  │         • Component: ContactInfoStepV2                      │  │  │
│  │  │         • Always visible                                    │  │  │
│  │  ├────────────────────────────────────────────────────────────┤  │  │
│  │  │ Step 2: Projects & Portfolio                                │  │  │
│  │  │         • Component: ProjectsStepV2                         │  │  │
│  │  │         • Always visible                                    │  │  │
│  │  ├────────────────────────────────────────────────────────────┤  │  │
│  │  │ Step 3: Certifications & Awards                             │  │  │
│  │  │         • Component: CertificationsStepV2                   │  │  │
│  │  │         • Optional                                          │  │  │
│  │  ├────────────────────────────────────────────────────────────┤  │  │
│  │  │ Step 4: Media & Documents                                   │  │  │
│  │  │         • Component: MediaStepV2                            │  │  │
│  │  │         • Optional                                          │  │  │
│  │  ├────────────────────────────────────────────────────────────┤  │  │
│  │  │ Step 5: Review & Submit                                     │  │  │
│  │  │         • Component: ReviewAndSubmitV2                      │  │  │
│  │  │         • Always visible                                    │  │  │
│  │  └────────────────────────────────────────────────────────────┘  │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                         Step Components                                 │
│                                                                         │
│  ┌─────────────────────────────────────────────────────────────┐      │
│  │  BasicInfoStepV2.jsx                                         │      │
│  │  • React Hook Form + Zod validation                          │      │
│  │  • Fields: name, type, year, description, registration       │      │
│  │  • SaveAndContinueFooter                                     │      │
│  └─────────────────────────────────────────────────────────────┘      │
│                             ↓                                           │
│  ┌─────────────────────────────────────────────────────────────┐      │
│  │  ContactInfoStepV2.jsx                                       │      │
│  │  • Primary & secondary contacts                              │      │
│  │  • Office address (city, state, pincode)                     │      │
│  │  • Website, LinkedIn                                         │      │
│  └─────────────────────────────────────────────────────────────┘      │
│                             ↓                                           │
│  ┌─────────────────────────────────────────────────────────────┐      │
│  │  ProjectsStepV2.jsx                                          │      │
│  │  • Completed/ongoing projects count                          │      │
│  │  • Total units, sq.ft. developed                             │      │
│  │  • Project types (multi-select)                              │      │
│  └─────────────────────────────────────────────────────────────┘      │
│                             ↓                                           │
│  ┌─────────────────────────────────────────────────────────────┐      │
│  │  ReviewAndSubmitV2.jsx                                       │      │
│  │  • Display all form data                                     │      │
│  │  • Edit buttons per section                                  │      │
│  │  • Final submit button                                       │      │
│  └─────────────────────────────────────────────────────────────┘      │
└─────────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                  saveAndContinue(stepData)                              │
│                             ↓                                           │
│                  updateFormData(stepData)                               │
│                             ↓                                           │
│                  saveDraft(updatedFormData)                             │
│                             ↓                                           │
│            developerDraftApi.updateDeveloperDraft()                     │
│                             ↓                                           │
│                    Backend API Endpoint                                 │
│                             ↓                                           │
│                  Save to Database (Developer Draft)                     │
└─────────────────────────────────────────────────────────────────────────┘
                                ↓
┌─────────────────────────────────────────────────────────────────────────┐
│                    Database Schema (To Be Implemented)                  │
│  ┌──────────────────────────────────────────────────────────────────┐  │
│  │  developer_drafts                                                 │  │
│  │  • id (UUID)                                                      │  │
│  │  • user_id (FK)                                                   │  │
│  │  • status (draft/submitted/published)                             │  │
│  │  • form_data (JSONB)                                              │  │
│  │  • created_at                                                     │  │
│  │  • updated_at                                                     │  │
│  └──────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────────────┘

═══════════════════════════════════════════════════════════════════════════
                            Data Flow Summary
═══════════════════════════════════════════════════════════════════════════

User Action           →  UI Component        →  Context Method      →  API Call
────────────────────────────────────────────────────────────────────────────
Click "Add Developer" →  ListDeveloperV2    →  N/A                 →  createDraft()
Fill Step 1          →  BasicInfoStepV2    →  saveAndContinue()   →  updateDraft()
Fill Step 2          →  ContactInfoStepV2  →  saveAndContinue()   →  updateDraft()
Fill Step 3          →  ProjectsStepV2     →  saveAndContinue()   →  updateDraft()
Click Submit         →  ReviewAndSubmitV2  →  saveDraft()         →  submitDraft()
Form Closes          →  DeveloperFormSheet →  resetForm()         →  N/A

═══════════════════════════════════════════════════════════════════════════
                          Component Hierarchy
═══════════════════════════════════════════════════════════════════════════

App
└── ListDeveloperV2Page
    ├── Stats Cards (4)
    ├── Filter Bar
    ├── Developer Cards Grid
    │   └── DeveloperCard (multiple)
    │       ├── Image/Logo
    │       ├── Details
    │       ├── Stats
    │       └── Actions Menu
    └── DeveloperFormSheetV2
        └── DeveloperFormProviderV2 (Context)
            └── Sheet (shadcn/ui)
                ├── SheetHeader
                └── SheetContent
                    └── Current Step Component
                        ├── Form Fields
                        └── SaveAndContinueFooter
                            ├── Previous Button
                            └── Save & Continue Button

═══════════════════════════════════════════════════════════════════════════
                           File Dependencies
═══════════════════════════════════════════════════════════════════════════

ListDeveloperV2.jsx
├── DeveloperFormSheetV2 (from v2/index.js)
├── developerDraftService
└── UI Components (Button, Card, Badge, etc.)

DeveloperFormSheetV2.jsx
├── DeveloperFormContextV2
├── stepConfiguration
└── Sheet Components

DeveloperFormContextV2.jsx
├── React Hook Form
├── stepConfiguration
└── developerDraftService

Step Components
├── React Hook Form
├── Zod Schemas
├── DeveloperFormContextV2
├── SaveAndContinueFooter
└── UI Components

═══════════════════════════════════════════════════════════════════════════
```
