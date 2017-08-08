/* eslint-disable  no-multi-spaces, no-unused-vars, no-console, one-var-declaration-per-line, one-var */
const LENGTH = 8;

const KING   = 'king';
const QUEEN  = 'queen';
const ROOK   = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const PAWN   = 'pawn';

function isKing(pos, pieces, player) {
  return pieces.filter(p => p.piece === KING && p.owner === player && p.x === pos.x && p.y === pos.y).length === 1;
}

function isEmpty(pos, pieces) {
  return !pieces.every(p => p.x === pos.x && p.y === pos.y);
}

function isValidPosition(p) {
  return p.x >= 0 && p.x < LENGTH && p.y >= 0 && p.y < LENGTH;
}

function checkBishop(piece, pieces, player) {
  let bottomRight = true, topRight = true, bottomLeft = true, topLeft = true, pos;
  for (let i = 0; i < LENGTH; i += 1) {
    pos = { x: i + piece.x, y: i + piece.y };
    if (bottomRight && isValidPosition(pos)) {
      if (isKing(pos, pieces, player)) return true;
      bottomRight = isEmpty(pos, pieces);
    }
    pos = { x: i + piece.x, y: piece.y - i };
    if (topRight && isValidPosition(pos)) {
      if (isKing(pos, pieces, player)) return true;
      topRight = isEmpty(pos, pieces);
    }
    pos = { x: piece.x - i, y: i + piece.y };
    if (bottomLeft && isValidPosition(pos)) {
      if (isKing(pos, pieces, player)) return true;
      bottomLeft = isEmpty(pos, pieces);
    }
    pos = { x: piece.x - i, y: piece.y - i };
    if (topLeft && isValidPosition(pos)) {
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
    if (bottom && isValidPosition(pos)) {
      if (isKing(pos, pieces, player)) return true;
      bottom = isEmpty(pos, pieces);
    }
    pos = { x: piece.x, y: piece.y - i };
    if (top && isValidPosition(pos)) {
      if (isKing(pos, pieces, player)) return true;
      top = isEmpty(pos, pieces);
    }
    pos = { x: piece.x - i, y: piece.y };
    if (left && isValidPosition(pos)) {
      if (isKing(pos, pieces, player)) return true;
      left = isEmpty(pos, pieces);
    }
    pos = { x: piece.x + i, y: piece.y };
    if (right && isValidPosition(pos)) {
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
    if (p.piece === BISHOP && checkBishop(p, pieces, player)) res.push(p);
    if (p.piece === ROOK   && checkRook(p, pieces, player))   res.push(p);
    if (p.piece === QUEEN  && checkQueen(p, pieces, player))  res.push(p);
    if (p.piece === KNIGHT && checkKnight(p, pieces, player)) res.push(p);
    if (p.piece === PAWN   && checkPawn(p, pieces, player))   res.push(p);
  });
  return res;
}

// Returns true if the arrangement of the
// pieces is a check mate, otherwise false
function isMate(pieces, player) {
  return [];
}

export {
  isCheck,
  isMate,
};
