import { Canon } from './canon';

describe('Canon', () => {
  describe('bookNumberToId()', () => {
    it('should return bookId', () => {
      const bookId = Canon.bookNumberToId(1);
      expect(bookId).toEqual('GEN');
    });

    it('should return bookId', () => {
      const bookId = Canon.bookNumberToId(40);
      expect(bookId).toEqual('MAT');
    });
  });

  describe('bookNumberToEnglishName()', () => {
    it('should return bookId', () => {
      const bookName = Canon.bookNumberToEnglishName(1);
      expect(bookName).toEqual('Genesis');
    });
  });
});
