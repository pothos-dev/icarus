import React from 'react'
import SvgViewer from '../map/SvgViewer'
import Tile from '../map/Tile'
import { VBox, ExpandingHBox, Spacer } from '../layout'
import { SliderPicker, ColorResult, CirclePicker } from 'react-color'
import styled from 'styled-components'
import { IHexagonMap, IHexagonMapTile, IWall } from '../../models'
import { createMap } from '../../lib/MapCreator'
import { withState } from '../hoc/withState'
import { assocPath, without } from 'ramda'
import Button from '../ui/Button'
import { saveAs } from 'file-saver'
import { Point, HexCoord } from '../../types'
import Wall from '../map/Wall'

interface MapEditorState {
  color: string
  mode: EditMode
  map: IHexagonMap
}

type EditMode = 'colored tile' | 'blocked tile' | 'add wall' | 'remove wall'

function createEmptyMap(): IHexagonMap {
  return createMap()
}

export default function MapEditor() {
  const defaultState: MapEditorState = {
    color: '#F44336',
    mode: 'colored tile',
    map: createEmptyMap(),
  }

  return withState(defaultState, (state, setState) => {
    function onSweepTile(tileId: string, nearestTileId: string) {
      switch (state.mode) {
        case 'colored tile':
          return updateTile(tileId, { color: state.color, blocked: false })
        case 'blocked tile':
          return updateTile(tileId, { color: 'black', blocked: true })
        case 'add wall':
          return addWall(tileId, nearestTileId)
        case 'remove wall':
          return removeWall(tileId, nearestTileId)
      }
    }

    function updateTile(tileId: string, partial: Partial<IHexagonMapTile>) {
      const tile = { ...state.map.tiles[tileId], ...partial }
      const tiles = { ...state.map.tiles, [tileId]: tile }
      const map = { ...state.map, tiles }
      setState({ map })
    }

    function isEqualWall(a: IWall, b: IWall) {
      return (
        (a.leftTileId == b.leftTileId && a.rightTileId == b.rightTileId) ||
        (a.leftTileId == b.rightTileId && a.rightTileId == b.leftTileId)
      )
    }

    function addWall(leftTileId: string, rightTileId: string) {
      const wall = { leftTileId, rightTileId }
      const hasWall = state.map.walls.find(w => isEqualWall(w, wall)) != null
      if (hasWall) return

      const walls = [...state.map.walls, wall]
      const map = { ...state.map, walls }
      setState({ map })
    }

    function removeWall(leftTileId: string, rightTileId: string) {
      const wall = { leftTileId, rightTileId }
      const walls = state.map.walls.filter(w => !isEqualWall(w, wall))
      const map = { ...state.map, walls }
      setState({ map })
    }

    function setColor(result: ColorResult) {
      setState({ color: result.hex })
    }

    function downloadMap() {
      const fileContent = JSON.stringify(state.map)
      const blob = new Blob([fileContent], { type: 'text/json;charset=utf-8' })
      saveAs(blob, 'map.json')
    }

    function ModeButton({ mode }: { mode: EditMode }) {
      return (
        <Button
          text={mode}
          down={state.mode == mode}
          onClick={() => setState({ mode })}
        />
      )
    }

    return (
      <ExpandingHBox>
        <StyledLeftSide>
          <StyledColorContainer>
            <CirclePicker color={state.color} onChangeComplete={setColor} />
          </StyledColorContainer>
          <ModeButton mode={'colored tile'} />
          <ModeButton mode={'blocked tile'} />
          <ModeButton mode={'add wall'} />
          <ModeButton mode={'remove wall'} />
          <Spacer />
          <Button text={'Download'} onClick={downloadMap} />
        </StyledLeftSide>
        <Map map={state.map} onSweepTile={onSweepTile} />
      </ExpandingHBox>
    )
  })
}

const StyledColorContainer = styled.div`
  margin: 10px;
`

const StyledLeftSide = styled(VBox)`
  padding: 10px;
`

function Map(props: {
  map: IHexagonMap
  onSweepTile: (tileId: string, nearestTileId: string) => void
}) {
  function onSweep(pos: Point) {
    const [tile, near] = HexCoord.neighborsFromPixel(pos)
    props.onSweepTile(tile.id, near.id)
  }

  return (
    <SvgViewer
      center={{ x: 0, y: 0 }}
      size={40}
      scrollSpeed={0.01}
      zoomFactor={1.2}
      zoomInSteps={4}
      zoomOutSteps={4}
      onSweep={onSweep}
    >
      {Object.keys(props.map.tiles).map(tileId => (
        <Tile
          key={tileId}
          tileId={tileId}
          fillColor={props.map.tiles[tileId].color}
          strokeColor={props.map.tiles[tileId].color}
        />
      ))}
      {props.map.walls.map((wall, index) => (
        <Wall key={index} wall={wall} />
      ))}
    </SvgViewer>
  )
}