'use strict';

import React from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, browserHistory, Redirect, IndexRoute, IndexRedirect, Link } from 'react-router';
import path from 'path';

import Home from './components/Home';

ReactDOM.render(
  <Router history={browserHistory}>
    <Route path="/*" component={Home} />
  </Router>,
  document.getElementById('app')
);


