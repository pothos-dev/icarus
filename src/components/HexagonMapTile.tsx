import * as React from 'react'
import { withState } from './hoc/withState'
import { withGameStateAndDispatch } from './hoc/withGameState'
import MapUnit from './MapUnit'

interface HexagonMapTileProps {
  tileId: string
  tileSize: number
}

export default function HexagonMapTile(props: HexagonMapTileProps) {
  const { tileId, tileSize } = props

  return withGameStateAndDispatch(
    s => ({
      tile: s.map.tiles[tileId],
      isHighlighted: s.highlightedTileIds.find(id => id == tileId) != null,
    }),
    s => {
      const pos = s.tile.coord.toPixel(tileSize)
      console.log('render', tileId)
      return withState({ hovered: false }, (state, setState) => (
        <g id={tileId} transform={`translate(${pos.x}, ${pos.y})`}>
          <use
            xlinkHref={'#hexagon'}
            fill={s.tile.color}
            stroke={
              state.hovered
                ? 'white'
                : s.isHighlighted
                  ? 'lightgray'
                  : 'transparent'
            }
            onMouseEnter={() => setState({ hovered: true })}
            onMouseLeave={() => setState({ hovered: false })}
            onClick={() =>
              s.dispatch({
                type: 'ClickOnTile',
                tileId: s.tile.tileId,
              })
            }
          />
          {s.tile.unitId && <MapUnit unitId={s.tile.unitId} />}
        </g>
      ))
    },
  )
}
