/* eslint-disable  no-multi-spaces, no-unused-vars, no-console, one-var-declaration-per-line, one-var, default-case */
const LENGTH = 8;

const KING   = 'king';
const QUEEN  = 'queen';
const ROOK   = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const PAWN   = 'pawn';

const isEmpty = (pos, pieces) => !pieces.every(p => p.x === pos.x && p.y === pos.y);
const isKing = (pos, pieces, player) =>
  pieces.filter(p => p.piece === KING && p.owner === player && p.x === pos.x && p.y === pos.y).length === 1;
const isValidPosition = (p, piece = { x: -1, y: -1 }) =>
  p.x >= 0 && p.x < LENGTH && p.y >= 0 && p.y < LENGTH && !(p.x === piece.x && p.y === piece.y);

function checkBishop(piece, pieces, player) {
  let bottomRight = true, topRight = true, bottomLeft = true, topLeft = true, pos;
  for (let i = 0; i < LENGTH; i += 1) {
    pos = { x: i + piece.x, y: i + piece.y };
    if (bottomRight && isValidPosition(pos, piece)) {
      if (isKing(pos, pieces, player)) return true;
      bottomRight = isEmpty(pos, pieces);
    }
    pos = { x: i + piece.x, y: piece.y - i };
    if (topRight && isValidPosition(pos, piece)) {
      if (isKing(pos, pieces, player)) return true;
      topRight = isEmpty(pos, pieces);
    }
    pos = { x: piece.x - i, y: i + piece.y };
    if (bottomLeft && isValidPosition(pos, piece)) {
      if (isKing(pos, pieces, player)) return true;
      bottomLeft = isEmpty(pos, pieces);
    }
    pos = { x: piece.x - i, y: piece.y - i };
    if (topLeft && isValidPosition(pos, piece)) {
      if (isKing(pos, pieces, player)) return true;
      topLeft = isEmpty(pos, pieces);
    }
  }
  return false;
}

function checkRook(piece, pieces, player) {
  let bottom = true, top = true, left = true, right = true, pos;
  for (let i = 0; i < LENGTH; i += 1) {
    pos = { x: piece.x, y: i + piece.y };
    if (bottom && isValidPosition(pos, piece)) {
      if (isKing(pos, pieces, player)) return true;
      bottom = isEmpty(pos, pieces);
    }
    pos = { x: piece.x, y: piece.y - i };
    if (top && isValidPosition(pos, piece)) {
      if (isKing(pos, pieces, player)) return true;
      top = isEmpty(pos, pieces);
    }
    pos = { x: piece.x - i, y: piece.y };
    if (left && isValidPosition(pos, piece)) {
      if (isKing(pos, pieces, player)) return true;
      left = isEmpty(pos, pieces);
    }
    pos = { x: piece.x + i, y: piece.y };
    if (right && isValidPosition(pos, piece)) {
      if (isKing(pos, pieces, player)) return true;
      right = isEmpty(pos, pieces);
    }
  }
  return false;
}

function checkQueen(piece, pieces, player) {
  return checkBishop(piece, pieces, player) || checkRook(piece, pieces, player);
}

function checkKnight(piece, pieces, player) {
  const pos = [
    { x: piece.x + 2, y: piece.y + 1 },
    { x: piece.x + 2, y: piece.y - 1 },
    { x: piece.x - 2, y: piece.y + 1 },
    { x: piece.x - 2, y: piece.y - 1 },
    { x: piece.x + 1, y: piece.y + 2 },
    { x: piece.x - 1, y: piece.y + 2 },
    { x: piece.x + 1, y: piece.y - 2 },
    { x: piece.x - 1, y: piece.y - 2 },
  ].filter(p => isValidPosition(p));
  for (let i = 0; i < pos.length; i += 1) {
    if (isKing(pos[i], pieces, player)) return true;
  }
  return false;
}

function checkPawn(piece, pieces, player) {
  const pos1 = [
    { x: piece.x + 1, y: piece.y + 1 },
    { x: piece.x - 1, y: piece.y + 1 },
  ].filter(p => isValidPosition(p));

  const pos2 = [
    { x: piece.x - 1, y: piece.y - 1 },
    { x: piece.x + 1, y: piece.y - 1 },
  ].filter(p => isValidPosition(p));

  if (player === 0) {
    for (let i = 0; i < pos1.length; i += 1) {
      if (isKing(pos1[i], pieces, player)) return true;
    }
  } else {
    for (let i = 0; i < pos2.length; i += 1) {
      if (isKing(pos2[i], pieces, player)) return true;
    }
  }
  return false;
}

// Returns an array of threats if the arrangement of
// the pieces is a check, otherwise false
function isCheck(pieces, player) {
  const res = [];
  pieces.filter(p => p.owner !== player).forEach((p) => {
    switch (p.piece) {
      case BISHOP:
        if (checkBishop(p, pieces, player)) res.push(p);
        break;
      case ROOK:
        if (checkRook(p, pieces, player)) res.push(p);
        break;
      case QUEEN:
        if (checkQueen(p, pieces, player)) res.push(p);
        break;
      case KNIGHT:
        if (checkKnight(p, pieces, player)) res.push(p);
        break;
      case PAWN:
        if (checkPawn(p, pieces, player)) res.push(p);
        break;
    }
  });
  return res.length > 0 ? res : false;
}

// Returns true if the arrangement of the
// pieces is a check mate, otherwise false
function isMate(pieces, player) {
  const king = pieces.filter(p => p.piece === KING && p.owner === player)[0];
  const playerPieces = pieces.filter(p => p.piece !== KING && p.owner === player);
  return [
    { ...king, x: king.x + 1, y: king.y },
    { ...king, x: king.x - 1, y: king.y },
    { ...king, x: king.x, y: king.y + 1 },
    { ...king, x: king.x, y: king.y - 1 },
    { ...king, x: king.x + 1, y: king.y + 1 },
    { ...king, x: king.x - 1, y: king.y + 1 },
    { ...king, x: king.x - 1, y: king.y - 1 },
    { ...king, x: king.x + 1, y: king.y - 1 },
  ]
  .filter(p => isValidPosition(p))
  .filter(p => playerPieces.every(p1 => !(p1.x === p.x && p1.y === p.y)))
  .map((k) => {
    const newPieces = pieces.filter(p => !(p.piece === KING && p.owner === player));
    newPieces.push(k);
    return newPieces;
  })
  .every(v => isCheck(v, player));
}

export {
  isCheck,
  isMate,
};
