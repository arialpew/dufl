import React from 'react';
import ReactDOM from 'react-dom';

import { Component } from '../Component';

it('render without crashing', () => {
  const div = document.createElement('div');

  ReactDOM.render(<Component />, div);

  ReactDOM.unmountComponentAtNode(div);
});