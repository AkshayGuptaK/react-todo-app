import React from "react"
import {hot} from "react-hot-loader"

class InputField extends React.Component {
  render() {
    return(
      <input
      type='text' 
      id={this.props.id} 
      value={this.props.value} 
      onChange={(e)=>{this.props.update(e.target.value)}}>
      </input>
    )
  }
}

export default hot(module)(InputField)