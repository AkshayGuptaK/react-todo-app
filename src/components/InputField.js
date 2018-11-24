import React from "react"

class InputField extends React.Component { 
  // input field that submits changes to parent and receives updated values back
  render() {
    return(
      <input
      type="text"
      id={this.props.id} 
      value={this.props.value} 
      onChange={(e)=>{this.props.update(e.target.value)}}>
      </input>
    )
  }
}

export default InputField