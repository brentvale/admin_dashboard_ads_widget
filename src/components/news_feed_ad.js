import React, {Component} from 'react';
import PropTypes from 'prop-types';

import HotelTonightAdSrc from '../images/hotel_tonight_ad_v2.png';
import StripeAdSrc from '../images/stripe_ad_v2.png';
import SlackAdSrc from '../images/slack_ad_one_color.png';

const RADIUS_TO_FILL = 50;

export default class NewsFeedAd extends Component{
	constructor(props){
		super(props);
		this.state = {
			title: props.title,
			startCoords: props.coords,
			filledInCoords: [],
			hex: props.coords.hex,
			yOffset: null,
			animationCount: 0,
			playAnimation: false
		};
		this.backgroundImageFromProps = this.backgroundImageFromProps.bind(this);
		this.dotDisplay = this.dotDisplay.bind(this);
		this.handleMouseMove = this.handleMouseMove.bind(this);
		this.withinRange = this.withinRange.bind(this);
	}
	
	backgroundImageFromProps(){
		switch(this.props.title){
		case "Hotel Tonight":
			return HotelTonightAdSrc;
			break;
		case "Stripe":
			return StripeAdSrc;
			break;
		case "Slack":
			return SlackAdSrc;
			break;
		default: return SlackAdSrc;
		}
	}
	
	dotDisplay(options){
		const color = (options.beenTouched) ? "red" : "blue";
		return <div key={options.key}
								style={{position: "absolute", 
												left: `${parseInt(options.stringCoords.slice(0, options.sliceIdx))/2}px`, 
												top: `${parseInt(options.stringCoords.slice(options.sliceIdx+1, options.stringCoords.length))/2}px`,
												height: "4px",
												width: "4px",
												borderRadius: "2px",
												backgroundColor: color,
												zIndex: "10"}}></div>;
	}
	
	handleMouseMove(e){
		let x, y;
		
		if(typeof e.targetTouches !== "undefined"){
			x = e.targetTouches[0].pageX;
			y = e.targetTouches[0].pageY;
		} else {
			x = e.pageX;
			//e.currentTarget.offsetTop is temp fix until news feed display is assembled
			y = e.pageY - e.currentTarget.offsetTop;
		}
		
		let newStartCoords = Object.assign({}, this.state.startCoords);
		let newFilledCoords = this.state.filledInCoords.slice(0);
		//find all nodes within 50px of these two
		for(let i in newStartCoords){
			if(i !== "hex"){
				let tempCoords = i.split("-");
				if(this.withinRange({x:x*2, y:y*2, coordsX: parseInt(tempCoords[0]), coordsY: parseInt(tempCoords[1])})){
					newFilledCoords.push({coords: i});
					delete newStartCoords[i];
				} 
			}
		}
		//when 'hex' is the only remaining key => length = 1
		let playAnimation = false,
				animationCount = this.state.animationCount;
		if(Object.keys(newStartCoords).length === 1){
			playAnimation = true;
			animationCount += 1;
		}
		this.setState({	filledInCoords: newFilledCoords, 
										startCoords: newStartCoords, 
										playAnimation: playAnimation, 
										animationCount: animationCount});
	}
	
	withinRange(options){
		if(Math.abs(options.coordsX - options.x) < RADIUS_TO_FILL){
			if(Math.abs(options.coordsY - options.y) < RADIUS_TO_FILL){
				return true;
			}
		}
		return false
	}
	
	render(){
		let idx = 0;
		let coordsDisplay = [];
		let backgroundImageUrl = this.backgroundImageFromProps();
		
		for(let i in this.state.startCoords){
			if(i !== "hex"){
				let stringCoords = i;
				let sliceIdx = stringCoords.indexOf('-');
				
				coordsDisplay.push(this.dotDisplay({stringCoords: stringCoords, sliceIdx: sliceIdx, beenTouched: false, key: idx}));
				idx+=1;
			}
		}
		
		for(let i = 0; i < this.state.filledInCoords.length; i ++){
			let stringCoords = this.state.filledInCoords[i].coords;
			let sliceIdx = stringCoords.indexOf('-');
			coordsDisplay.push(this.dotDisplay({stringCoords: stringCoords, sliceIdx: sliceIdx, beenTouched: true, key: idx}));
			idx+=1;
		}
		
		let animation;
		if(this.state.playAnimation && this.state.animationCount === 1){
			animation = <img className="image-animation" src="https://image.ibb.co/efRS4Q/facebook_thumbs_up_animation_white_back.png" alt="Thumbs up"/>
		} else {
			animation = "";
		}
		
		let mouseMoveCallback = (this.state.playAnimation && this.state.animationCount > 0) ? function(){console.log("done tracing")} : this.handleMouseMove;
		
		return(
			<div style={{height: '314px', width: '600px', position: 'relative', backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: "cover"}} 
					 onMouseMove={mouseMoveCallback}>
				{coordsDisplay.map((coords) => {
					return coords
				})}
				{animation}
			</div>
		)
	}
}

NewsFeedAd.propTypes = {
	title: PropTypes.string.isRequired,
	coords: PropTypes.object.isRequired
}