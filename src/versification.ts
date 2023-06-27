/**
 * Partially converted from
 * https://github.com/sillsdev/libpalaso/blob/master/SIL.Scripture/Versification.cs
 */

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
