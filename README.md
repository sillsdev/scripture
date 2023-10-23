# scripture

<div align="center">

[![Build Status][github-actions-status]][github-actions-url]
[![CodeQL][gitghub-codeql-status]][gitghub-codeql-url]
[![codecov][github-codecov-status]][github-codecov-url]
[![Github Tag][github-tag-image]][github-tag-url]

</div>

TypeScript partial port of the C# library [libpalaso/SIL.Scripture][github-libpalaso-scripture]. These libraries are used by [Paratext](https://paratext.org/) and provides classes for working with Scripture data such as references and versifications.

v1 is a minimal partial port in TypeScript that supports use on the frontend while still using the full C# version on the backend.

## Features

- {object} Canon - Canon information. Also, contains static information on complete list of books.
- {class} VerseRef - Stores a reference to a specific verse in Scripture.
  - Represents a single reference, e.g. `'GEN 2:3'`.
  - Represents a reference range, e.g. `'LUK 3:4-5'`.
  - Represents a reference sequence, e.g. `'GEN 1:1-3,5'`.
  - Represents a reference with a segment, e.g. `'LUK 3:4b'`.
  - Validate references.
  - Supports versification types: Unknown, Original, Septuagint, Vulgate, English, RussianProtestant, RussianOrthodox.

## Installation

```sh
npm install @sillsdev/scripture
```

## Usage

### VerseRef

There are lots of options to construct a `VerseRef`. If an appropriate versification is not supplied, a default one will be used (defaults to English):

```typescript
import { ScrVers, VerseRef } from '@sillsdev/scripture';

// construct from book, chapter and verse numbers (with specific versification)
let verseRef = new VerseRef(1, 2, 3, ScrVers.Septuagint);
console.log(verseRef.valid); // true

// construct from book, chapter and verse strings (default versification)
verseRef = new VerseRef('LUK', '3', '4b-5a');
console.log(verseRef.versification); // VerseRef.defaultVersification (ScrVers.English)

// construct from a single verse string (with range and segments)
verseRef = new VerseRef('LUK 3:4b-5a');
console.log(verseRef.chapterNum); // 3
console.log(verseRef.verse); // '4b-5a'
console.log(verseRef.verseNum); // 4

// construct from a bbbcccvvv number
verseRef = new VerseRef(42003004);
console.log(verseRef.bookNum); // 42
console.log(verseRef.chapterNum); // 3
console.log(verseRef.verseNum); // 4

// construct from an existing VerseRef
verseRef = new VerseRef(verseRef);
console.log(verseRef.book); // 'LUK'
console.log(verseRef.bookNum); // 42
console.log(verseRef.chapter); // '3'

// construct an empty VerseRef
verseRef = new VerseRef();
```

`VerseRef` can be used to validate a reference, such as with user form validation:

```typescript
import { ScrVers, VerseRef } from '@sillsdev/scripture';

function isVerseReferenceValid(verseStr: string): boolean {
  const { verseRef } = VerseRef.tryParse(verseStr);
  return verseRef.valid;
}

console.log(isVerseReferenceValid('NOOB 200:300')); // false
console.log(isVerseReferenceValid('GEN 2:3')); // true
console.log(isVerseReferenceValid('LUK 3:4b-5a')); // true
```

Useful properties:

- `book: string` - 3-letter book ID (abbreviation in capital letters), e.g. `'LUK'`
- `chapter: string` - chapter of the reference, e.g. `'3'`
- `verse: string` - verse of the reference, including range, segments, and sequences, e.g. `'4'`, or `'4b-5a, 7'`
- `bookNum: number` - book number, e.g. `42`
- `chapterNum: number` - chapter number e.g. `3`
- `verseNum: number` - verse start number, e.g. `4`
- `versification: ScrVers` - versification of the reference, e.g. `ScrVers.English`
- `valid: boolean` - Determines if the reference is valid.
- `validStatus: ValidStatusType` - The valid status for this reference.
- `BBBCCC: number` - The reference as a comparable integer where the book, chapter, and verse each occupy three digits and the verse is 0, e.g. `42003000`.
- `BBBCCCVVV: number` - The reference as a comparable integer where the book, chapter, and verse each occupy three digits, e.g. `42003004`.

Useful methods and functions:

- `parse(verseStr: string): void` - Parses the reference in the specified string.
- `simplify(): void` - Simplifies this verse ref so that it has no bridging of verses or verse segments like '1a'.
- `clone(): VerseRef` - Makes a clone of the reference.
- `equals(verseRef: VerseRef): boolean` - Compares this `VerseRef` with supplied one.
- `allVerses(specifiedVersesOnly = false, verseRangeSeparators: string[] = VerseRef.verseRangeSeparators, verseSequenceSeparators: string[] = VerseRef.verseSequenceIndicators): VerseRef[]` - Enumerate all individual verses contained in a VerseRef. Verse ranges are indicated by "-" and consecutive verses by ","s.
- `validateVerse(verseRangeSeparators: string[], verseSequenceSeparators: string[]): ValidStatusType` - Validates a verse number using the supplied separators rather than the defaults.

Useful static functions:

- `static isVerseParseable(verse: string): boolean` - Determines if the verse string is in a valid format (does not consider versification).
- `static tryParse(str: string): { success: boolean; verseRef: VerseRef }` - Tries to parse the specified string into a verse reference.
- `static getBBBCCCVVV(bookNum: number, chapterNum: number, verseNum: number): number` - Gets the reference as a comparable integer where the book, chapter, and verse each occupy 3 digits.

### Canon

`Canon` contains various useful tools:

```typescript
import { Canon } from '@sillsdev/scripture';

console.log(Canon.bookIdToNumber('MAT')); // 40

console.log(Canon.bookNumberToId(1)); // 'GEN'
console.log(Canon.bookNumberToId(40)); // 'MAT'

console.log(Canon.bookNumberToEnglishName(1)); // 'Genesis'

console.log(Canon.bookIdToEnglishName('GEN')); // 'Genesis'

console.log(Canon.isBookIdValid('MAT')); // true

console.log(Canon.isBookNT('MAT')); // true
console.log(Canon.isBookNT(1)); // false

console.log(Canon.isBookOT('MAT')); // false
console.log(Canon.isBookOT(1)); // true

console.log(Canon.isBookOTNT('MAT')); // true
console.log(Canon.isBookOTNT(1)); // true

console.log(Canon.isBookDC('TOB')); // true
console.log(Canon.isBookDC(1)); // false

console.log(Canon.isCanonical('XXA')); // false
console.log(Canon.isCanonical(1)); // true

console.log(Canon.isExtraMaterial('XXA')); // true
console.log(Canon.isExtraMaterial(1)); // false

console.log(Canon.isObsolete(87)); // true
```

## License

[MIT][github-license] © [SIL International](https://www.sil.org/)

## Future

v2 might include a more complete port of the C# such that it can be used in a node-based backend.

## Contributing

Contributions via Pull Request are welcome. Keep changes to porting the C# source. Please port appropriate tests from [libpalaso/SIL.Scripture.Tests][github-libpalaso-scripture-tests] along with the [libpalaso/SIL.Scripture][github-libpalaso-scripture] source code.

<!-- define variables used above -->

[github-actions-status]: https://github.com/sillsdev/scripture/actions/workflows/ci-test-publish.yml/badge.svg
[github-actions-url]: https://github.com/sillsdev/scripture/actions
[gitghub-codeql-status]: https://github.com/sillsdev/scripture/actions/workflows/codeql-analysis.yml/badge.svg
[gitghub-codeql-url]: https://github.com/sillsdev/scripture/actions/workflows/codeql-analysis.yml
[github-codecov-status]: https://codecov.io/gh/sillsdev/scripture/branch/main/graph/badge.svg?token=N51WM8PR2E
[github-codecov-url]: https://codecov.io/gh/sillsdev/scripture
[github-tag-image]: https://img.shields.io/github/tag/sillsdev/scripture.svg?label=version
[github-tag-url]: https://github.com/sillsdev/scripture/releases/latest
[github-license]: https://github.com/sillsdev/scripture/blob/main/LICENSE
[github-libpalaso-scripture]: https://github.com/sillsdev/libpalaso/tree/master/SIL.Scripture
[github-libpalaso-scripture-tests]: https://github.com/sillsdev/libpalaso/tree/master/SIL.Scripture.Tests
