/* eslint-disable one-var, one-var-declaration-per-line, no-console */
import { expect } from 'chai';
import { isCheck } from './index';

describe('isCheck', () => {
  describe('Some simple tests', () => {
    it('should return Pawn threatens king', () => {
      const pieces = [
        { piece: 'king', owner: 1, x: 4, y: 0 },
        { piece: 'king', owner: 0, x: 4, y: 7 },
        { piece: 'pawn', owner: 1, x: 5, y: 6 },
      ];
      expect(isCheck(pieces, 0)).to.be.eql([pieces[2]]); // Pawn threatens king
    });
    it('should return Rook threatens king', () => {
      const pieces = [
        { piece: 'king', owner: 1, x: 4, y: 0 },
        { piece: 'king', owner: 0, x: 4, y: 7 },
        { piece: 'rook', owner: 1, x: 4, y: 1 },
      ];
      expect(isCheck(pieces, 0)).to.be.eql([pieces[2]]); // Rook threatens king
    });
    it('should return Knight threatens king', () => {
      const pieces = [
        { piece: 'king', owner: 1, x: 4, y: 0 },
        { piece: 'king', owner: 0, x: 4, y: 7 },
        { piece: 'knight', owner: 1, x: 2, y: 6 },
      ];
      expect(isCheck(pieces, 0)).to.be.eql([pieces[2]]); // Knight threatens king
    });
    it('should return Bishop threatens king', () => {
      const pieces = [
        { piece: 'king', owner: 1, x: 4, y: 0 },
        { piece: 'king', owner: 0, x: 4, y: 7 },
        { piece: 'bishop', owner: 1, x: 0, y: 3 },
      ];
      expect(isCheck(pieces, 0)).to.be.eql([pieces[2]]); // Bishop threatens king
    });
    it('should return Queen threatens king', () => {
      const pieces = [
        { piece: 'king', owner: 1, x: 4, y: 0 },
        { piece: 'king', owner: 0, x: 4, y: 7 },
        { piece: 'queen', owner: 1, x: 4, y: 1 },
      ];
      expect(isCheck(pieces, 0)).to.be.eql([pieces[2]]); // Queen threatens king
    });
    it('should return Queen threatens king', () => {
      const pieces = [
        { piece: 'king', owner: 1, x: 4, y: 0 },
        { piece: 'king', owner: 0, x: 4, y: 7 },
        { piece: 'queen', owner: 1, x: 7, y: 4 },
      ];
      expect(isCheck(pieces, 0)).to.be.eql([pieces[2]]); // Queen threatens king
    });
    it('should return Double threat', () => {
      const pieces = [
        { piece: 'king', owner: 1, x: 4, y: 0 },
        { piece: 'pawn', owner: 0, x: 4, y: 6 },
        { piece: 'pawn', owner: 0, x: 5, y: 6 },
        { piece: 'king', owner: 0, x: 4, y: 7 },
        { piece: 'bishop', owner: 0, x: 5, y: 7 },
        { piece: 'bishop', owner: 1, x: 1, y: 4 },
        { piece: 'rook', owner: 1, x: 2, y: 7, prevX: 2, prevY: 5 },
      ];
      const sortFunc = (a, b) => {
        if (a.y === b.y) return a.x - b.x;
        return a.y - b.y;
      };
      expect(isCheck(pieces, 0).sort(sortFunc)).to.be.eql([pieces[5], pieces[6]]); // Double threat
    });
  });
});
