import React from "react"
import {hot} from "react-hot-loader"
import "./App.css"

class App extends React.Component{
  render() {
    return(
      <div className="App">
        <h1> Hello, World! </h1>
      </div>
    )
  }
}

class EditField extends React.Component{
  constructor (props) {
    super(props)
    this.state = {value: props.value, enabled: false}
    this.handleChange = this.handleChange.bind(this)
  }
  handleChange () {
    this.setState({value: event.target.value})
  }
  render () {
    <input type='text' className='' disabled='' ></input>
  }
}

function EditBtn (props) {
  if (props.editNameOn) {
    return <button className='acceptNameEditBtn'></button>
  } return <button className='editBtn'></button>
} 

function DescribeBtn (props) {
  if (props.editDescOn) {
    return <button className='acceptDescEditBtn'></button>
  } return <button className='describeBtn'></button>
}

function CompleteBtn (props) {
  if (props.completed) {
    return <button className='incompleteBtn'></button>
  } return <button className='completeBtn'></button>
}

function DeleteBtn (props) {
  return <button className='deleteBtn'></button>
}

export default hot(module)(App)