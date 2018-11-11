import React, { Fragment } from 'react';
import { render } from 'react-dom';
import { Component as ReactLibComponent } from '@organization/react-lib';

import Component from './Component';

import './index.css';

render(
  <Fragment>
    <Component />
    <ReactLibComponent />
  </Fragment>,
  document.getElementById('root'),
);