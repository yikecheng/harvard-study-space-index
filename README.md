# The Study Space Index

An interactive decision tool for Harvard students choosing a place to study and library teams deciding what facility information or services to improve.

- **Live site:** https://harvard-study-space-index.yikecheng452748.chatgpt.site
- **GitHub repository:** https://github.com/yikecheng/harvard-study-space-index
- **Five-minute video:** https://drive.google.com/file/d/1ojhMaeQlSUmwyEYW0pGi79q5QNyCQYWf/view?usp=sharing
- **Topic:** School facilities and student experience
- **Course deliverable:** Student Data-to-Site Challenge, Problem Set 01

## What the project does

The site compares every record returned by Harvard Library's public space-finder API. Students can:

- choose a task preset for deep focus, group work, making and presenting, or a comfort break;
- adjust eight visible scoring priorities;
- filter by library, room type, noise, capacity, accessibility, reservability, and food;
- compare up to three study spaces side by side; and
- inspect charts, library-level evidence, recommendations, and all underlying records.

The fit score is a transparent model of published facility information. It is not a student satisfaction rating.

## Dataset

- 103 study-space records
- 13 represented Harvard libraries
- 2,098 listed seats
- 45 analysis-ready variables
- 19 expanded amenity indicators
- Collected 21 September 2026

The downloadable files are in `dist/harvard-study-spaces.csv` and `dist/harvard-study-spaces.json`. Original API snapshots are preserved in `data/`, and `scripts/build-data.mjs` rebuilds the analysis files.

## Official sources

- [Harvard Library Find a Space](https://library.harvard.edu/spaces)
- [Rooms API](https://library.harvard.edu/api/v1/rooms?_format=json)
- [Library metadata API](https://library.harvard.edu/api/v1/library/rooms?_format=json)
- [Amenities taxonomy](https://library.harvard.edu/api/v1/taxonomy/amenities?_format=json)
- [Room-type taxonomy](https://library.harvard.edu/api/v1/taxonomy/room_types?_format=json)

## Required submission materials

All deliverables are linked from the site's **Submission Pack** section:

- published interactive site;
- collected CSV and JSON datasets;
- one-page data and methodology note;
- five-minute presentation and recorded demonstration; and
- reflection explaining what the data supports and cannot prove.

## Run locally

This is a static website with no installation step. Serve the `dist` directory with any local web server, for example:

```bash
python3 -m http.server 4173 --directory dist
```

Then open `http://127.0.0.1:4173/`.

## Limitations

The directory is not an occupancy or satisfaction dataset. Capacity does not measure real-time availability, richer records may score better because more amenities are documented, and rooms outside the public API are not represented. A zero in an amenity field means “not listed,” not “confirmed absent.” Current hours, eligibility, equipment, and booking rules should be checked with Harvard Library.

No names, contact details, medical information, precise personal locations, or behavioral histories were collected.
