import React, {Component} from 'react';

export default class UploadedImageIndex extends Component{
	constructor(){
		super();
		this.state = {
			
		}
	}
	
	launchModal(){
		
	}
	
	render(){
		return(
			<div id="imageIndexBackground">
				<div>
					<ul>
						<li className="first" onClick={this.launchModal}></li>
						<li className="second" onClick={this.launchModal}></li>
						<li className="third" onClick={this.launchModal}></li>
					</ul>
				</div>
			</div>
		)
	}
}