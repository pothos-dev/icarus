import {
  IUnit,
  IHexagonMapTile,
  IPlayer,
  IUnitType,
  IGameState,
} from '../models'
import UnitTypes from '../resources/UnitTypes'
import { HexCoord } from '../lib/HexCoord'
import aStar from 'a-star'
import { contains, head, tail } from 'ramda'

export function addUnit(s: IGameState, unit: IUnit) {
  let units = s.units
  units = { ...units, [unit.unitId]: unit }
  return { ...s, units }
}

export function removeUnit(s: IGameState, unitId: string) {
  const { [unitId]: removedUnit, ...units } = s.units
  return { ...s, units }
}

export function updateTile(
  s: IGameState,
  tileId: string,
  partial: Partial<IHexagonMapTile>,
): IGameState {
  let map = s.map
  let tiles = map.tiles
  let tile = { ...tiles[tileId], ...partial }
  tiles = { ...tiles, [tileId]: tile }
  map = { ...map, tiles }
  return { ...s, map }
}

export function updateUnit(
  s: IGameState,
  unitId: string,
  partialOrUpdater: Partial<IUnit> | ((unit: IUnit) => Partial<IUnit>),
): IGameState {
  let units = s.units
  let unit = units[unitId]

  let partial = partialOrUpdater
  if (typeof partialOrUpdater == 'function') {
    partial = partialOrUpdater(unit)
  }

  unit = { ...unit, ...partial }
  units = { ...units, [unitId]: unit }
  return { ...s, units }
}

export function updateUnits(
  s: IGameState,
  updater: (unit: IUnit) => Partial<IUnit> | null,
) {
  const updates = {}
  for (const unitId of Object.keys(s.units)) {
    const unit = s.units[unitId]
    const update = updater(unit)
    if (!update) continue
    updates[unitId] = { ...unit, ...update }
  }
  return { ...s, units: { ...s.units, ...updates } }
}

export function updatePlayer(
  s: IGameState,
  playerId: string,
  partial: Partial<IPlayer>,
): IGameState {
  let players = s.players
  let player = { ...players[playerId], ...partial }
  players = { ...players, [playerId]: player }
  return { ...s, players }
}

export function getUnitOnTile(
  s: IGameState,
  tileId: string | null,
): IUnit | null {
  if (!tileId) return null
  const unitId = s.map.tiles[tileId].unitId
  if (!unitId) return null
  return s.units[unitId]
}

export function hexCoordOf(tile: IHexagonMapTile | string): HexCoord {
  const tileId = typeof tile == 'string' ? tile : tile.tileId
  return HexCoord.fromId(tileId)
}

export function getTileOfUnit(s: IGameState, unitId: string): IHexagonMapTile {
  const unit = s.units[unitId]
  return s.map.tiles[unit.tileId]
}

export function getTypeOfUnit(s: IGameState, unitId: string): IUnitType {
  const unit = s.units[unitId]
  return UnitTypes[unit.unitTypeId]
}

export function canSpawnUnit(s: IGameState, tileId: string): boolean {
  const tile = s.map.tiles[tileId]
  return !tile.blocked
}

export function canMoveUnit(
  s: IGameState,
  unitId: string,
  path: string[],
): boolean {
  const unit = s.units[unitId]
  if (unit.actionPoints == 0) return false
  if (unit.movePoints < path.length) return false

  const startTile = getTileOfUnit(s, unitId)
  // TODO test if path is connected and adjacent to unit tile

  return true
}

export function canAttack(
  s: IGameState,
  attackerUnitId: string | null,
  attackedUnitId: string | null,
  attackerPlayerId: string,
): boolean {
  if (!attackerUnitId) return false
  if (!attackedUnitId) return false

  if (s.activePlayerId != attackerPlayerId) return false

  const attackerUnit = s.units[attackerUnitId]
  const attackedUnit = s.units[attackedUnitId]

  if (attackerUnit.playerId != attackerPlayerId) return false
  if (attackedUnit.playerId == attackerPlayerId) return false

  if (attackerUnit.actionPoints == 0) return false

  const attackerTile = s.map.tiles[attackerUnit.tileId]
  const attackedTile = s.map.tiles[attackedUnit.tileId]

  const dist = hexCoordOf(attackerTile).distance(hexCoordOf(attackedTile))
  const range = UnitTypes[attackerUnit.unitTypeId].attackRange

  return dist <= range
}

export function getPathToTarget(
  s: IGameState,
  startTileId: string,
  targetTileId: string,
): IHexagonMapTile[] | null {
  const targetCoord = hexCoordOf(targetTileId)

  const result = aStar<IHexagonMapTile>({
    start: s.map.tiles[startTileId],
    isEnd: tile => tile.tileId === targetTileId,
    neighbor: tile => getNeighborTiles(s, tile),
    distance: (from, to) => (to.blocked ? 1000000 : 1),
    heuristic: node => hexCoordOf(node).distance(targetCoord),
    hash: tile => tile.tileId,
  })

  if (result.status !== 'success') {
    return null
  }

  return tail(result.path)
}

export function getNeighborTiles(
  s: IGameState,
  tile: IHexagonMapTile,
): IHexagonMapTile[] {
  const result: IHexagonMapTile[] = []
  const neighborIds = hexCoordOf(tile)
    .neighbors()
    .map(c => c.id)
  for (const id of neighborIds) {
    const neighbor = s.map.tiles[id]
    if (neighbor) {
      result.push(neighbor)
    }
  }
  return result
}

export function getReachableTileIds(
  s: IGameState,
  startTileId: string,
  range: number,
): string[] {
  const startTile = s.map.tiles[startTileId]

  let currentTiles = [startTile]

  const tileDistances = {
    [startTileId]: 0,
  }

  while (currentTiles.length) {
    const nextTiles = []
    for (const tile of currentTiles) {
      const dist = tileDistances[tile.tileId]
      for (const neighbor of getNeighborTiles(s, tile)) {
        if (neighbor.blocked) continue
        const neighborDist = dist + 1
        if (neighborDist > range) continue
        if (
          tileDistances[neighbor.tileId] == null ||
          tileDistances[neighbor.tileId] > neighborDist
        ) {
          tileDistances[neighbor.tileId] = neighborDist
          nextTiles.push(neighbor)
        }
      }
    }
    currentTiles = nextTiles
  }

  return Object.keys(tileDistances)
}

export function getReachableTileIdsForUnit(
  s: IGameState,
  unitId: string,
): string[] {
  const unitTile = getTileOfUnit(s, unitId)
  const movePoints = getTypeOfUnit(s, unitId).movePoints
  return getReachableTileIds(s, unitTile.tileId, movePoints)
}
