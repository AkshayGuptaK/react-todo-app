import React from "react"
import {hot} from "react-hot-loader"
import "./App.css"

class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {}
  }
  render() {
    return(
      <div className="App">
        <h1>Carpe Diem</h1>
        
        <div id="inputDivider" class="divider"></div>

        <div id="completeDivider" class="divider"></div>
        <h2>Completed</h2>

      </div>
    )
  }
}

class Task extends React.Component {
  constructor (props) {
    super(props) // contains name, desc, completed
    this.state = { editNameOn: false, editDescOn: false } 
  }
  editOn () {
    this.state.editNameOn = true
  }
  descOn () {
    this.state.editDescOn = true
  }
  render() { // set id?
    <div className='task'>
    <EditField class='taskname' value={this.props.name} btnOnClass='acceptNameEditBtn' btnOffClass='editBtn'> submitFunc={}</EditField>
    <EditField class='taskdesc' value={this.props.desc} btnOnClass='acceptDescEditBtn' btnOffClass='describeBtn'> submitFunc={}</EditField>
    <ToggleBtn condition={this.props.completed} onClass='incompleteBtn' offClass='completeBtn' clickAction={}></ToggleBtn>
    <button className='deleteBtn' onClick={}></button>
    </div>
  }
}

class EditField extends React.Component {
  constructor (props) {
    super(props)
    this.state = {value: props.value, editOn: false}
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange (event) {
    this.setState({value: event.target.value})
  }
  handleClick (event) {
    if (this.state.editOn) {
      //put request of some props type using this.state.value
    }
    this.state.editOn = !this.state.editOn
  }
  render() {
    <div>
    <input type='text' className={this.props.class} disabled={!this.state.editOn} ></input>
    <ToggleBtn condition={this.state.editOn} onClass={this.props.btnOnClass} offClass={this.props.btnOffClass} clickAction={this.handleClick}></ToggleBtn>
    </div>
  }
}

function ToggleBtn (props) {
  if (props.condition) {
    return <button className={this.props.onClass} onClick={this.props.clickAction}></button>
  } return <button className={this.props.offClass} onClick={this.props.clickAction}></button>
}

export default hot(module)(App)