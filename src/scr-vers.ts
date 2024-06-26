/**
 * Partially converted from
 * https://github.com/sillsdev/libpalaso/blob/master/SIL.Scripture/ScrVers.cs
 */

import { BookSet } from './book-set';
import { ScrVersType } from './versification';

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

  private _type?: ScrVersType;
  // private versInfo: Versification;

  constructor(type: ScrVersType | string | undefined) {
    if (type == null) {
      throw new Error('Argument undefined');
    }

    if (typeof type === 'string') {
      this.name = type;
      this._type = ScrVersType[type as keyof typeof ScrVersType];
    } else {
      this._type = type;
      this.name = ScrVersType[type];
    }
  }

  get type(): ScrVersType | undefined {
    return this._type;
  }

  equals(scrVers: ScrVers): boolean {
    if (!scrVers.type || !this.type) return false;
    return scrVers.type === this.type;
  }
}
