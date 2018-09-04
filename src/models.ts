import { HexCoord } from './types'

export interface IAction {
  type: string
}

export interface IGameState {
  map: IHexagonMap
  units: { [unitId: string]: IUnit }
  players: { [playerId: string]: IPlayer }

  localPlayerId: string
  activePlayerId: string

  // Client specific data?
  highlightedTileIds: string[]
  targetTileId?: string
}

export interface IPlayer {
  playerId: string
  color: string

  selectedUnitId: string | null
  selectedUnitSpawnTypeId: string | null
}

export interface IHexagonMap {
  tiles: { [id: string]: IHexagonMapTile }
}

export interface IHexagonMapTile {
  tileId: string
  coord: HexCoord
  color: string
  unitId?: string
  blocked?: boolean
}

export interface IUnit {
  unitId: string
  unitTypeId: string
  playerId: string
  tileId: string
}

export interface IUnitType {
  unitTypeId: string
  svgPath: string
  movePoints: number
}
