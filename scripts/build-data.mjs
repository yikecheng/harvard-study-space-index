import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, '..');
const sourceDir = path.join(root, 'data');
const outDir = path.join(root, 'dist');

const roomsPayload = JSON.parse(fs.readFileSync(path.join(sourceDir, 'rooms-source.json'), 'utf8'));
const libraries = JSON.parse(fs.readFileSync(path.join(sourceDir, 'library-rooms-source.json'), 'utf8'));
const libraryById = new Map(libraries.map(library => [String(library.id), library]));

const amenityFields = {
  'Cafe onsite': 'cafe',
  'Charging stations': 'charging',
  'Conversation areas': 'conversation',
  'Couches / arm chairs': 'couches',
  'Food and drink allowed': 'food',
  'Lockers': 'lockers',
  'Media studios': 'mediaStudios',
  'Printers / scanners / copiers': 'printers',
  'Private desks': 'privateDesks',
  'Projector / digital display': 'display',
  'Quiet study areas': 'quietAmenity',
  'Reservable space': 'reservableAmenity',
  'Single stall restrooms': 'singleStallRestrooms',
  'Special collections and archives': 'specialCollections',
  'Standing desks': 'standingDesks',
  'Tech loan': 'techLoan',
  'Webcam': 'webcam',
  'Wheelchair / mobility device accessible': 'accessible',
  'Whiteboards / chalkboards': 'whiteboards'
};

const noiseLabels = {'0': 'Silent', '1': 'Whispers', '2': 'Chatter'};
const sourceDate = '2026-09-21';
const sourceBase = 'https://library.harvard.edu/spaces';

const cleanText = value => String(value ?? '')
  .replace(/<[^>]*>/g, ' ')
  .replace(/&nbsp;/g, ' ')
  .replace(/&amp;/g, '&')
  .replace(/&#39;/g, "'")
  .replace(/&quot;/g, '"')
  .replace(/\s+/g, ' ')
  .trim();

const records = roomsPayload.results.items.map(room => {
  const library = libraryById.get(String(room.library)) || {};
  const featureNames = (room.features || []).map(feature => feature.name);
  const featureSet = new Set(featureNames);
  const amenities = Object.fromEntries(
    Object.entries(amenityFields).map(([label, field]) => [field, featureSet.has(label) ? 1 : 0])
  );
  const seats = Number.parseInt(room.seats, 10);
  const address = library.address || {};
  const cityLine = [address.locality, address.administrative_area, address.postal_code].filter(Boolean).join(', ');
  return {
    id: String(room.id),
    name: cleanText(room.name),
    libraryId: String(room.library),
    library: cleanText(library.name || `Library ${room.library}`),
    schoolOrUnit: cleanText(library.subTitle),
    level: cleanText(room.floor) || 'Not listed',
    type: cleanText(room.room_type) || 'Not listed',
    seats: Number.isFinite(seats) ? seats : null,
    noiseCode: String(room.noise_level ?? ''),
    noise: noiseLabels[String(room.noise_level)] || 'Not listed',
    reservable: room.reservable ? 1 : 0,
    openSpace: room.open_space ? 1 : 0,
    bookingUrl: room.booking_link || '',
    contactAvailable: room.contact ? 1 : 0,
    description: cleanText(room.description),
    notes: cleanText(room.what_you_need_to_know),
    ...amenities,
    featureCount: featureNames.length,
    features: featureNames,
    latitude: room.coordinates?.latitude ?? library.coordinates?.latitude ?? null,
    longitude: room.coordinates?.longitude ?? library.coordinates?.longitude ?? null,
    libraryAddress: [address.address_line1, cityLine].filter(Boolean).join(', '),
    snapshotHours: cleanText(library.today_hours?.rendered || library.times?.rendered),
    libraryUrl: library.href || '',
    sourceUrl: `${sourceBase}?room=${room.id}`,
    accessedDate: sourceDate
  };
}).sort((a, b) => a.library.localeCompare(b.library) || a.name.localeCompare(b.name));

const csvFields = [
  ['space_id', 'id'], ['space_name', 'name'], ['library_id', 'libraryId'], ['library', 'library'],
  ['school_or_unit', 'schoolOrUnit'], ['floor', 'level'], ['room_type', 'type'], ['seats', 'seats'],
  ['noise_level_code', 'noiseCode'], ['noise_level', 'noise'], ['reservable', 'reservable'],
  ['open_space', 'openSpace'], ['booking_url', 'bookingUrl'], ['contact_available', 'contactAvailable'],
  ['description', 'description'], ['notes', 'notes'], ['accessible', 'accessible'], ['charging', 'charging'],
  ['cafe_onsite', 'cafe'], ['conversation_areas', 'conversation'], ['couches_arm_chairs', 'couches'],
  ['food_drink_allowed', 'food'], ['lockers', 'lockers'], ['media_studios', 'mediaStudios'],
  ['printers_scanners_copiers', 'printers'], ['private_desks', 'privateDesks'],
  ['projector_digital_display', 'display'], ['quiet_study_areas', 'quietAmenity'],
  ['reservable_space_amenity', 'reservableAmenity'], ['single_stall_restrooms', 'singleStallRestrooms'],
  ['special_collections_archives', 'specialCollections'], ['standing_desks', 'standingDesks'],
  ['tech_loan', 'techLoan'], ['webcam', 'webcam'], ['whiteboards_chalkboards', 'whiteboards'],
  ['feature_count', 'featureCount'], ['latitude', 'latitude'], ['longitude', 'longitude'],
  ['library_address', 'libraryAddress'], ['snapshot_hours', 'snapshotHours'], ['library_url', 'libraryUrl'],
  ['source_url', 'sourceUrl'], ['accessed_date', 'accessedDate']
];

const csvCell = value => {
  if (value === null || value === undefined) return '';
  const text = String(value);
  return /[",\n\r]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
};

const csv = [
  csvFields.map(([header]) => header).join(','),
  ...records.map(record => csvFields.map(([, key]) => csvCell(record[key])).join(','))
].join('\n') + '\n';

const meta = {
  source: sourceBase,
  accessedDate: sourceDate,
  totalRecords: records.length,
  totalLibraries: new Set(records.map(record => record.library)).size,
  totalListedSeats: records.reduce((sum, record) => sum + (record.seats || 0), 0),
  note: 'A 0 in an amenity field means the feature was not listed in the source record; it does not prove absence.'
};

fs.writeFileSync(path.join(outDir, 'harvard-study-spaces.csv'), csv);
fs.writeFileSync(path.join(outDir, 'harvard-study-spaces.json'), JSON.stringify({meta, records}, null, 2) + '\n');
fs.writeFileSync(path.join(outDir, 'data.js'), `window.DATA_META = ${JSON.stringify(meta)};\nwindow.SPACE_DATA = ${JSON.stringify(records)};\n`);

console.log(JSON.stringify(meta, null, 2));
