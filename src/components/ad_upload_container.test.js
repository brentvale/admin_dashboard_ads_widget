import React from 'react';
import {expect} from 'chai';
import {shallow} from 'enzyme';

import AdUploadContainer from './ad_upload_container';

it('renders without crashing', () => {
	shallow(<AdUploadContainer />);
})