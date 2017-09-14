import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import NewsFeedSample from './news_feed_sample';

it('renders without crashing', () => {
	shallow(<NewsFeedSample />);
})