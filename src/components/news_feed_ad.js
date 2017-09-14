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
			yOffset: null
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
		let x = e.pageX;
		//e.currentTarget.offsetTop is temp fix until news feed display is assembled
		let y = e.pageY - e.currentTarget.offsetTop;
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
		this.setState({filledInCoords: newFilledCoords, startCoords: newStartCoords});
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
		const {title, coords} = this.props;
		let idx = 0;
		let coordsDisplay = []
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
		
		return(
			<div style={{height: '314px', width: '600px', position: 'relative', backgroundImage: `url(${backgroundImageUrl})`, backgroundSize: "cover"}} 
					 onMouseMove={this.handleMouseMove}>
				{coordsDisplay.map((coords) => {
					return coords
				})}
			</div>
		)
	}
}

NewsFeedAd.propTypes = {
	title: PropTypes.string.isRequired,
	coords: PropTypes.object.isRequired
}