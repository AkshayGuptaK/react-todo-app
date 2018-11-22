import React from "react"
import {hot} from "react-hot-loader"
import InputField from "./InputField"

class ListInput extends React.Component {
    constructor (props) {
      super(props)
      this.state = {'name': ''}
      this.addList = this.addList.bind(this)
    }
    addList (event) {
      event.preventDefault()
      if ( !/\S+/.test(this.state.name) ) {
        alert('Please enter a list name')
      } else {
        this.props.submit(this.state.name)
        this.setState({'name':''})
      }
    }
    render() {
      return(
        <form>
          <InputField id='inputTaskName' value={this.state.name} update={(value)=>{this.setState({'name': value})}}></InputField>
          <button id='addlist' onClick={this.addList}></button>
        </form>
      )
    }
  }

  export default hot(module)(ListInput)