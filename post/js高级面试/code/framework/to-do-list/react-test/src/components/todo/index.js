import React, { Component } from 'react'
import Input from './input/index.js'
import List from './list/index.js'

// class Component {
//     constructor(props) {

//     }
//     renderComponent() {
//         const prevVnode = this._vnode
//         const newVnode = this.render()
//         patch(prevVnode, newVnode)
//         this._vnode = newVnode
//     }
// }

class Todo extends Component {
    constructor(props) {
        super(props)
        this.state = {
            list: ['a', 'b']
        }
    }
    render() {
        return (
            <div>
                <Input addTitle={this.addTitle.bind(this)}/>
                <List data={this.state.list}/>
            </div>
        )

        /*
            React.createElement(
                "div",
                null,
                React.createElement(Input, { addTitle: this.addTitle.bind(this) }),
                React.createElement(List, { data: this.state.list })
            );
        */

        // React.createElement(List, { data: this.state.list })
        // var list = new List({ data: this.state.list })
        // var vnode = list.render()
    }
    addTitle(title) {
        const currentList = this.state.list
        this.setState({
            list: currentList.concat(title)
        }
            // , () => {
            //     // console.log(this.state.list)
            //     this.renderComponent()
            // }
        )
    }
}

export default Todo