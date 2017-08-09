/* eslint-disable  no-multi-spaces, no-unused-vars, no-console, one-var-declaration-per-line, one-var, default-case */
const LENGTH = 8;

const KING   = 'king';
const QUEEN  = 'queen';
const ROOK   = 'rook';
const KNIGHT = 'knight';
const BISHOP = 'bishop';
const PAWN   = 'pawn';

const isEmpty = (pos, pieces) => pieces.every(p => !(p.x === pos.x && p.y === pos.y));
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
  const n = player === 0 ? 1 : -1;
  const pos = [
    { x: piece.x + n, y: piece.y + n },
    { x: piece.x - n, y: piece.y + n },
  ].filter(p => isValidPosition(p));
  for (let i = 0; i < pos.length; i += 1) {
    if (isKing(pos[i], pieces, player)) return true;
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

function checkAllPiecePositions(piece, positions, pieces, player) {
  return positions
    .map((k) => {
      const newPieces = pieces.filter(p => p !== piece && !(p.x === k.x && p.y === k.y));
      newPieces.push(Object.assign({}, piece, k));
      return newPieces;
    })
    .every(v => isCheck(v, player));
}

function pawnCanIntercept(piece, pieces, player) {
  const positions = [], opponentPieces = pieces.filter(p => p.owner !== player);
  const n = player === 0 ? -1 : 1;
  let pos = { x: piece.x, y: piece.y + n };
  if (isEmpty(pos, pieces)) positions.push(pos);
  pos = { x: piece.x + n, y: piece.y + n };
  if (!isEmpty(pos, opponentPieces)) positions.push(pos);
  pos = { x: piece.x - n, y: piece.y + n };
  if (!isEmpty(pos, opponentPieces)) positions.push(pos);
  if (player === 0 && piece.y === 6) {
    pos = { x: piece.x, y: piece.y - 2 };
    if (isEmpty({ x: piece.x, y: piece.y - 1 }, pieces) && isEmpty(pos, pieces)) positions.push(pos);
  }
  if (player === 1 && piece.y === 1) {
    pos = { x: piece.x, y: piece.y + 2 };
    if (isEmpty({ x: piece.x, y: piece.y + 1 }, pieces) && isEmpty(pos, opponentPieces)) positions.push(pos);
  }
  return !checkAllPiecePositions(piece, positions, pieces, player);
}

function knightCanIntercept(piece, pieces, player) {
  const positions = [
    { x: piece.x + 2, y: piece.y + 1 },
    { x: piece.x + 2, y: piece.y - 1 },
    { x: piece.x - 2, y: piece.y + 1 },
    { x: piece.x - 2, y: piece.y - 1 },
    { x: piece.x + 1, y: piece.y + 2 },
    { x: piece.x - 1, y: piece.y + 2 },
    { x: piece.x + 1, y: piece.y - 2 },
    { x: piece.x - 1, y: piece.y - 2 },
  ].filter(p => isValidPosition(p));
  return !checkAllPiecePositions(piece, positions, pieces, player);
}
function bishopCanIntercept(piece, pieces, player) {
  const positions = [], playerPieces = pieces.filter(p => p.owner === player);
  let bottomRight = true, topRight = true, bottomLeft = true, topLeft = true, pos;
  for (let i = 0; i < LENGTH; i += 1) {
    pos = { x: i + piece.x, y: i + piece.y };
    if (bottomRight && isValidPosition(pos, piece)) {
      if (isEmpty(pos, playerPieces)) positions.push(pos);
      bottomRight = isEmpty(pos, pieces);
    }
    pos = { x: i + piece.x, y: piece.y - i };
    if (topRight && isValidPosition(pos, piece)) {
      if (isEmpty(pos, playerPieces)) positions.push(pos);
      topRight = isEmpty(pos, pieces);
    }
    pos = { x: piece.x - i, y: i + piece.y };
    if (bottomLeft && isValidPosition(pos, piece)) {
      if (isEmpty(pos, playerPieces)) positions.push(pos);
      bottomLeft = isEmpty(pos, pieces);
    }
    pos = { x: piece.x - i, y: piece.y - i };
    if (topLeft && isValidPosition(pos, piece)) {
      if (isEmpty(pos, playerPieces)) positions.push(pos);
      topLeft = isEmpty(pos, pieces);
    }
  }
  return !checkAllPiecePositions(piece, positions, pieces, player);
}
function rookCanIntercept(piece, pieces, player) {
  const positions = [], playerPieces = pieces.filter(p => p.owner === player);
  let bottom = true, top = true, left = true, right = true, pos;
  for (let i = 0; i < LENGTH; i += 1) {
    pos = { x: piece.x, y: i + piece.y };
    if (bottom && isValidPosition(pos, piece)) {
      if (isEmpty(pos, playerPieces)) positions.push(pos);
      bottom = isEmpty(pos, pieces);
    }
    pos = { x: piece.x, y: piece.y - i };
    if (top && isValidPosition(pos, piece)) {
      if (isEmpty(pos, playerPieces)) positions.push(pos);
      top = isEmpty(pos, pieces);
    }
    pos = { x: piece.x - i, y: piece.y };
    if (left && isValidPosition(pos, piece)) {
      if (isEmpty(pos, playerPieces)) positions.push(pos);
      left = isEmpty(pos, pieces);
    }
    pos = { x: piece.x + i, y: piece.y };
    if (right && isValidPosition(pos, piece)) {
      if (isEmpty(pos, playerPieces)) positions.push(pos);
      right = isEmpty(pos, pieces);
    }
  }
  return !checkAllPiecePositions(piece, positions, pieces, player);
}
function queenCanIntercept(piece, pieces, player) {
  return bishopCanIntercept(piece, pieces, player) || rookCanIntercept(piece, pieces, player);
}
function canIntercept(pieces, player) {
  const playerPieces = pieces.filter(p => p.piece !== KING && p.owner === player);
  for (let i = 0; i < playerPieces.length; i += 1) {
    const p = playerPieces[i];
    switch (p.piece) {
      case QUEEN:
        if (queenCanIntercept(p, pieces, player)) return true;
        break;
      case ROOK:
        if (rookCanIntercept(p, pieces, player)) return true;
        break;
      case BISHOP:
        if (bishopCanIntercept(p, pieces, player)) return true;
        break;
      case KNIGHT:
        if (knightCanIntercept(p, pieces, player)) return true;
        break;
      case PAWN:
        if (pawnCanIntercept(p, pieces, player)) return true;
        break;
    }
  }
  return false;
}

// Returns true if the arrangement of the
// pieces is a check mate, otherwise false
function isMate(pieces, player) {
  const king = pieces.filter(p => p.piece === KING && p.owner === player)[0];
  const playerPieces = pieces.filter(p => p.piece !== KING && p.owner === player);
  const positions = [
    { x: king.x + 1, y: king.y },
    { x: king.x - 1, y: king.y },
    { x: king.x, y: king.y + 1 },
    { x: king.x, y: king.y - 1 },
    { x: king.x + 1, y: king.y + 1 },
    { x: king.x - 1, y: king.y + 1 },
    { x: king.x - 1, y: king.y - 1 },
    { x: king.x + 1, y: king.y - 1 },
  ]
  .filter(p => isValidPosition(p))
  .filter(p => playerPieces.every(p1 => !(p1.x === p.x && p1.y === p.y)));
  return checkAllPiecePositions(king, positions, pieces, player) && !canIntercept(pieces, player);
}

export {
  isCheck,
  isMate,
};
