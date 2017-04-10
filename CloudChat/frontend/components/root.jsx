import React from 'react';
import {Provider} from 'react-redux';
import {BrowserRouter as Router, Route, IndexRoute} from 'react-router-dom';

import App from './app';

const Root = (props) =>{
  return(
    <Provider store={props.store}>
      <Router>
        <Route path="/" component={App}>
        </Route>
      </Router>
    </Provider>
  );
}

export default Root;
