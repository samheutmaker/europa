/*
  @author Sam Heutmaker [samheutmaker@gmail.com]
*/

import React, { Component, PropTypes } from 'react'
import NPECheck from './../util/NPECheck'
import CopyToClipboard from './../util/CopyToClipboard'

export default class DockerPullCommands extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		document.body.addEventListener('click', this.clickListener.bind(this));
	}
	clickListener(e){
		let ignoreClassNames = ['PullCommandsDropDown', 'LargePullCommand', 'TagPullCommand', 'icon icon-dis-repo', 'NoClick'];
		let className = e.target.className;

		if(ignoreClassNames.includes(className)){
			 return;
		}

		if(NPECheck(this.props, 'repoDetails/showPullCommands', false)) {
			this.context.actions.toggleShowPullCommands();
		}
	}
	renderMore(selectedManifests){
		if(selectedManifests && selectedManifests.length) {
			return (
				<div className="More" onClick={() => this.context.actions.toggleShowPullCommands()}>more..</div>
			);
		}
	}
	renderPullCommands(selectedManifests, activeRepo){
		if(NPECheck(this.props, 'repoDetails/showPullCommands', false)) {
			let pullCommand = activeRepo.pullCommand;

			return (
				<div className="PullCommandsDropDown">
					<div className="Arrow"></div>
					<div className="FlexColumn">
						{selectedManifests.map((manifest, index) => {
							console.log(manifest);
							return (
								<div className="FlexColumn" key={index}>
									<div className="LargePullCommand">
										<div className="NoClick" id={manifest.manifestId}>{`${pullCommand}@${manifest.manifestId}`}</div>
										<i className="icon icon-dis-repo" 
										    data-tip="Copy Pull Command" 
										    data-for="ToolTipTop"
										    onClick={() => CopyToClipboard(document.getElementById(manifest.manifestId))}/>
									</div>
								</div>				
							);
						})}
					</div>
				</div>
			);
		}
	}
	render(){
		let activeRepo = NPECheck(this.props, 'repoDetails/activeRepo', {});
		let selectedManifests = NPECheck(this.props, 'repoDetails/selectedManifests', []);

		return (
			<div className="DockerPullCommands">
				<div className="FlexRow Flex1">
					<i className="icon icon-dis-tag"/>
					<div className="Commands">{activeRepo.pullCommand}</div>
				</div>
				<div className="FlexRow Flex1">
					<i className="icon icon-dis-blank"/>
					{this.renderMore(selectedManifests)}
					{this.renderPullCommands(selectedManifests, activeRepo)}
				</div>
			</div>
		);
	}		
}

DockerPullCommands.contextTypes = {
	actions: PropTypes.object
};