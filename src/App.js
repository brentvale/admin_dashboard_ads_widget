import React, { Component } from 'react';
import {Button} from 'react-bootstrap';
import './App.css';
import AdUploadContainer from './components/ad_upload_container';
import NewsFeedSample from './components/news_feed_sample';

export default class App extends Component {
	constructor(){
		super();
		this.state = {
			savedAds: {},
			adminView: true,
		};
		this.handleSaveArea = this.handleSaveArea.bind(this);
		this.toggleView = this.toggleView.bind(this);
	}
	
	handleSaveArea(options){
		let newSavedAds = Object.assign({}, this.state.savedAds);
		newSavedAds[options.currentAdTitle] = options.coordsSet;
		this.setState({savedAds: newSavedAds})
	}
	
	toggleView(){
		this.setState({adminView: !this.state.adminView});
	}
	
  render() {
		const view = (this.state.adminView) ? <AdUploadContainer handleSaveArea={this.handleSaveArea} savedAds={this.state.savedAds}/>
																				: <NewsFeedSample savedAds={this.state.savedAds}/>;
    return (
      <div className="App">
				<Button onClick={this.toggleView}>VIEW ADS IN FEED</Button>
				{view}
      </div>
    );
  }
}
