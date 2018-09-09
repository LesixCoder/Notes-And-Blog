import React, { Component } from 'react'

class Input extends Component {
    constructor(props) {
        super(props)
        this.state = {
            title: ''
        }
    }
    render() {
        return (
            <div>
                <input value={this.state.title} onChange={this.changeHandle.bind(this)}/>
                <button onClick={this.clickHandle.bind(this)}>submit</button>
            </div>
        )
    }
    changeHandle(event) {
        this.setState({
            title: event.target.value
        })
    }
    clickHandle() {
        const title = this.state.title
        const addTitle = this.props.addTitle
        addTitle(title) // 重点！！！
        this.setState({
            title: ''
        })
    }
}

export default Input