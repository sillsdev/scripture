import { Canon } from './canon';

describe('Canon', () => {
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

  describe('isObsolete()', () => {
    it("should return whether it's obsolete or not", () => {
      let isObsolete = Canon.isObsolete(1);
      expect(isObsolete).toBe(false);
      isObsolete = Canon.isObsolete(87);
      expect(isObsolete).toBe(true);
    });
  });
});
