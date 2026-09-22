# The Study Space Index

The Study Space Index is an interactive decision tool for comparing Harvard Library study spaces. It helps students answer a practical question—**where should I study for the task I need to do?**—and helps library teams see where facility information, equipment documentation, and service planning could improve.

The project uses official Harvard Library facility records rather than student reviews. Its “fit score” is therefore a transparent, task-specific model of published space features, not a popularity or satisfaction rating.

## Submission links

| Deliverable | Link |
| --- | --- |
| Published interactive site | [Open the Study Space Index](https://harvard-study-space-index.yikecheng452748.chatgpt.site) |
| Five-minute video demonstration | [Watch the recorded walkthrough](https://drive.google.com/file/d/1ojhMaeQlSUmwyEYW0pGi79q5QNyCQYWf/view?usp=sharing) |
| Collected dataset (CSV) | [Download 103 rows × 45 variables](https://harvard-study-space-index.yikecheng452748.chatgpt.site/harvard-study-spaces.csv) |
| Collected dataset (JSON) | [Download the structured data](https://harvard-study-space-index.yikecheng452748.chatgpt.site/harvard-study-spaces.json) |
| One-page data and methodology note | [Read the methodology](https://harvard-study-space-index.yikecheng452748.chatgpt.site/methods.html) |
| Five-minute presentation deck | [Open the interactive presentation](https://harvard-study-space-index.yikecheng452748.chatgpt.site/presentation.html) |
| Reflection | [Read what the evidence supports and cannot prove](https://harvard-study-space-index.yikecheng452748.chatgpt.site/reflection.html) |

**Challenge area:** School facilities and student experience

**Course deliverable:** Student Data-to-Site Challenge, Problem Set 01

## The decision problem

Harvard publishes useful information about study spaces, but students still have to compare many separate records and translate facility descriptions into a decision. A space that works well for silent individual work may be a poor choice for a group presentation, while a comfortable social space may not provide the privacy or technology needed for focused work.

The primary users are Harvard students choosing a study environment. A secondary audience is Harvard Library staff deciding which records need better documentation and where facility or service improvements deserve closer investigation.

The tool is designed to support three decisions:

1. **Student choice:** identify spaces that match a task, capacity need, and required amenities.
2. **Space comparison:** inspect trade-offs among quiet, collaboration, technology, comfort, accessibility, and capacity.
3. **Facilities planning:** locate gaps in published metadata and identify questions that should be checked before resources are committed.

## What the site includes

- Four starting presets: **Deep-focus**, **Group-work**, **Make-and-present**, and **Comfort-break**.
- Eight visible scoring priorities that users can adjust to create a custom ranking.
- Filters for library, room type, noise level, minimum capacity, accessibility, reservability, food or café access, and keyword search.
- A current best-fit recommendation plus three runner-up spaces.
- Side-by-side comparison for up to three spaces.
- A ranked fit-score chart, amenity-coverage indicators, a quiet-versus-collaboration plot, and a library comparison table.
- A complete sortable table containing all 103 official records and links back to their Harvard Library source pages.
- Decision findings, recommendations, methodology, limitations, downloadable data, reflection, presentation, and video links.
- A responsive layout for computers and phones, with keyboard-friendly native controls and descriptive labels.

## Dataset at a glance

The analysis uses a reproducible snapshot collected on **21 September 2026**.

| Measure | Value |
| --- | ---: |
| Study-space records | 103 |
| Harvard libraries represented | 13 |
| Published seats | 2,098 |
| Analysis-ready variables | 45 |
| Expanded amenity indicators | 19 |
| Official room types | 6 |
| Records missing a seat value | 1 |

This is a census of the records returned by Harvard Library’s public space-finder API at collection time, not a hand-selected sample. It is not a census of every possible Harvard study location: spaces absent from the public directory remain outside the dataset.

## Main findings

### 1. Capacity is concentrated

Lamont Library lists 543 seats and Widener Library lists 449. Together, those two libraries account for **992 of 2,098 seats, or 47.3% of all published capacity** in the dataset. Disruption, renovation, or access changes at either library could therefore affect system-wide capacity disproportionately.

### 2. The directory contains more conversation-friendly than quiet records

The official noise labels divide the records into:

- 23 Silent spaces;
- 22 Whispers spaces; and
- 58 Chatter spaces.

Only 45 records are Silent or Whispers, compared with 58 marked Chatter. Clear online and in-building noise labels can help students avoid choosing an environment that conflicts with their work.

### 3. Reservability and collaboration equipment are not universal

- 45 of 103 records are marked reservable.
- 32 list a projector or digital display.
- 27 list a whiteboard or chalkboard.
- 29 list charging stations.

These differences are large enough to change a recommendation for group work or presentation preparation. They also reveal where a metadata audit should happen before equipment purchases are proposed.

### 4. Published accessibility information is incomplete as an experience measure

Forty-eight records explicitly list wheelchair or mobility-device accessibility. That does **not** mean the remaining 55 spaces are inaccessible; it means the feature is not listed in those room records. This distinction is important throughout the project: a zero in an amenity field means “not listed,” not “confirmed absent.”

## Recommendations for school and library leaders

1. **Protect the high-capacity core.** Coordinate major closures and service interruptions at Lamont and Widener, and publish alternatives before disruptions begin. A useful measure is the number of replacement seats identified for each planned closure.

2. **Standardize the space directory.** Require the same core fields for every record: capacity, noise, accessibility, power, reservation status, equipment, and eligibility. Unknown values should be labeled explicitly rather than left ambiguous. A practical target is at least **95% completion** for the core fields.

3. **Verify collaboration rooms before buying equipment.** Audit reservable group and presentation spaces to separate true equipment gaps from missing documentation. Prioritize upgrades only after confirming which rooms lack displays, whiteboards, webcams, or charging.

4. **Add privacy-preserving demand evidence.** Pair the inventory with anonymous occupied-seat counts by broad time block and a short optional survey about space type and feature priorities. This would help distinguish what is published, what physically exists, what students use, and what students prefer.

## Data sources

All source data came from Harvard Library’s public services:

- [Harvard Library Find a Space](https://library.harvard.edu/spaces) — public room interface and individual source pages.
- [Rooms API](https://library.harvard.edu/api/v1/rooms?_format=json) — the 103 room records used as the unit of analysis.
- [Library metadata API](https://library.harvard.edu/api/v1/library/rooms?_format=json) — library names, units, locations, links, and snapshot hours.
- [Amenities taxonomy](https://library.harvard.edu/api/v1/taxonomy/amenities?_format=json) — official amenity labels.
- [Room-type taxonomy](https://library.harvard.edu/api/v1/taxonomy/room_types?_format=json) — official space-type categories.

The original API responses are preserved in [`data/`](data/), so the processed files can be traced back to the public records used for this submission.

## Collection and processing

The processing script in [`scripts/build-data.mjs`](scripts/build-data.mjs) performs the following steps:

1. Reads the saved rooms, libraries, amenity-taxonomy, and room-type-taxonomy responses.
2. Uses the room record as the unit of analysis and joins library metadata by library ID.
3. Removes HTML from narrative descriptions and normalizes whitespace.
4. Maps Harvard’s noise codes to readable labels: `0 = Silent`, `1 = Whispers`, and `2 = Chatter`.
5. Expands 19 listed amenities into binary indicator columns.
6. Adds capacity, booking, images, coordinates, address, source URL, and access-date fields.
7. Sorts records by library and space name.
8. Exports the analysis-ready CSV, structured JSON, and browser data file used by the dashboard.

The published outputs are:

- [`dist/harvard-study-spaces.csv`](dist/harvard-study-spaces.csv)
- [`dist/harvard-study-spaces.json`](dist/harvard-study-spaces.json)
- [`dist/data.js`](dist/data.js)

## Variable groups and definitions

| Field group | Unit | Meaning |
| --- | --- | --- |
| Identity and location | Text / coordinates | Space ID and name, library ID and name, school or unit, floor, address, latitude, and longitude. |
| Type and capacity | Category / seats | One of six official room types and the published number of seats. |
| Noise | Code / category | Official codes translated to Silent, Whispers, or Chatter. |
| Availability | Binary / URL | Reservable flag, open-space flag, booking URL, contact availability, and snapshot library hours. |
| Amenities | 19 binary fields | Whether each amenity was explicitly listed in the source record. |
| Description and images | Text / URL / count | Cleaned description, notes, first image URL, and image count. |
| Provenance | URL / date | Room source page, library page, and collection date. |
| Fit score | 0–100 model points | A browser-calculated weighted average of eight derived signals; not an observed rating. |

## Fit-score methodology

For each room, published fields are translated into eight signals from 0 to 100. Signal values are capped at 100.

| Signal | Transformation from source fields |
| --- | --- |
| Quiet | Silent = 100, Whispers = 65, Chatter = 10. A listed quiet-study-area amenity sets a minimum of 90. |
| Privacy | Private desks add 65; a Study Carrel or Independent Study Room adds 35. |
| Collaboration | Group or meeting room type adds 20; whiteboard 25; display 20; webcam 15; conversation area 10; at least six seats 10. |
| Technology | Display adds 30; technology loan 30; webcam 20; charging 15; media/presentation room type 5. |
| Reservability | 100 when the official room record is reservable; otherwise 0. |
| Comfort | Couches add 25; food allowed 20; café 20; charging 15; open-space flag 10; standing desks 5; at least 20 seats 5. |
| Accessibility | 100 when accessibility is explicitly listed; otherwise 0. |
| Capacity | 0 when no seats are listed; 25 for 1–3 seats; 40 for 4–5; 55 for 6–9; 70 for 10–19; 85 for 20–49; 100 for 50 or more. |

The final result is:

> **Fit score = Σ(signal × selected weight) ÷ Σ(selected weights)**

The result is rounded to a whole number. When users move a slider, the dashboard normalizes the selected weights automatically. A higher score means stronger alignment with the selected priorities based on documented features; it does not mean higher student satisfaction.

### Preset weights

| Preset | Quiet | Privacy | Collaboration | Technology | Reservation | Comfort | Access | Capacity |
| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: | ---: |
| Deep-focus | 30% | 25% | 0% | 5% | 10% | 5% | 15% | 10% |
| Group-work | 5% | 0% | 30% | 20% | 20% | 5% | 10% | 10% |
| Make-and-present | 0% | 0% | 20% | 35% | 15% | 10% | 10% | 10% |
| Comfort-break | 10% | 5% | 0% | 5% | 0% | 35% | 25% | 20% |

These weights are explicit analytic choices made for exploration. They are not Harvard policy and were not estimated from a student survey.

## Suggested demonstration flow

1. Introduce the decision problem and the four task presets.
2. Select a preset and show how the recommended space changes.
3. Apply filters such as library, noise, minimum seats, accessibility, or reservability.
4. Move one or two priority sliders and point out that every ranking and chart updates.
5. Compare up to three spaces and discuss the underlying signals, not only the total score.
6. Review the facility-coverage chart and library table.
7. Show the complete record table and follow one source link back to Harvard Library.
8. Finish with the recommendations, methodology, and limitations.

## What the evidence supports

The data supports comparison of documented facility characteristics, examination of published capacity and amenity coverage, task-specific ranking under visible assumptions, and prioritization of metadata or service questions for follow-up.

It can also reveal system-level patterns—for example, the concentration of listed seating capacity and the uneven documentation of equipment—but these patterns should be treated as planning signals rather than proof of student outcomes.

## What the evidence cannot prove

- Which study space students like most.
- How crowded a room will be at a specific time.
- Whether an unlisted feature is physically absent.
- Whether every Harvard study environment appears in the public directory.
- Whether all students are eligible to enter a listed building or reserve a room.
- Whether adding an amenity will improve grades, wellbeing, or library use.
- Whether the preset weights represent student preferences.

## Limitations and uncertainty

- **Coverage boundary:** classrooms, residential spaces, cafés, outdoor areas, and other locations absent from the API are outside the analysis.
- **Documentation bias:** spaces with more complete records can receive higher scores even when another room has the same undocumented features.
- **No live demand:** the data contains designed capacity, not occupancy, queues, reservations, or turnaways.
- **No satisfaction survey:** the fit score is a model and should not be described as a student rating.
- **Access ambiguity:** eligibility, hours, special-collection rules, and booking requirements vary by space.
- **Time sensitivity:** hours, equipment, construction, and room status can change after the snapshot date.
- **Unmeasured experience:** light, temperature, atmosphere, proximity, safety perception, and seat quality are not consistently available.
- **Value judgments:** the presets encode a chosen interpretation of four study goals.

Before visiting, users should confirm current hours, access rules, equipment, and booking status through the linked Harvard Library page.

## Privacy and ethics

The project uses only non-personal public facility information. It does not collect names, contact details, medical information, precise personal locations, browsing histories, or individual behavior. Future occupancy research should use anonymous totals and broad time blocks rather than tracking individuals.

## Repository guide

```text
.
├── data/                     Saved official API snapshots
├── dist/                     Published static site and downloadable datasets
│   ├── index.html            Interactive dashboard
│   ├── methods.html          Data and methodology note
│   ├── presentation.html     Five-minute presentation
│   ├── reflection.html       Evidence reflection
│   ├── app.js                Filtering, scoring, charts, and comparison logic
│   └── harvard-study-spaces.csv
├── scripts/
│   └── build-data.mjs        Reproducible data-processing script
├── .openai/hosting.json      Site hosting configuration
└── README.md                 Project documentation
```

## Run locally

The published project is a static website and requires no installation. From the repository root, run:

```bash
python3 -m http.server 4173 --directory dist
```

Then open `http://127.0.0.1:4173/`.

To regenerate the processed files from the saved source snapshots, use a recent version of Node.js:

```bash
node scripts/build-data.mjs
```

## Snapshot audit

The final dataset was checked for the following internal totals:

- 103 records across 13 libraries;
- 2,098 listed seats;
- 23 Silent, 22 Whispers, and 58 Chatter records;
- 43 Open Spaces, 37 Group Study Rooms, 7 Media Labs or Studios, 6 Meeting and Presentation Spaces, 5 Independent Study Rooms, and 5 Study Carrels;
- one record with a missing seat value; and
- source URL and access-date fields included for record-level traceability.

The Study Space Index should be read as a transparent decision aid and facilities-data audit—not as a definitive ranking of student experience.
