import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import UploadedImageIndex from './uploaded_image_index';

it('renders without crashing', () => {
	shallow(<UploadedImageIndex />);
})