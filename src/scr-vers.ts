/**
 * Partially converted from
 * https://github.com/sillsdev/libpalaso/blob/master/SIL.Scripture/ScrVers.cs
 */

import { BookSet } from './book-set';
import { ScrVersType, Versification } from './versification';

/**
 * Accessor for getting information about a versification. This class has a small memory footprint
 * so multiple ScrVers objects can be created that point to the same versification; useful for
 * deserialization of versification information.
 */
export class ScrVers {
  static readonly Original: ScrVers = new ScrVers(ScrVersType.Original);
  static readonly Septuagint: ScrVers = new ScrVers(ScrVersType.Septuagint);
  static readonly Vulgate: ScrVers = new ScrVers(ScrVersType.Vulgate);
  static readonly English: ScrVers = new ScrVers(ScrVersType.English);
  static readonly RussianProtestant: ScrVers = new ScrVers(ScrVersType.RussianProtestant);
  static readonly RussianOrthodox: ScrVers = new ScrVers(ScrVersType.RussianOrthodox);

  name?: string;
  fullPath?: string;
  isPresent?: boolean;
  hasVerseSegments?: boolean;
  isCustomized?: boolean;
  baseVersification?: ScrVers;
  scriptureBooks?: BookSet;

  private _type: ScrVersType = ScrVersType.Unknown;
  private _versInfo?: Versification;

  constructor(type?: ScrVersType | string) {
    if (type != null) {
      if (typeof type === 'string') {
        this.name = type;
      } else {
        this._type = type;
      }
    } else {
      throw new Error('Argument null');
    }
  }

  /**
   * Gets the type of versification.
   */
  get type(): ScrVersType {
    return this._type;
  }

  /**
   * Gets the internal versification mapping (should only be called from Versification).
   *
   * @internal
   */
  get versInfo(): Versification {
    if (this._versInfo == null) this._versInfo = Versification.Table.Implementation.get(this._type);
    return this._versInfo;
  }

  /**
   * Gets last book in this project.
   * @returns The last book number in this project.
   */
  getLastBook(): number {
    return this.versInfo.lastBook();
  }

  /**
   * Gets last chapter number in this book.
   * @param bookNum - Book number (this is 1-based, not an index).
   * @returns The last chapter number in this book.
   */
  getLastChapter(bookNum: number): number {
    return this.versInfo.lastChapter(bookNum);
  }

  /**
   * Gets last verse number in this book/chapter.
   * @param bookNum - Book number (this is 1-based, not an index).
   * @param chapterNum - Chapter number.
   * @returns The last verse number in this book/chapter.
   */
  getLastVerse(bookNum: number, chapterNum: number): number {
    return this.versInfo.lastVerse(bookNum, chapterNum);
  }

  /**
   * Determines whether the specified verse is excluded in the versification.
   * @param bbbcccvvv - The reference as a comparable integer where the book, chapter, and verse
   * each occupy 3 digits.
   * @returns
   */
  isExcluded(bbbcccvvv: number): boolean {
    return this.versInfo.isExcluded(bbbcccvvv);
  }

  equals(scrVers: ScrVers): boolean {
    if (!scrVers.type || !this.type) return false;
    return scrVers.type === this.type;
  }
}
