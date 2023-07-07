# scripture

<div align="center">

[![Build Status][github-actions-status]][github-actions-url]
[![CodeQL][gitghub-codeql-status]][gitghub-codeql-url]
[![codecov][github-codecov-status]][github-codecov-url]
[![Github Tag][github-tag-image]][github-tag-url]

</div>

TypeScript partial port of C# library [libpalaso/SIL.Scripture][github-libpalaso-scripture]. These libraries are used by [Paratext](https://paratext.org/) to represent and support Scripture references.

v1 is a minimal partial port in TypeScript that supports use on the frontend while still using the full C# version on the backend.

## Features

- {class} Canon - Canon information. Also, contains static information on complete list of books.
- {class} VerseRef - Stores a reference to a specific verse in Scripture.
  - Represents a single reference, e.g. GEN 2:3
  - Represents a reference range, e.g. LUK 3:4b-5a
  - Supports versification types: Unknown, Original, Septuagint, Vulgate, English, RussianProtestant, RussianOrthodox.

## Installation

```sh
npm install @sillsdev/scripture
```

## Usage

`VerseRef` can be used to validate a reference, e.g. on form validation. If an appropriate versification is not supplied, a default one will be used (defaults to English):

```typescript
import { ScrVers, VerseRef } from "@sillsdev/scripture";

let verseRef = new VerseRef(1, 2, 3, ScrVers.Septuagint);
console.log(verseRef.valid); // true

verseRef = new VerseRef("LUK", "3", "4b-5a");
console.log(verseRef.valid); // true

function isVerseReferenceValid(verseStr: string): boolean {
  const { verseRef } = VerseRef.tryParse(verseStr);
  return verseRef.valid;
}

console.log(isVerseReferenceValid("NOOB 200:300")); // false
console.log(isVerseReferenceValid("GEN 2:3")); // true
console.log(isVerseReferenceValid("LUK 3:4b-5a")); // true
```

`Canon` contains various useful tools, e.g.:

```typescript
import { Canon } from "@sillsdev/scripture";

console.log(Canon.bookNumberToId(1)); // 'GEN'
console.log(Canon.bookNumberToId(40)); // 'MAT'

console.log(Canon.bookNumberToEnglishName(1)); // 'Genesis'
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
[github-codecov-url]: :https://codecov.io/gh/sillsdev/scripture
[github-tag-image]: https://img.shields.io/github/tag/sillsdev/scripture.svg?label=version
[github-tag-url]: https://github.com/sillsdev/scripture/releases/latest
[github-license]: https://github.com/sillsdev/scripture/blob/main/LICENSE
[github-libpalaso-scripture]: https://github.com/sillsdev/libpalaso/tree/master/SIL.Scripture
[github-libpalaso-scripture-tests]: https://github.com/sillsdev/libpalaso/tree/master/SIL.Scripture.Tests
