import React from "react"
import {hot} from "react-hot-loader"
import InputField from "./InputField.js"

class Input extends React.Component {
  constructor (props) {
    super(props)
    this.state = {'name': '', 'description': ''}
    this.addTask = this.addTask.bind(this)
  }
  addTask (event) {
    event.preventDefault()
    if ( !/\S+/.test(this.state.name) ) {
      alert('Please enter a task name')
    } else {
      this.props.submit(this.state.name, this.state.description)
      this.setState({'name':'', 'description':''})
    }
  }
  render() {
    return(
      <form>
      <InputField id='inputTaskName' value={this.state.name} update={(value)=>{this.setState({'name': value})}}></InputField>
      <InputField id='inputTaskDescription' value={this.state.description} update={(value)=>{this.setState({'description': value})}}></InputField>
      <button id='addtask' onClick={this.addTask}></button>
      </form>
    )
  }
}

export default hot(module)(Input)