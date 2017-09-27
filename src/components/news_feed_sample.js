import React, {Component} from 'react';
import PropTypes from 'prop-types';
import NewsFeedAd from './news_feed_ad';

export default class NewsFeedSample extends Component{
	render(){
		const {savedAds} = this.props;
		let adsDisplay = [];
		let idx = 0;
		let atLeastOneSavedAd = false;
		for(let i in savedAds){
			atLeastOneSavedAd = true;
			adsDisplay.push(<NewsFeedAd title={i} key={idx} coords={savedAds[i]}/>);
			idx += 1;
		}
		
		if(!atLeastOneSavedAd){
			return(
				<div>
					<p>Before you can view ads here, you must click on an ad from the admin view and select the traceable area.</p>
				</div>
			)
		} else {
			return(
				<div>
					{adsDisplay.map((newsFeedAd) => {
						return newsFeedAd;
					})}
				</div>
			)
		}
	}
}
NewsFeedSample.propTypes = {
	savedAds: PropTypes.object.isRequired
}