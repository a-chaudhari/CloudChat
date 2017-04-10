import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';

document.addEventListener('DOMContentLoaded',()=>{
  const root = document.getElementById('root');
  let preload = {};
  const store = configureStore(preload);

  ReactDOM.render(<Root store={store}/>, root);
})
