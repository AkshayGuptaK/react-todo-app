import React from 'react'

function ToggleBtn (props) { // toggles between two button renders depending on condition
  if (props.condition) {
    return <button className={props.onClass} onClick={props.clickAction}></button>
  }
  return <button className={props.offClass} onClick={props.clickAction}></button>
}

export default ToggleBtn