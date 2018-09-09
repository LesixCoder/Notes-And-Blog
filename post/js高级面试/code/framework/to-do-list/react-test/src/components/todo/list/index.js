import React, { Component } from 'react'

class List extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const list = this.props.data
        return (
            <ul>
                {
                    list.map((item, index) => {
                        return <li key={index}>{item}</li>
                    })
                }
            </ul>
        )

        /*
            React.createElement(
                "ul",
                null,
                list.map((item, index) => {
                    return React.createElement(
                        "li",
                        { key: index },
                        item
                    );
                })
            );
        */
    }
}

export default List