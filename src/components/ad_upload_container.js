import React, {Component} from 'react';
import UploadedImageIndex from './uploaded_image_index';
import PropTypes from 'prop-types';

export default class AdUploadContainer extends Component{
	render(){
		const {handleSaveArea, savedAds} = this.props;
		
		return(
			<div>
				<UploadedImageIndex handleSaveArea={handleSaveArea} savedAds={savedAds}/>
			</div>
		)
	}
}
AdUploadContainer.propTypes = {
	handleSaveArea: PropTypes.func.isRequired,
	savedAds: PropTypes.object.isRequired,
}