import React from 'react'
import styled from 'styled-components'

interface ButtonProps {
  text: string
  onClick: () => void

  down?: boolean
  disabled?: boolean
}

export default function Button(props: ButtonProps) {
  return (
    <StyledButton
      onClick={() => {
        if (!props.disabled) props.onClick()
      }}
      down={props.down || false}
      disabled={props.disabled || false}
    >
      {props.text}
    </StyledButton>
  )
}

const StyledButton = styled.div<{ down: boolean; disabled: boolean }>`
  font-size: 120%;
  background-color: ${p => (p.down ? '#ccc' : '#888')};
  border: 2px transparent;
  border-radius: 8px;
  padding: 10px;
  margin: 2px;
  display: flex;
  justify-content: center;
  align-items: center;
`