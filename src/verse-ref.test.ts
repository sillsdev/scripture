import { ScrVers } from './scr-vers';
import { SerializedVerseRef, VerseRef } from './verse-ref';

describe('VerseRef', () => {
  const RTL_MARKER = '\u200F';

  describe('constructor()', () => {
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

    it('should construct from string', () => {
      const vref = new VerseRef('GEN 2:3');
      expect(vref.valid).toBe(true);
    });

    it('should construct from string with range', () => {
      const vref = new VerseRef('LUK 3:4b-5a');
      expect(vref.valid).toBe(true);
    });

    it('should parse from string when invalid', () => {
      const { verseRef: vref } = VerseRef.tryParse('NOOB 200:300');
      expect(vref.valid).toBe(false);
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

    it('should construct with a verse range and removes RTL marker', () => {
      const vref = new VerseRef('LUK', '3', '4b' + RTL_MARKER + '-5a', ScrVers.Vulgate);
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

    it('should construct from an existing verseRef', () => {
      const vref = new VerseRef(new VerseRef('LUK 3:4b-5a', ScrVers.Vulgate));
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

    it('should construct from an existing verseRef and removes RTL markers', () => {
      const vref = new VerseRef(
        new VerseRef('LUK 3' + RTL_MARKER + ':4' + RTL_MARKER + '-5', ScrVers.Vulgate),
      );
      expect(vref.valid).toBe(true);
      expect(vref.BBBCCCVVV).toEqual(42003004);
      // expect(vref.BBBCCCVVVS).toEqual('042003004b');
      expect(vref.bookNum).toEqual(42);
      expect(vref.chapterNum).toEqual(3);
      expect(vref.verseNum).toEqual(4);
      expect(vref.verse).toEqual('4-5');
      // expect(vref.segment()).toEqual('');
      expect(vref.allVerses().length).toEqual(2);
      expect(vref.versification).toEqual(ScrVers.Vulgate);
    });

    it('should construct from BBBCCCVV without versification', () => {
      const vref = new VerseRef(12015013);
      expect(vref.BBBCCCVVV).toEqual(12015013);
      // expect(vref.BBBCCCVVVS).toEqual('012015013');
      expect(vref.book).toEqual('2KI');
      expect(vref.bookNum).toEqual(12);
      expect(vref.chapterNum).toEqual(15);
      expect(vref.verseNum).toEqual(13);
      expect(vref.verse).toEqual('13');
      expect(vref.versification).toEqual(VerseRef.defaultVersification);
    });

    it('should construct from BBBCCCVV with versification', () => {
      const vref = new VerseRef(42003004, ScrVers.Vulgate);
      expect(vref.BBBCCCVVV).toEqual(42003004);
      // expect(vref.BBBCCCVVVS).toEqual('042003004');
      expect(vref.book).toEqual('LUK');
      expect(vref.bookNum).toEqual(42);
      expect(vref.chapterNum).toEqual(3);
      expect(vref.verseNum).toEqual(4);
      expect(vref.verse).toEqual('4');
      expect(vref.versification).toEqual(ScrVers.Vulgate);
    });
  });

  describe('Chapter and Verse as Empty Strings', () => {
    it('should handle empty chapter and verse', () => {
      const vref = new VerseRef('LUK', '', '', ScrVers.Septuagint);
      // expect(vref.validStatus).toEqual(VerseRef.ValidStatusType.OutOfRange);
      expect(vref.book).toEqual('LUK');
      // expect(vref.chapter).toEqual('');
      expect(vref.verse).toEqual('');
      expect(vref.bookNum).toEqual(42);
      // expect(vref.chapterNum).toEqual(-1);
      expect(vref.verseNum).toEqual(-1);
      expect(vref.versification).toEqual(ScrVers.Septuagint);
    });
  });

  // Tests that don't exist in the C#.
  describe('Extra (TS-only tests)', () => {
    describe('String', () => {
      it('should convert to empty string', () => {
        const vref = new VerseRef();
        expect(vref.toString()).toEqual('');
      });

      it('should convert to string', () => {
        const vref = new VerseRef(1, 2, 3, ScrVers.Septuagint);
        expect(vref.toString()).toEqual('GEN 2:3');
      });
    });

    describe('Equality', () => {
      it('should confirm when refs are equal', () => {
        const vref = new VerseRef(1, 2, 3, ScrVers.Septuagint);
        const vrefClone = vref.clone();
        expect(vref.equals(vrefClone)).toBe(true);
      });

      it('should confirm when refs are not equal', () => {
        const vref = new VerseRef(1, 2, 3, ScrVers.Septuagint);
        const vrefNotEqual = new VerseRef(1, 20, 3, ScrVers.Septuagint);
        expect(vref.equals(vrefNotEqual)).toBe(false);
      });
    });

    describe('Serialization', () => {
      it('should serialize empty VerseRef', () => {
        const vref = new VerseRef();

        const json = vref.toJSON();

        expect(json).toEqual({ book: '', chapterNum: 0, verseNum: 0 });
        // Needed to help .NET deserialization.
        expect(json).not.toHaveProperty('verse');
      });

      it('should serialize VerseRef', () => {
        const vref = new VerseRef(1, 2, 3, ScrVers.Septuagint);

        const json = vref.toJSON();

        expect(json).toEqual({
          book: 'GEN',
          chapterNum: 2,
          verseNum: 3,
          versificationStr: 'Septuagint',
        });
        // Needed to help .NET deserialization.
        expect(json).not.toHaveProperty('verse');
      });

      it('should stringify VerseRef', () => {
        const vref = new VerseRef(1, 2, 3, ScrVers.Septuagint);
        expect(JSON.stringify(vref)).toEqual(
          '{"book":"GEN","chapterNum":2,"verseNum":3,"versificationStr":"Septuagint"}',
        );
      });

      it('should serialize VerseRef with range', () => {
        const vref = new VerseRef('LUK', '3', '4b-5a', ScrVers.Vulgate);
        expect(vref.toJSON()).toEqual({
          book: 'LUK',
          chapterNum: 3,
          verseNum: 4,
          verse: '4b-5a',
          versificationStr: 'Vulgate',
        });
      });

      it('should deserialize empty serialized VerseRef', () => {
        const serializedVerseRef: SerializedVerseRef = { book: '', chapterNum: 0, verseNum: 0 };
        const expectedVref = new VerseRef();

        const vref = VerseRef.fromJSON(serializedVerseRef);

        expect(vref.equals(expectedVref)).toBe(true);
      });

      it('should deserialize serialized VerseRef', () => {
        const serializedVerseRef: SerializedVerseRef = {
          book: 'GEN',
          chapterNum: 2,
          verseNum: 3,
          versificationStr: 'Septuagint',
        };
        const expectedVref = new VerseRef(1, 2, 3, ScrVers.Septuagint);

        const vref = VerseRef.fromJSON(serializedVerseRef);

        expect(vref.equals(expectedVref)).toBe(true);
      });

      it('should deserialize serialized VerseRef with range', () => {
        const serializedVerseRef: SerializedVerseRef = {
          book: 'LUK',
          chapterNum: 3,
          verseNum: 4,
          verse: '4b-5a',
          versificationStr: 'English',
        };
        const expectedVref = new VerseRef('LUK', '3', '4b-5a');

        const vref = VerseRef.fromJSON(serializedVerseRef);

        expect(vref.equals(expectedVref)).toBe(true);
      });
    });
  });
});
