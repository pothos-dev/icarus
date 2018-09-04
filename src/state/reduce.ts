import {
  UserAction,
  ClickOnTile,
  ClickOnUnitSpawnSelection,
} from '../actions/UserActions'
import { IGameState, IUnit, IHexagonMapTile } from '../models'
import { createId } from '../lib/createId'
import {
  addUnit,
  updateTile,
  updatePlayer,
  getUnitOnTile,
  getTileOfUnit,
  updateUnit,
  getSelectedUnitOfPlayer,
  getTypeOfUnit,
} from './helpers'
import { contains } from 'ramda'

export function reduce(
  s: IGameState,
  a: UserAction,
  executingPlayerId: string,
): IGameState {
  switch (a.type) {
    case 'ClickOnTile': {
      return clickOnTile(s, a, executingPlayerId)
    }
    case 'ClickOnUnitSpawnSelection': {
      return clickOnUnitSpawnSelection(s, a, executingPlayerId)
    }
  }
}

function clickOnTile(
  s: IGameState,
  a: ClickOnTile,
  playerId: string,
): IGameState {
  // each player may select a unit on the tile
  const unit = getUnitOnTile(s, a.tileId)
  if (unit) {
    return selectUnit(s, unit.unitId, playerId)
  }

  // only the active player may do the other things
  if (playerId != s.activePlayerId) {
    return s
  }

  // the player may move a selected unit to that tile
  // TODO: check if movement is allowed (range)
  const selectedUnit = getSelectedUnitOfPlayer(s, playerId)
  if (selectedUnit) {
    return moveUnit(s, selectedUnit.unitId, a.tileId)
  }

  // if the user has a UnitSpawn selected, spawn a unit here
  const unitTypeId = s.players[playerId].selectedUnitSpawnTypeId
  if (unitTypeId) {
    return spawnUnit(s, unitTypeId, a.tileId, playerId)
  }

  return s
}

function clickOnUnitSpawnSelection(
  s: IGameState,
  a: ClickOnUnitSpawnSelection,
  playerId: string,
): IGameState {
  const alreadySelected =
    s.players[playerId].selectedUnitSpawnTypeId === a.unitTypeId

  s = updatePlayer(s, playerId, {
    selectedUnitId: null,
    selectedUnitSpawnTypeId: alreadySelected ? null : a.unitTypeId,
  })
  s = updateHighlightedTiles(s)
  return s
}

function spawnUnit(
  s: IGameState,
  unitTypeId: string,
  tileId: string,
  playerId: string,
): IGameState {
  const unitId = createId('unit')
  const unit: IUnit = {
    unitId,
    playerId,
    unitTypeId,
    tileId: tileId,
  }
  s = addUnit(s, unit)
  s = updateTile(s, tileId, { unitId })
  return s
}

function selectUnit(
  s: IGameState,
  unitId: string,
  playerId: string,
): IGameState {
  s = updatePlayer(s, playerId, {
    selectedUnitId: unitId,
    selectedUnitSpawnTypeId: null,
  })
  s = updateHighlightedTiles(s)
  return s
}

function moveUnit(s: IGameState, unitId: string, tileId: string): IGameState {
  const unit = s.units[unitId]
  s = updateTile(s, unit.tileId, { unitId: undefined })
  s = updateTile(s, tileId, { unitId })
  s = updateUnit(s, unitId, { tileId })
  s = updateHighlightedTiles(s)
  return s
}

function updateHighlightedTiles(s: IGameState) {
  const unit = getSelectedUnitOfPlayer(s, s.activePlayerId)
  if (!unit) {
    return { ...s, highlightedTileIds: [] }
  }

  // Highlight tiles where unit can move
  const highlightedTileIds = getValidMovementTargets(s, unit.unitId).map(
    tile => tile.tileId,
  )

  return { ...s, highlightedTileIds }
}

function getValidMovementTargets(
  s: IGameState,
  unitId: string,
): IHexagonMapTile[] {
  const unitTile = getTileOfUnit(s, unitId)
  const movePoints = getTypeOfUnit(s, unitId).movePoints

  let targets: IHexagonMapTile[] = []
  let workTiles = [unitTile]
  let nextTiles = []

  while (workTiles.length > 0) {
    for (const workTile of workTiles) {
      for (const neighbor of getNeighborTiles(s, workTile)) {
        if (neighbor.coord.distance(unitTile.coord) > movePoints) continue
        if (contains(neighbor, targets)) continue
        if (contains(neighbor, nextTiles)) continue
        nextTiles.push(neighbor)
      }
    }
    targets = [...targets, ...workTiles]
    workTiles = nextTiles
    nextTiles = []
  }

  return targets
}

function getNeighborTiles(
  s: IGameState,
  tile: IHexagonMapTile,
): IHexagonMapTile[] {
  const result: IHexagonMapTile[] = []
  const neighborIds = tile.coord.neighbors().map(c => c.id)
  for (const id of neighborIds) {
    const neighbor = s.map.tiles[id]
    if (neighbor) {
      result.push(neighbor)
    }
  }
  return result
}
