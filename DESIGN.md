# Design System Specification: Institutional Precision & Architectural Clarity

## 1. Overview & Creative North Star
The Creative North Star for this design system is **"The Architectural Ledger."** 

This system rejects the "fintech-as-a-toy" aesthetic in favor of institutional gravitas. It is a digital environment built on the principles of structural integrity, mathematical precision, and high-density legibility. We move beyond standard "boxed" UI by treating the screen as a high-end editorial canvas. The goal is to present complex financial data with such intentionality that the layout itself feels like an authoritative piece of architecture—solid, transparent, and permanent.

We break the "template" look through:
*   **Intentional Asymmetry:** Off-setting data columns to create a clear reading path.
*   **The "Structural Void":** Using generous whitespace (`spacing.16` or `spacing.20`) as a functional separator rather than lines.
*   **Monolithic Typography:** Using high-contrast scales to differentiate "Executive Insights" from "Operational Data."

---

## 2. Colors: Tonal Architecture
The palette is built on high-contrast foundations. We use a Deep Navy (`primary_container: #131b2e`) to anchor the experience, paired with a pristine background to ensure maximum optical clarity.

### The "No-Line" Rule
Traditional 1px solid borders are strictly prohibited for sectioning. Structural boundaries must be defined through **Background Color Shifts**. 
*   Place a `surface_container_low` section directly against a `surface` background. 
*   The transition of tone, not the stroke of a pen, defines the edge.

### Surface Hierarchy & Nesting
Treat the UI as a series of physical layers of fine archival paper. 
*   **Base:** `surface` (#f7f9fb) for the main application canvas.
*   **Sectioning:** `surface_container` (#eceef0) for sidebars or secondary content blocks.
*   **The "Ledger" Layer:** Use `surface_container_lowest` (#ffffff) for the primary data cards. By placing a pure white card on a slightly greyed background, we create a "natural lift" that feels premium and clean.

### Signature Textures
To avoid a flat, "default" appearance, use a subtle linear gradient on primary action areas:
*   **Primary CTA:** Transition from `on_primary_fixed` (#131b2e) to `primary_container` (#131b2e at 90% opacity) at a 145-degree angle. This adds a "weighted" feel to the button, suggesting depth without using a shadow.

---

## 3. Typography: The Technical Serif
We utilize **IBM Plex Sans** to bridge the gap between humanistic clarity and machine-like precision.

*   **Display & Headlines:** Use `display-lg` and `headline-lg` with tight letter-spacing (-0.02em). These are the "Executive" levels, meant to convey high-level portfolio health or market shifts at a glance.
*   **The Technical Core:** `title-sm` and `body-md` are the workhorses of the ledger. They should be set with generous line heights (1.5x) to ensure that rows of numbers do not bleed into one another.
*   **Labels:** Use `label-sm` in `on_surface_variant` (#45464d) for metadata. This "Slate Gray" ensures that while the information is present, it does not compete with the primary data (`on_surface`).

---

## 4. Elevation & Depth: Tonal Layering
In this design system, we do not "drop shadows"; we "layer light."

*   **The Layering Principle:** Depth is achieved by stacking. A `surface_container_highest` element should only ever sit atop a `surface_container_low` or `surface` base. 
*   **Ambient Shadows:** For floating modals or dropdowns, use a "Deep Ambient" shadow: `0px 24px 48px rgba(15, 23, 42, 0.08)`. The shadow is tinted with our Deep Navy primary color, ensuring it looks like a natural atmospheric occlusion rather than a grey smudge.
*   **The "Ghost Border" Fallback:** If a container requires a boundary (e.g., inside a dense data table), use a "Ghost Border": `outline_variant` (#c6c6cd) at **15% opacity**. It should be felt, not seen.
*   **Architectural Glass:** For persistent headers, use `surface` at 80% opacity with a `20px` backdrop-blur. This keeps the user grounded in the "Ledger" while they scroll through deep data sets.

---

## 5. Components: The Modular Primitives

### Buttons
*   **Primary:** Rectangular, `0px` radius. Background: `primary_container`. Text: `on_primary`. 
*   **Secondary:** Ghost style. No background. `Ghost Border` (15% opacity `outline_variant`). 
*   **Interaction:** On hover, primary buttons should shift to `on_primary_fixed_variant` with a transition of 200ms.

### The Ledger Card (Modular Container)
*   **Style:** `0px` border-radius (Strictly).
*   **Background:** `surface_container_lowest`.
*   **Padding:** Use `spacing.6` (2rem) for internal padding to ensure "Data Density" never feels "Crowded."
*   **Separation:** Forbid the use of horizontal divider lines between cards. Use `spacing.8` (2.75rem) vertical gaps.

### Data Indicators (Chips)
*   **Positive:** `on_tertiary_container` (#49935c) text on a transparent background. 
*   **Negative:** `error` (#ba1a1a) text on a transparent background.
*   **Visual Rule:** Never use background "pills" for data indicators; use typography and a small 4x4px square "indicator dot" to maintain the architectural feel.

### Input Fields
*   **State:** Underline-only style. Use `outline` (#76777d) for the bottom border (1px). 
*   **Focus:** Transition the bottom border to `primary_container` (2px thickness). No "glow" or outer rings.

---

## 6. Do's and Don'ts

### Do
*   **Do** use `0px` border-radius for every single element. Roundness undermines the "Architectural" intent.
*   **Do** prioritize "Tonal Shifts" over lines. If you need to separate two sections, change the background color from `surface` to `surface_container_low`.
*   **Do** align all numerical data to a tabular-nums font setting to ensure decimal points align perfectly in columns.

### Don't
*   **Don't** use icons as decorative elements. Icons must only be used if they represent a functional action (e.g., Download, Filter).
*   **Don't** use standard "drop shadows" (e.g., #000000 25%). They look "cheap" in an institutional context.
*   **Don't** use more than three levels of hierarchy in a single view. If a page feels complex, increase the `spacing` scale rather than adding more borders or boxes.