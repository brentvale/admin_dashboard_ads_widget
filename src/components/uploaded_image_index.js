import React, {Component} from 'react';
import {Button, Modal} from 'react-bootstrap';
import * as ReactKonva from 'react-konva';
import PropTypes from 'prop-types';

import HotelTonightAdSrc from '../images/hotel_tonight_ad_v2.png';
import StripeAdSrc from '../images/stripe_ad_v2.png';
import SlackAdSrc from '../images/slack_ad_one_color.png';

const FACEBOOK_AD_WIDTH = 600; //1200 x 628 dimensions
const FACEBOOK_AD_HEIGHT = 314; //1200 x 628 dimensions
const PIXEL_SHIFTS = [[0,10],[10,0],[0,-10],[-10,0]];

function rgbToHex(r, g, b) {
    if (r > 255 || g > 255 || b > 255)
        throw "Invalid color component";
    return ((r << 16) | (g << 8) | b).toString(16);
}

export default class UploadedImageIndex extends Component{
	constructor(){
		super();
		this.state = {
			showModal: false,
			currentAdTitle: "",
			adImage: null,
			coordsSet: null,
			hex: null
		};
		this.close = this.close.bind(this);
		this.createPixelSet = this.createPixelSet.bind(this);
		this.handleAreaSelected = this.handleAreaSelected.bind(this);
		this.handleSaveArea = this.handleSaveArea.bind(this);
		this.open = this.open.bind(this);
		this.roughSizeOfObject = this.roughSizeOfObject.bind(this);
	}
	
	close() {
		//if user closes modal, also reset coordsSet
    this.setState({ showModal: false, coordsSet: null, currentAdTitle: "" });
  }
	
	createPixelSet(startX, startY){
		let c = this.refs.adDisplay.getContext('2d');
		let p = c.getImageData(startX, startY, 1, 1).data; 
		let hex = rgbToHex(p[0], p[1], p[2]);
		let queue = [];
		let coordsSet = {};
		
		queue.push({x: startX, y: startY});
		coordsSet[`${startX}-${startY}`] = hex;
		//save reference to the color for passing info back in.
		coordsSet['hex'] = hex;
		
		while(queue.length){
			let node = queue.shift();
			
			for(let i = 0; i < PIXEL_SHIFTS.length; i ++){
				let newX = node.x + PIXEL_SHIFTS[i][0];
				let newY = node.y + PIXEL_SHIFTS[i][1];

				if(typeof coordsSet[`${newX}-${newY}`] === "undefined"){
					let newPoint = c.getImageData(newX, newY, 1, 1).data; 
					let newHex = rgbToHex(newPoint[0], newPoint[1], newPoint[2]);
					coordsSet[`${newX}-${newY}`] = newHex;
					
					if(newHex === hex){
						queue.push({x: newX, y: newY});
					}
				} 
			}
		}
		//for debugging and determining size of object ~
		// let size = this.roughSizeOfObject(coordsSet);
		return {coordsSet: coordsSet, hex: hex};
	}
	
	roughSizeOfObject( object ) {

	    var objectList = [];
	    var stack = [ object ];
	    var bytes = 0;

	    while ( stack.length ) {
	        var value = stack.pop();

	        if ( typeof value === 'boolean' ) {
	            bytes += 4;
	        }
	        else if ( typeof value === 'string' ) {
	            bytes += value.length * 2;
	        }
	        else if ( typeof value === 'number' ) {
	            bytes += 8;
	        }
	        else if
	        (
	            typeof value === 'object'
	            && objectList.indexOf( value ) === -1
	        )
	        {
	            objectList.push( value );

	            for( var i in value ) {
	                stack.push( value[ i ] );
	            }
	        }
	    }
	    return bytes;
	}
	
	handleAreaSelected(e){
		let x = e.evt.layerX*2;
		let y = e.evt.layerY*2;
		
		let obj = this.createPixelSet(x, y);
		this.setState({coordsSet: obj.coordsSet, hex: obj.hex});
	}
	
	handleSaveArea(){
		this.close();
		let newCoordSet = this.scrubCoordsSet();
		this.props.handleSaveArea({coordsSet: newCoordSet, currentAdTitle: this.state.currentAdTitle});
	}

  open(e) {
		const image = new window.Image();
		let title = "";
		switch(e.currentTarget.id){
		case "hotelTonight":
			image.src = HotelTonightAdSrc;
			title = "Hotel Tonight";
			break;
		case "stripe":
			image.src = StripeAdSrc;
			title = "Stripe";
			break;
		case "slack":
			image.src = SlackAdSrc;
			title = "Slack";
			break;
		default:
			image.src = "";
			title = "none";
		}
		let newSet = (typeof this.props.savedAds[title] !== "undefined") ? this.props.savedAds[title] : null;
		let hexColor = (newSet == null) ? null : this.props.savedAds[title]['hex'];
		
		this.setState({ showModal: true, currentAdTitle: title, adImage: image, coordsSet: newSet, hex: hexColor});
  }
	
	scrubCoordsSet(){
		let returnSet = Object.assign({}, this.state.coordsSet);
		for(let i in returnSet){
			if(returnSet[i] !== this.state.hex){
				delete returnSet[i];
			}
		}
		return returnSet;
	}
	
	render(){
		const {savedAds} = this.props;
		const imagePreview =	(this.state.adImage == null) ? "" :
													<ReactKonva.Stage height={FACEBOOK_AD_HEIGHT} width={FACEBOOK_AD_WIDTH} >
														<ReactKonva.Layer style={{textAlign:"center"}}>
															<ReactKonva.Image ref="adDisplay" image={this.state.adImage} 
																																height={FACEBOOK_AD_HEIGHT} 
																																width={FACEBOOK_AD_WIDTH} 
																																onMouseMove={this.handleMouseMove}
																																onClick={this.handleAreaSelected}/>
										        </ReactKonva.Layer>
													</ReactKonva.Stage>;
		let coordsDisplay = [];
		if(this.state.coordsSet == null){
			coordsDisplay.push(<div key={0} style={{display: "none"}}></div>);
		} else {
			let idx = 0;
			for(let i in this.state.coordsSet){
				if(this.state.hex === this.state.coordsSet[i] && i !== "hex"){
					let stringCoords = i;
					let sliceIdx = stringCoords.indexOf('-');
					coordsDisplay.push(<div key={idx}
																	style={{position: "absolute", 
																					left: `${parseInt(stringCoords.slice(0, sliceIdx))/2}px`, 
																					top: `${parseInt(stringCoords.slice(sliceIdx+1, stringCoords.length))/2}px`,
						 															height: "4px",
																					width: "4px",
																					borderRadius: "2px",
																					backgroundColor: "blue",
																					zIndex: "10"}}></div>)
						idx+=1;
				}
			}
		}
		return(
			<div id="imageIndexBackground">
				<div>
					<ul>
						<li id="hotelTonight" style={{backgroundImage: `url(${HotelTonightAdSrc})`}} onClick={this.open}></li>
						<li id="stripe" style={{backgroundImage: `url(${StripeAdSrc})`}} onClick={this.open}></li>
						<li id="slack" style={{backgroundImage: `url(${SlackAdSrc})`}} onClick={this.open}></li>
					</ul>
				</div>
			
				<Modal show={this.state.showModal} onHide={this.close} bsSize="large">
          <Modal.Header closeButton>
					<Modal.Title>{this.state.currentAdTitle} Ad</Modal.Title>
          </Modal.Header>
          <Modal.Body>
						<div style={{padding: "0px 20px 20px 0px", display: "inline-block", position: "relative"}}>
							{imagePreview}
							{coordsDisplay}
						</div>
						<div style={{width: "150px", display: "inline-block", verticalAlign: "top"}}>
								<ul className="steps">
									<li>1. Select interactive area.</li>
									<li>2. Save the interactive area configuration.</li>
								</ul>
							
						</div>
          </Modal.Body>
          <Modal.Footer>
            <Button onClick={this.handleSaveArea}>Save Area</Button>
          </Modal.Footer>
        </Modal>
			</div>
		)
	}
}

UploadedImageIndex.propTypes = {
	handleSaveArea: PropTypes.func.isRequired,
	savedAds: PropTypes.object.isRequired
}