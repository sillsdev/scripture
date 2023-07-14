import { Canon } from './canon';

describe('Canon', () => {
  describe('isBookNT()', () => {
    it("should return whether it's NT or not", () => {
      let isBookNT = Canon.isBookNT(1);
      expect(isBookNT).toBe(false);
      isBookNT = Canon.isBookNT('GEN');
      expect(isBookNT).toBe(false);
      isBookNT = Canon.isBookNT(42);
      expect(isBookNT).toBe(true);
      isBookNT = Canon.isBookNT('MAT');
      expect(isBookNT).toBe(true);
    });
  });

  describe('isBookOT()', () => {
    it("should return whether it's OT or not", () => {
      let isBookOT = Canon.isBookOT(1);
      expect(isBookOT).toBe(true);
      isBookOT = Canon.isBookOT('GEN');
      expect(isBookOT).toBe(true);
      isBookOT = Canon.isBookOT(42);
      expect(isBookOT).toBe(false);
      isBookOT = Canon.isBookOT('MAT');
      expect(isBookOT).toBe(false);
    });
  });

  describe('isBookDC()', () => {
    it("should return whether it's Deutero Canon or not", () => {
      let isBookDC = Canon.isBookDC(66);
      expect(isBookDC).toBe(false);
      isBookDC = Canon.isBookDC('REV');
      expect(isBookDC).toBe(false);
      isBookDC = Canon.isBookDC(67);
      expect(isBookDC).toBe(true);
      isBookDC = Canon.isBookDC('TOB');
      expect(isBookDC).toBe(true);
    });
  });

  describe('allBookNumbers()', () => {
    it('should yield each book number', () => {
      const iterator = Canon.allBookNumbers();
      expect(iterator.next().value).toEqual(1);
      expect(iterator.next().value).toEqual(2);
      expect(iterator.next().value).toEqual(3);
    });
  });

  describe('extraBooks()', () => {
    it('should return array of extra book IDs', () => {
      const extraBooks = Canon.extraBooks();
      expect(extraBooks[0]).toEqual('XXA');
      expect(extraBooks.length).toEqual(7);
    });
  });

  describe('bookNumberToId()', () => {
    it('should return bookId', () => {
      const bookId = Canon.bookNumberToId(1);
      expect(bookId).toEqual('GEN');
    });

    it('should return error value if not found', () => {
      const bookId = Canon.bookNumberToId(500);
      expect(bookId).toEqual('***');
    });
  });

  describe('bookNumberToEnglishName()', () => {
    it('should return name', () => {
      const bookName = Canon.bookNumberToEnglishName(1);
      expect(bookName).toEqual('Genesis');
    });

    it('should return error value if not found', () => {
      const bookName = Canon.bookNumberToEnglishName(500);
      expect(bookName).toEqual('******');
    });
  });

  describe('bookIdToEnglishName()', () => {
    it('should return name', () => {
      const bookName = Canon.bookIdToEnglishName('GEN');
      expect(bookName).toEqual('Genesis');
    });
  });

  describe('isCanonical()', () => {
    it("should return whether it's canonical or not", () => {
      // `num` overload is tested in `isBookDC()`.
      let isCanonical = Canon.isCanonical('GEN');
      expect(isCanonical).toBe(true);
      isCanonical = Canon.isCanonical('XXA');
      expect(isCanonical).toBe(false);
    });
  });

  describe('isExtraMaterial()', () => {
    it("should return whether it's extra material or not", () => {
      let isExtraMaterial = Canon.isExtraMaterial(1);
      expect(isExtraMaterial).toBe(false);
      isExtraMaterial = Canon.isExtraMaterial('GEN');
      expect(isExtraMaterial).toBe(false);
      isExtraMaterial = Canon.isExtraMaterial(93);
      expect(isExtraMaterial).toBe(true);
      isExtraMaterial = Canon.isExtraMaterial('XXA');
      expect(isExtraMaterial).toBe(true);
    });
  });

  describe('isObsolete()', () => {
    it("should return whether it's obsolete or not", () => {
      let isObsolete = Canon.isObsolete(1);
      expect(isObsolete).toBe(false);
      isObsolete = Canon.isObsolete(87);
      expect(isObsolete).toBe(true);
    });
  });
});
