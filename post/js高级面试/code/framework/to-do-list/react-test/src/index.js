import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

// patch(container, vnode)
ReactDOM.render(<App/>, document.getElementById('root'));
registerServiceWorker();

/*
    React.createElement(App, null);
    var app = new App()
    return app.render()
*/
