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
		let view, toggleButton, adminInstruction;
		
		if(this.state.adminView){
			view = <AdUploadContainer handleSaveArea={this.handleSaveArea} savedAds={this.state.savedAds}/>;
			toggleButton = <Button onClick={this.toggleView}>View Interactive Ads</Button>;
			adminInstruction = <p>Click on one of the ads below to set the traceable area.</p>;
		} else {
			view = <NewsFeedSample savedAds={this.state.savedAds}/>;
			toggleButton = <Button onClick={this.toggleView}>Return To Admin View</Button>;
			adminInstruction = "";
		}

    return (
      <div className="App">
				{toggleButton}
				{adminInstruction}
				{view}
      </div>
    );
  }
}
