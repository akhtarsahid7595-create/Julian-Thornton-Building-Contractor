---
name: client-compliance-verification
description: >-
  Ensures 100% compliance with client requirements for Glasgow Drive Connect.
  Activate this skill when a user provides a list of client guidelines or requests
  changes to the website, copy, postcodes, pricing, or positioning. It enforces
  strict one-by-one point implementation, prohibits adding unrequested features/copy
  ("no masala"), mandates visual browser checks, and requires a final screenshot-based proof report.
---

# Client Compliance Verification Skill

Use this skill to implement and verify client requests with 100% precision. Do not add any extra sections, pages, code, or stylized assumptions beyond what the client explicitly requests.

---

## Core Rules for Client Satisfaction

1. **Strict Copy & Wording Alignment:**
   - Keep the core business positioning as: **A DRIVING INSTRUCTOR MATCHING & CONNECTION SERVICE**.
   - Ensure the learner journey remains: **LEARNER → GLASGOW DRIVE CONNECT → SUITABLE INSTRUCTOR → LESSONS**.
   - Do not refer to the service as a traditional driving school. Do not use phrases like *"our school"*, *"our instructors"*, or *"our lesson prices"*.
   - If postcode coverage is listed, avoid claiming a guarantee of availability in every postcode. Instead, state **"Glasgow & surrounding areas / postcodes"**, prompt to **"Enter your postcode to check availability"**, and add **"Coverage and instructor availability vary by postcode"**.

2. **No "Added Masala" (Strict Constraint):**
   - Implement only the exact modifications, copy, or logic requested by the client.
   - Do not add extra pages, visual decorations, links, or styles that were not asked for.
   - Do not invent hypothetical sub-regions or local lists unless instructed.

---

## Step-by-Step Execution Workflow

### Step 1: Checklist Extraction
When the user/client provides feedback or a list of points:
1. Parse the request and extract each numbered or bulleted requirement.
2. Write down a structured checklist listing each point explicitly.
3. Verify which files are affected by each point.

### Step 2: Implementation
1. Perform only the changes necessary to satisfy each checklist item.
2. Edit target files with precise replacements to avoid altering unrelated parts of the codebase.

### Step 3: Visual & Code Verification
For every modified page/item:
1. Use the browser subagent (`browser_subagent`) to open the page locally.
2. Visually verify the alignment, text formatting, and mobile responsiveness.
3. Capture visual screenshots of each change and save them directly in the artifacts directory: `C:\Users\sahid\.gemini\antigravity-ide\brain\<conversation-id>/`.

### Step 4: Final Compliance & Proof Report
Upon completing all changes, generate a comprehensive `proof_report.md` artifact in the conversation directory. The report must contain:
1. **Verification Checklist:** A table matching each client point to its status and proof.
2. **Code Diffs:** The exact line changes made.
3. **Visual Proof Carousel:** Embedded screenshots of the modified page sections using the `![caption](file:///C:/Users/sahid/.gemini/antigravity-ide/brain/<conversation-id>/filename.png)` syntax.
