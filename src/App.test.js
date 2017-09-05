import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyne';

import App from './App';

it('renders without crashing', () => {
  shallow(<App />)
});
