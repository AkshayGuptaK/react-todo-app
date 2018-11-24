import React from "react"

import EditField from "./EditField"
import ToggleBtn from "./ToggleButton"
import fetchRequests from "../fetch"

class Task extends React.Component { // display of a single task
  constructor (props) {
    super(props)
    this.delTask = this.delTask.bind(this)
    this.completeTask = this.completeTask.bind(this)
    this.applyChanges = this.applyChanges.bind(this)
  }
  delTask() { // submits a delete command to parent
    this.props.deleteAction(this.props.id)
  }
  completeTask() { // submits a complete command to parent
    this.props.completeAction(this.props.id, !this.props.completed)
  }
  applyChanges(field, value) { // submits an edit to db and submits modifications to parent on success
    fetchRequests.changeTask(this.props.id, field, value)
    .then(res => this.props.apply(this.props.id, field, value))
  }
  render() {
    return(
      <div className='task'>
      <EditField field='name' class='taskname' value={this.props.name} btnOnClass='acceptNameEditBtn' btnOffClass='editBtn' submitFunc={this.applyChanges}></EditField>
      <EditField field='description' class='taskdesc' value={this.props.desc} btnOnClass='acceptDescEditBtn' btnOffClass='describeBtn' submitFunc={this.applyChanges}></EditField>
      <ToggleBtn condition={this.props.completed} onClass='incompleteBtn' offClass='completeBtn' clickAction={this.completeTask}></ToggleBtn>
      <button className='taskDeleteBtn' onClick={this.delTask}></button>
      </div>
    )
  }
}

export default Task