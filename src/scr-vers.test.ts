import { ScrVersType } from './versification';
import { ScrVers } from './scr-vers';

describe('ScrVers', () => {
  describe('constructor()', () => {
    it('should construct with name', () => {
      const scrVers = new ScrVers('Septuagint');
      expect(scrVers.name).toEqual('Septuagint');
      expect(scrVers.type).toEqual(ScrVersType.Septuagint);
    });

    it('should construct with type', () => {
      const scrVers = new ScrVers(ScrVersType.Septuagint);
      expect(scrVers.name).toEqual('Septuagint');
      expect(scrVers.type).toEqual(ScrVersType.Septuagint);
    });

    it('should not construct with no argument', () => {
      const t = () => {
        new ScrVers(undefined);
      };
      expect(t).toThrow();
    });
  });
});
