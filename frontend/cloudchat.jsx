import React from 'react';
import ReactDOM from 'react-dom';
import Root from './components/root';
import configureStore from './store/store';

document.addEventListener('DOMContentLoaded',()=>{
  const root = document.getElementById('root');
  let preload = {};
  if(window.currentUser){
    preload={
      session:{errors:[], session:window.currentUser}
    }
  };
  const store = configureStore(preload);
  window.store = store;

  ReactDOM.render(<Root store={store}/>, root);
})
