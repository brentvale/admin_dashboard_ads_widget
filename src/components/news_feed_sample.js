import React, {Component} from 'react';
import UploadedImageIndex from './uploaded_image_index';
import PropTypes from 'prop-types';
import NewsFeedAd from './news_feed_ad';

export default class NewsFeedSample extends Component{
	render(){
		const {savedAds} = this.props;
		let adsDisplay = [];
		let idx = 0;
		for(let i in savedAds){
			adsDisplay.push(<NewsFeedAd title={i} key={idx} coords={savedAds[i]}/>);
			idx += 1;
		}
		return(
			<div>
				{adsDisplay.map((newsFeedAd) => {
					return newsFeedAd;
				})}
			</div>
		)
	}
}
NewsFeedSample.propTypes = {
	savedAds: PropTypes.object.isRequired
}