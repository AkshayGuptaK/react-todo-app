import React from "react"
import {hot} from "react-hot-loader"

class Task extends React.Component {
    constructor (props) {
      super(props) // contains id, name, desc, completed, completeAction, deleteAction
      this.delTask = this.delTask.bind(this)
      this.completeTask = this.completeTask.bind(this)
      this.applyChanges = this.applyChanges.bind(this)
    }
    delTask() {
      this.props.deleteAction(this.props.id)
    }
    completeTask() {
      console.log('Complete a Task clicked') // debug
      this.props.completeAction(this.props.id, !this.props.completed)
    }
    applyChanges(field, value) {
      console.log('Submitting put request')
      fetch("http://localhost:8080/task/" + this.props.id + '/' + field + '/' + value, {
        method: 'PUT',
        mode: "cors"
      }) // error handling
    }
    render() {
      return(
        <div className='task'>
        <EditField field='name' class='taskname' value={this.props.name} btnOnClass='acceptNameEditBtn' btnOffClass='editBtn' submitFunc={this.applyChanges}></EditField>
        <EditField field='description' class='taskdesc' value={this.props.desc} btnOnClass='acceptDescEditBtn' btnOffClass='describeBtn' submitFunc={this.applyChanges}></EditField>
        <ToggleBtn condition={this.props.completed} onClass='incompleteBtn' offClass='completeBtn' clickAction={this.completeTask}></ToggleBtn>
        <button className='deleteBtn' onClick={this.delTask}></button>
        </div>
      )
    }
  }
  
class EditField extends React.Component {
  constructor (props) {
    super(props)
    this.state = {value: props.value, editOn: false}
    this.handleClick = this.handleClick.bind(this)
  }
  handleClick (event) {
    if (this.state.editOn) {
      this.props.submitFunc(this.props.field, this.state.value)
    }
    this.setState({editOn: !this.state.editOn})
  }
  render() {
    return(
      <React.Fragment>
      <input type='text' className={this.props.class} disabled={!this.state.editOn} value={this.state.value} onChange={(e)=>{this.setState({value: e.target.value})}}></input>
      <ToggleBtn condition={this.state.editOn} onClass={this.props.btnOnClass} offClass={this.props.btnOffClass} clickAction={this.handleClick}></ToggleBtn>
      </React.Fragment>
    )
  }
}
  
function ToggleBtn (props) {
  if (props.condition) {
    // console.log('Button on', props.onClass)
    return <button className={props.onClass} onClick={props.clickAction}></button>
  }     // console.log('Button off', props.offClass)
  return <button className={props.offClass} onClick={props.clickAction}></button>
}

export default hot(module)(Task)