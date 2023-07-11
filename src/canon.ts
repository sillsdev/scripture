/**
 * Partially converted from
 * https://github.com/sillsdev/libpalaso/blob/master/SIL.Scripture/Canon.cs
 */

type BookNumbers = Record<string, number>;

/**
 * Array of all book IDs.
 *  BE SURE TO UPDATE ISCANONICAL above whenever you change this array.
 */
export const allBookIds: string[] = [
  'GEN',
  'EXO',
  'LEV',
  'NUM',
  'DEU',
  'JOS',
  'JDG',
  'RUT',
  '1SA',
  '2SA', // 10

  '1KI',
  '2KI',
  '1CH',
  '2CH',
  'EZR',
  'NEH',
  'EST',
  'JOB',
  'PSA',
  'PRO', // 20

  'ECC',
  'SNG',
  'ISA',
  'JER',
  'LAM',
  'EZK',
  'DAN',
  'HOS',
  'JOL',
  'AMO', // 30

  'OBA',
  'JON',
  'MIC',
  'NAM',
  'HAB',
  'ZEP',
  'HAG',
  'ZEC',
  'MAL',
  'MAT', // 40

  'MRK',
  'LUK',
  'JHN',
  'ACT',
  'ROM',
  '1CO',
  '2CO',
  'GAL',
  'EPH',
  'PHP', // 50

  'COL',
  '1TH',
  '2TH',
  '1TI',
  '2TI',
  'TIT',
  'PHM',
  'HEB',
  'JAS',
  '1PE', // 60

  '2PE',
  '1JN',
  '2JN',
  '3JN',
  'JUD',
  'REV',
  'TOB',
  'JDT',
  'ESG',
  'WIS', // 70

  'SIR',
  'BAR',
  'LJE',
  'S3Y',
  'SUS',
  'BEL',
  '1MA',
  '2MA',
  '3MA',
  '4MA', // 80

  '1ES',
  '2ES',
  'MAN',
  'PS2',
  'ODA',
  'PSS',
  'JSA', // actual variant text for JOS, now in LXA text
  'JDB', // actual variant text for JDG, now in LXA text
  'TBS', // actual variant text for TOB, now in LXA text
  'SST', // actual variant text for SUS, now in LXA text // 90

  'DNT', // actual variant text for DAN, now in LXA text
  'BLT', // actual variant text for BEL, now in LXA text
  'XXA',
  'XXB',
  'XXC',
  'XXD',
  'XXE',
  'XXF',
  'XXG',
  'FRT', // 100

  'BAK',
  'OTH',
  '3ES', // Used previously but really should be 2ES
  'EZA', // Used to be called 4ES, but not actually in any known project
  '5EZ', // Used to be called 5ES, but not actually in any known project
  '6EZ', // Used to be called 6ES, but not actually in any known project
  'INT',
  'CNC',
  'GLO',
  'TDX', // 110

  'NDX',
  'DAG',
  'PS3',
  '2BA',
  'LBA',
  'JUB',
  'ENO',
  '1MQ',
  '2MQ',
  '3MQ', // 120

  'REP',
  '4BA',
  'LAO',
];

/** Array of all non-canonical book IDs. */
export const nonCanonicalIds: string[] = [
  'XXA',
  'XXB',
  'XXC',
  'XXD',
  'XXE',
  'XXF',
  'XXG',
  'FRT',
  'BAK',
  'OTH',
  'INT',
  'CNC',
  'GLO',
  'TDX',
  'NDX',
];

export const firstBook = 1;
export const lastBook = allBookIds.length;

/** Array of the English names of all books. */
const allBookEnglishNames: string[] = [
  'Genesis',
  'Exodus',
  'Leviticus',
  'Numbers',
  'Deuteronomy',
  'Joshua',
  'Judges',
  'Ruth',
  '1 Samuel',
  '2 Samuel',

  '1 Kings',
  '2 Kings',
  '1 Chronicles',
  '2 Chronicles',
  'Ezra',
  'Nehemiah',
  'Esther (Hebrew)',
  'Job',
  'Psalms',
  'Proverbs',

  'Ecclesiastes',
  'Song of Songs',
  'Isaiah',
  'Jeremiah',
  'Lamentations',
  'Ezekiel',
  'Daniel (Hebrew)',
  'Hosea',
  'Joel',
  'Amos',

  'Obadiah',
  'Jonah',
  'Micah',
  'Nahum',
  'Habakkuk',
  'Zephaniah',
  'Haggai',
  'Zechariah',
  'Malachi',
  'Matthew',

  'Mark',
  'Luke',
  'John',
  'Acts',
  'Romans',
  '1 Corinthians',
  '2 Corinthians',
  'Galatians',
  'Ephesians',
  'Philippians',

  'Colossians',
  '1 Thessalonians',
  '2 Thessalonians',
  '1 Timothy',
  '2 Timothy',
  'Titus',
  'Philemon',
  'Hebrews',
  'James',
  '1 Peter',

  '2 Peter',
  '1 John',
  '2 John',
  '3 John',
  'Jude',
  'Revelation',
  'Tobit',
  'Judith',
  'Esther Greek',
  'Wisdom of Solomon',

  'Sirach (Ecclesiasticus)',
  'Baruch',
  'Letter of Jeremiah',
  'Song of 3 Young Men',
  'Susanna',
  'Bel and the Dragon',
  '1 Maccabees',
  '2 Maccabees',
  '3 Maccabees',
  '4 Maccabees',

  '1 Esdras (Greek)',
  '2 Esdras (Latin)',
  'Prayer of Manasseh',
  'Psalm 151',
  'Odes',
  'Psalms of Solomon',
  // WARNING, if you change the spelling of the *obsolete* tag be sure to update
  // IsObsolete routine
  'Joshua A. *obsolete*',
  'Judges B. *obsolete*',
  'Tobit S. *obsolete*',
  'Susanna Th. *obsolete*',

  'Daniel Th. *obsolete*',
  'Bel Th. *obsolete*',
  'Extra A',
  'Extra B',
  'Extra C',
  'Extra D',
  'Extra E',
  'Extra F',
  'Extra G',
  'Front Matter',

  'Back Matter',
  'Other Matter',
  '3 Ezra *obsolete*',
  'Apocalypse of Ezra',
  '5 Ezra (Latin Prologue)',
  '6 Ezra (Latin Epilogue)',
  'Introduction',
  'Concordance ',
  'Glossary ',
  'Topical Index',

  'Names Index',
  'Daniel Greek',
  'Psalms 152-155',
  '2 Baruch (Apocalypse)',
  'Letter of Baruch',
  'Jubilees',
  'Enoch',
  '1 Meqabyan',
  '2 Meqabyan',
  '3 Meqabyan',
  'Reproof (Proverbs 25-31)',

  '4 Baruch (Rest of Baruch)',
  'Laodiceans',
];

// Used for fast look up of book IDs to the book number.
const bookNumbers: BookNumbers = createBookNumbers();

/**
 * Gets the 1-based number of the specified book.
 * This is a fairly performance-critical method.
 * @param id - 3-letter book ID, e.g. `'MAT'`.
 * @param ignoreCase - should case be ignored. Defaults to `true`.
 * @returns book number, or 0 if ID doesn't exist.
 */
export function bookIdToNumber(id: string, ignoreCase = true): number {
  if (ignoreCase) {
    id = id.toUpperCase();
  }
  if (!(id in bookNumbers)) {
    return 0;
  }
  return bookNumbers[id];
}

/**
 * Gets the ID of a book from its book number.
 * @param number - Book number (this is 1-based, not an index).
 * @param errorValue - The string to return if the book number does not correspond to a valid book.
 * Defaults to `'***'`.
 * @returns The 3-letter `bookId` if found, or the `errorValue` otherwise.
 */
export function bookNumberToId(number: number, errorValue = '***'): string {
  const index: number = number - 1;

  if (index < 0 || index >= allBookIds.length) {
    return errorValue;
  }

  return allBookIds[index];
}

/**
 * Gets the English book name from its book number.
 * @param number - Book number (this is 1-based, not an index).
 * @returns The English name of the book if found, or `'******'` otherwise.
 */
export function bookNumberToEnglishName(number: number): string {
  if (number <= 0 || number > lastBook) {
    return '******';
  }

  return allBookEnglishNames[number - 1];
}

/**
 * Gets the English book name from its book ID.
 * @param id - 3-letter book ID, e.g. `'MAT'`.
 * @returns The English name of the book if found, or `'******'` otherwise.
 */
export function bookIdToEnglishName(id: string): string {
  return bookNumberToEnglishName(bookIdToNumber(id));
}

/**
 *
 * @param bookNum - Book number (this is 1-based, not an index).
 * @returns `true` if the book is obsolete, or `false` otherwise.
 */
export function isObsolete(bookNum: number): boolean {
  const name: string = allBookEnglishNames[bookNum - 1];
  return name.includes('*obsolete*');
}

function createBookNumbers(): BookNumbers {
  const bookNumbers: BookNumbers = {};
  for (let i = 0; i < allBookIds.length; i++) {
    bookNumbers[allBookIds[i]] = i + 1;
  }
  return bookNumbers;
}

/**
 * Canon information. Also, contains static information on complete list of books and localization.
 */
export const Canon = {
  allBookIds,
  nonCanonicalIds,
  firstBook,
  lastBook,
  bookIdToNumber,
  bookNumberToId,
  bookNumberToEnglishName,
  bookIdToEnglishName,
  isObsolete,
};
export default Canon;
