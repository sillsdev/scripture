import { ScrVers } from './scr-vers';
import { VerseRef } from './verse-ref';

describe('VerseRef constructor', () => {
  it('should construct with versification', () => {
    const vref = new VerseRef(1, 2, 3, ScrVers.Septuagint);
    expect(vref.valid).toBe(true);
    expect(vref.BBBCCCVVV).toEqual(1002003);
    // expect(vref.BBBCCCVVVS).toEqual('001002003');
    expect(vref.bookNum).toEqual(1);
    expect(vref.book).toEqual('GEN');
    expect(vref.chapterNum).toEqual(2);
    expect(vref.chapter).toEqual('2');
    expect(vref.verseNum).toEqual(3);
    expect(vref.versification).toEqual(ScrVers.Septuagint);
  });

  it('should construct without versification', () => {
    const vref = new VerseRef(4, 5, 6);
    expect(vref.BBBCCCVVV).toEqual(4005006);
    // expect(vref.BBBCCCVVVS).toEqual('004005006');
    expect(vref.bookNum).toEqual(4);
    expect(vref.book).toEqual('NUM');
    expect(vref.chapterNum).toEqual(5);
    expect(vref.verseNum).toEqual(6);
    expect(vref.versification).toEqual(VerseRef.defaultVersification);
  });

  it('should construct without arguments', () => {
    const vref = new VerseRef();
    expect(vref.isDefault).toBe(true);
    expect(vref.valid).toBe(false);
    expect(vref.BBBCCCVVV).toEqual(0);
    // expect(vref.BBBCCCVVVS).toEqual('000000000');
    expect(vref.bookNum).toEqual(0);
    expect(vref.book).toEqual('');
    expect(vref.chapterNum).toEqual(0);
    expect(vref.chapter).toEqual('');
    expect(vref.verseNum).toEqual(0);
    expect(vref.verse).toEqual('');
    expect(vref.versification).toBeUndefined();
  });

  it('should construct with a verse range', () => {
    const vref = new VerseRef('LUK', '3', '4b-5a', ScrVers.Vulgate);
    expect(vref.valid).toBe(true);
    expect(vref.BBBCCCVVV).toEqual(42003004);
    // expect(vref.BBBCCCVVVS).toEqual('042003004b');
    expect(vref.bookNum).toEqual(42);
    expect(vref.chapterNum).toEqual(3);
    expect(vref.verseNum).toEqual(4);
    expect(vref.verse).toEqual('4b-5a');
    // expect(vref.segment()).toEqual('b');
    expect(vref.allVerses().length).toEqual(2);
    expect(vref.versification).toEqual(ScrVers.Vulgate);
  });
});
