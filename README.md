# scripture

<div align="center">

[![Build Status][github-actions-status]][github-actions-url]
[![CodeQL][gitghub-codeql-status]][gitghub-codeql-url]
[![Github Tag][github-tag-image]][github-tag-url]

</div>

TypeScript partial port of C# library [libpalaso/SIL.Scripture][github-libpalaso-scripture]. These libraries are used by [Paratext](https://paratext.org/) to represent Scripture.

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

## License

[MIT][github-license] © [SIL International](https://www.sil.org/)

<!-- define variables used above -->

[github-actions-status]: https://github.com/sillsdev/scripture/actions/workflows/ci-test-publish.yml/badge.svg
[github-actions-url]: https://github.com/sillsdev/scripture/actions
[gitghub-codeql-status]: https://github.com/sillsdev/scripture/actions/workflows/codeql-analysis.yml/badge.svg
[gitghub-codeql-url]: https://github.com/sillsdev/scripture/actions/workflows/codeql-analysis.yml
[github-tag-image]: https://img.shields.io/github/tag/sillsdev/scripture.svg?label=version
[github-tag-url]: https://github.com/sillsdev/scripture/releases/latest
[github-libpalaso-scripture]: https://github.com/sillsdev/libpalaso/tree/master/SIL.Scripture
[github-license]: https://github.com/sillsdev/scripture/blob/main/LICENSE
