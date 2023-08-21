/**
 * Partially converted from
 * https://github.com/sillsdev/libpalaso/blob/master/SIL.Scripture/Versification.cs
 */

import Canon from "./canon";

type VersificationKey = string;

/**
 * Provides public access to the list of versifications.
 */
class Table {
  static Implementation: Table = new Table();

  private versifications: {[key: VersificationKey]: Versification} = {};

  /**
   * Get the versification table for this versification
   *
   * @internal
   */
  get(type: ScrVersType): Versification
  {
    const key: VersificationKey = this.createKey(type, '');
    let versification: Versification;
    if (key in this.versifications) {
      versification = this.versifications[key];
      return versification;
    }

    let resourceFileText: string;
    switch (type)
    {
      case ScrVersType.Original: resourceFileText = Resources.org_vrs; break;
      case ScrVersType.English: resourceFileText = Resources.eng_vrs; break;
      case ScrVersType.Septuagint: resourceFileText = Resources.lxx_vrs; break;
      case ScrVersType.Vulgate: resourceFileText = Resources.vul_vrs; break;
      case ScrVersType.RussianOrthodox: resourceFileText = Resources.rso_vrs; break;
      case ScrVersType.RussianProtestant: resourceFileText = Resources.rsc_vrs; break;
      default: throw new InvalidOperationException('Can not create a versification for an unknown type');
    }

    versification = new Versification(type.toString(), undefined);
    using (TextReader fallbackVersificationStream = new StringReader(resourceFileText))
      ReadVersificationFile(fallbackVersificationStream, null, type, ref versification);
    this.versifications[key] = versification;
    return versification;
  }

  private createKey(type: ScrVersType, scrVersName: string): VersificationKey {
    return `${type}:${type == ScrVersType.Unknown ? scrVersName : ''}`;
  }
}

/**
 * Manages internal information for a versification. You should use the
 * {@link ScrVers} class to access the versification information.
 *
 * @sealed
 */
export class Versification {
  static Table = Table;

  readonly nonCanonicalLastChapterOrVerse = 998;

  private readonly name: string;
  private readonly bookList: number[][];

  /**
   * Excluded verses are represented as BBBCCCVVV integers so lookup with segments will be handled
   * correctly.
   */
  private readonly excludedVerses: Set<number>;

  private _fullPath?: string;

  private constructor(versName: string, fullPath: string, baseVersification?: Versification) {
    this.name = versName;
    this.fullPath = fullPath;
    if (baseVersification == null) {
      this.bookList = [];
      this.excludedVerses = new Set<number>();
    } else {
      this.bookList = baseVersification.bookList;
      this.excludedVerses = new Set<number>(baseVersification.excludedVerses);
    }
  }

  /**
   * Gets the full path for this versification file (e.g. \My Paratext Projects\eng.vrs).
   *
   * @remarks Note that this will be undefined for built-in versifications since they are stored as
   * embedded resources.

  * @internal
   */
  get fullPath(): string | undefined {
    return this._fullPath;
  }
  private set fullPath(value: string) {
    this._fullPath = value;
  }

  /**
   * Gets last book in this project.
   * @returns The last book number in this project.
   *
   * @internal
   */
  lastBook(): number
  {
    return (this.bookList != null) ? this.bookList.length : 0;
  }

  /**
   * Gets last chapter number in this book.
   * @param bookNum - Book number (this is 1-based, not an index).
   * @returns The last chapter number in this book.
   *
   * @internal
   */
  lastChapter(bookNum: number): number
  {
    // Non-scripture books have 998 chapters
    if (!Canon.isCanonical(bookNum))
      return this.nonCanonicalLastChapterOrVerse; // Use 998 so the VerseRef.BBBCCCVVV value is computed properly

    // Anything else not in .vrs file has 1 chapter
    if (bookNum > this.bookList.length)
      return 1;

    const chapters: number[] = this.bookList[bookNum - 1];
    return chapters.length;
  }

  /**
   * Gets last verse number in this book/chapter.
   * @param bookNum - Book number (this is 1-based, not an index).
   * @param chapterNum - Chapter number.
   * @returns The last verse number in this book/chapter.
   *
   * @internal
   */
  lastVerse(bookNum: number, chapterNum: number): number
  {
    // Non-scripture books have 998 verses in each chapter
    if (!Canon.isCanonical(bookNum))
      return this.nonCanonicalLastChapterOrVerse; // Use 998 so the VerseRef.BBBCCCVVV value is computed properly

    // Anything else not in .vrs file has 1 chapter
    if (bookNum > this.bookList.length)
      return 1;

    const chapters: number[] = this.bookList[bookNum - 1];
    if (chapterNum > chapters.length || chapterNum < 1)
      return 1;

    return chapters[chapterNum - 1];
  }

  /**
   * Determines whether the specified verse is excluded in the versification.
   *
   * @internal
   */
  isExcluded(bbbcccvvv: number): boolean {
    return this.excludedVerses.has(bbbcccvvv);
  }
}

/**
 * List of versification types. Used mostly for backwards compatibility where just a versification
 * integer code was stored.
 *
 * WARNING: The order of these items are very important as they correspond to the old, legacy codes.
 */
export enum ScrVersType {
  Unknown,
  Original,
  Septuagint,
  Vulgate,
  English,
  RussianProtestant,
  RussianOrthodox,
}
