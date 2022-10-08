import React from 'react';
import ReactDOM from 'react-dom';

// This is the development state, when testing the web app. Will be injected from Encore with real data.
let injectedState = {
    message: 'Hello from dev',
};
if (typeof window !== 'undefined' && window.injectedState) {
    injectedState = window.injectedState;
}
console.log('test');

ReactDOM.render(<marquee>{injectedState.message}</marquee>, document.getElementById('root'));
