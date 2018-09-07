import {
  GameEvent,
  GameStarted,
  UnitMoved,
  UnitSpawned,
  TurnStarted,
  UnitUpdated,
} from '../actions/GameEvents'
import { IClientState } from '../models'
import { PlayerAction } from '../actions/PlayerActions'
import {
  ClickOnTile,
  ClickOnUnitSpawnSelection,
  UIAction,
  RightClick,
  HoverTile,
} from '../actions/UIActions'
import {
  getUnitOnTile,
  getPathToTarget,
  updateTile,
  updateUnit,
  addUnit,
  getReachableTileIds,
} from './GameStateHelpers'
import {
  getSelectedUnit,
  updateUI,
  updateGame,
  isMyTurn,
  isMyUnit,
  getMovementTargetTileId,
  getMovementStartTileId,
  getRemainingMovePoints,
  getSelectedUnitId,
} from './ClientStateHelpers'
import log from '../lib/log'
import { last, values, partition } from 'ramda'
import { HexCoord } from '../types'
import UnitTypes from '../resources/UnitTypes'

export interface IClientStateAndActions {
  nextState?: IClientState
  actions?: PlayerAction[]
  action?: PlayerAction
}

export function ClientStateReducer(
  s: IClientState,
  a: UIAction | GameEvent,
): IClientState | IClientStateAndActions {
  switch (a.type) {
    // Events
    case 'GameStarted':
      return gameStarted(s, a)
    case 'TurnStarted':
      return turnStarted(s, a)
    case 'UnitMoved':
      return unitMoved(s, a)
    case 'UnitSpawned':
      return unitSpawned(s, a)
    case 'UnitUpdated':
      return unitUpdated(s, a)

    // Actions
    case 'HoverTile':
      return hoverTile(s, a)
    case 'RightClick':
      return rightClick(s, a)
    case 'ClickOnTile':
      return clickOnTile(s, a)
    case 'ClickOnUnitSpawnSelection':
      return clickOnUnitSpawnSelection(s, a)
    case 'ClickOnEndTurn':
      return clickOnEndTurn(s)
  }
}

function gameStarted(
  s: IClientState,
  { initialState }: GameStarted,
): IClientState {
  s = { ...s, game: initialState }
  return s
}

function turnStarted(
  s: IClientState,
  { activePlayerId }: TurnStarted,
): IClientState {
  s = updateGame(s, { activePlayerId })
  return s
}

function unitMoved(s: IClientState, { unitId, path }: UnitMoved): IClientState {
  const unit = s.game.units[unitId]

  const tileId = last(path)!

  s = updateGame(s, g => {
    g = updateTile(g, unit.tileId, { unitId: undefined })
    g = updateTile(g, tileId, { unitId })
    g = updateUnit(g, unitId, { tileId })
    return g
  })

  s = updateTileHighlights(s)

  return s
}

function unitSpawned(s: IClientState, { unit }: UnitSpawned): IClientState {
  s = updateGame(s, g => {
    g = addUnit(g, unit)
    g = updateTile(g, unit.tileId, { unitId: unit.unitId })
    return g
  })

  s = updateTileHighlights(s)

  return s
}

function unitUpdated(
  s: IClientState,
  { unitId, actionPoints, movePoints, hitPoints }: UnitUpdated,
): IClientState {
  s = updateGame(s, g => {
    g = updateUnit(g, unitId, unit => {
      return {
        actionPoints: actionPoints != null ? actionPoints : unit.actionPoints,
        movePoints: movePoints != null ? movePoints : unit.movePoints,
        hitPoints: hitPoints != null ? hitPoints : unit.hitPoints,
      }
    })
    return g
  })

  if (unitId == getSelectedUnitId(s)) {
    s = updateTileHighlights(s)
  }

  return s
}

function hoverTile(s: IClientState, { tileId }: HoverTile): IClientState {
  s = updateUI(s, { hoveredTileId: tileId })
  return s
}

function rightClick(s: IClientState, a: RightClick): IClientState {
  s = updateUI(s, { movementPathTileIds: [] })
  s = updateTileHighlights(s)
  return s
}

function clickOnTile(
  s: IClientState,
  { tileId }: ClickOnTile,
): IClientStateAndActions {
  // Try to select a unit on that tile
  const unit = getUnitOnTile(s.game, tileId)
  if (unit) {
    s = selectUnit(s, unit.unitId)
    return { nextState: s }
  }

  // Try to spawn a unit on that tile
  const spawnUnitTypeId = s.ui.selectedUnitSpawnTypeId
  if (spawnUnitTypeId) {
    if (isMyTurn(s)) {
      return {
        nextState: s,
        action: {
          type: 'SpawnUnit',
          tileId,
          unitTypeId: spawnUnitTypeId,
        },
      }
    }
  }

  // Try to move a selected unit to that tile
  const selectedUnit = getSelectedUnit(s)
  if (selectedUnit && isMyUnit(s, selectedUnit.unitId)) {
    // If we previously selected that tile as target, move the unit
    if (getMovementTargetTileId(s) == tileId) {
      if (isMyTurn(s)) {
        return moveUnit(s)
      }
    }

    // otherwise, first click only selects the tile as target
    s = createMovementPathToTile(s, tileId)
    return { nextState: s }
  }

  return { nextState: s }
}

function clickOnUnitSpawnSelection(
  s: IClientState,
  { unitTypeId }: ClickOnUnitSpawnSelection,
): IClientState {
  s = deselectUnit(s)

  const alreadySelected = s.ui.selectedUnitSpawnTypeId === unitTypeId
  const selectedUnitSpawnTypeId = alreadySelected ? null : unitTypeId

  return updateUI(s, { selectedUnitSpawnTypeId })
}

function clickOnEndTurn(s: IClientState): IClientStateAndActions {
  if (!isMyTurn(s)) {
    return {}
  }

  s = deselectUnit(s)

  return {
    nextState: s,
    action: { type: 'EndTurn' },
  }
}

function selectUnit(s: IClientState, unitId: string): IClientState {
  s = updateUI(s, { selectedUnitId: unitId, selectedUnitSpawnTypeId: null })
  s = updateTileHighlights(s)
  return s
}

function deselectUnit(s: IClientState): IClientState {
  const unit = getSelectedUnit(s)
  if (!unit) return s
  return updateUI(s, {
    selectedUnitId: null,
    tileHighlights: {},
    movementPathTileIds: [],
  })
}

function moveUnit(s: IClientState): IClientStateAndActions {
  const unit = getSelectedUnit(s)
  if (!unit) return { nextState: s }

  const path = s.ui.movementPathTileIds
  s = updateUI(s, { movementPathTileIds: [] })

  return {
    nextState: s,
    action: {
      type: 'MoveUnit',
      unitId: unit.unitId,
      path,
    },
  }
}

function createMovementPathToTile(
  s: IClientState,
  targetTileId: string,
): IClientState {
  const targetTile = s.game.map.tiles[targetTileId]
  if (targetTile.blocked) return s

  const movePoints = getRemainingMovePoints(s)
  if (!movePoints) return s

  const startTileId = getMovementStartTileId(s)
  if (!startTileId) return s

  const path = getPathToTarget(s.game, startTileId, targetTileId) || []
  if (movePoints < path.length) return s

  const movementPathTileIds = [
    ...s.ui.movementPathTileIds,
    ...path.map(tile => tile.tileId),
  ]
  s = updateUI(s, { movementPathTileIds })
  s = updateTileHighlights(s)
  return s
}

function updateTileHighlights(s: IClientState): IClientState {
  const tileHighlights = {}

  // tiles where we can move to
  const startTileId = getMovementStartTileId(s)
  if (startTileId) {
    const range = getRemainingMovePoints(s)
    if (range) {
      for (const tileId of getReachableTileIds(s.game, startTileId, range)) {
        tileHighlights[tileId] = {
          borderColor: '#ccc',
        }
      }
    }
  }

  // tiles with units that we can attack
  const [myUnits, enemyUnits] = partition(
    unit => unit.playerId == s.ui.localPlayerId,
    values(s.game.units),
  )

  for (const myUnit of myUnits) {
    const myCoord = HexCoord.fromId(myUnit.tileId)
    const range = UnitTypes[myUnit.unitTypeId].attackRange

    for (const enemyUnit of enemyUnits) {
      const theirCoord = HexCoord.fromId(enemyUnit.tileId)
      const dist = myCoord.distance(theirCoord)
      if (dist <= range) {
        tileHighlights[enemyUnit.tileId] = {
          borderColor: 'red',
        }
      }
    }
  }

  return updateUI(s, { tileHighlights })
}
