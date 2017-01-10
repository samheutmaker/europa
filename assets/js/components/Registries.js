/*
  @author Sam Heutmaker [samheutmaker@gmail.com]
*/

import React, {Component, PropTypes} from 'react'
import RegistryProviderIcons from './../util/RegistryProviderIcons'
import CenteredConfirm from './../components/CenteredConfirm'
import Msg from './../components/Msg'
import Loader from './../components/Loader'
import ControlRoom from './../components/ControlRoom'
import AddRegistry from './../components/AddRegistry'
import Btn from './../components/Btn'
import NPECheck from './../util/NPECheck'

export default class Registries extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}
	componentDidMount() {
		this.context.actions.listRegistries();
	}
	componentWillUnmount() {
		this.context.actions.resetRegistryState();	
	}
	setRegistryForEdit(reg){
		this.context.actions.setRegistryForEdit(reg)
	}
	renderLegend(){
		return (
			<div className="RegistryListLegend">
				<span>Provider</span>
				<span>Key Name</span>
				<span className="Flex2">Access Key</span>
				<span>Region</span>
				<span className="AddCred" 
					  onClick={ () => this.context.actions.toggleShowAddEditRegistryModal() }>
					  + Add Credential
				</span>
			</div>
		);
	}
	renderRegistryItem(reg, index){
		return (
			<div key={index}
				 className="Flex1 RegistryItem FlexColumn">
				<div className="Inside FlexRow">
					
					<span className="ListValue">
						<img className="ProviderIcon"src={RegistryProviderIcons(reg.provider)}/>
						{reg.provider}
					</span>
					<span className="ListValue">{reg.name}</span>
					<span className="ListValue Flex2">{reg.key}</span>
					<span className="ListValue">{reg.region}</span>
					<span className="Actions">
						<i className="icon icon-dis-settings" data-tip="Settings" data-for="ToolTipTop"
						   onClick={() => this.setRegistryForEdit(reg)}/>
						<i className="icon icon-dis-disconnect" data-tip="Disconnect" data-for="ToolTipTop" 
							onClick={() => this.context.actions.setRegistryForDelete(reg)}
						/>
					</span>
				</div>
				{this.renderConfirmDeleteRegistry(reg)}
			</div>
		);
	}
	renderNoRegistries(){
		return (
			<div className="NoContent">
				<h3>No Registries Credentials found.</h3>
				<Btn className="LargeBlueButton"
					 text="Add Credential"
					 onClick={() => this.context.actions.toggleShowAddEditRegistryModal()}/>
			</div>
		);
	}
	renderConfirmDeleteRegistry(reg){
		if(reg == this.context.state.registry.registrySelectedForDelete) {

			if(this.context.state.registry.deleteRegistryErrorMsg) {
				return (
					<div className="RowPadding">
						<Msg text={this.context.state.registry.deleteRegistryErrorMsg} 
								  close={() => this.context.actions.setRegistryForDelete()}/>
					</div>
				)
			}

			if(this.context.state.registry.deleteRegistryXHR) {
				return (
					<Loader />
				);
			}
			
			return (
				<CenteredConfirm message="Are you sure you want to disconnect this registry?"
							     confirmButtonText="Delete"
							     confirmButtonStyle={{}}
							     onConfirm={() => this.context.actions.deleteRegistry()}
							     onCancel={() => this.context.actions.setRegistryForDelete(null)}/>
			);	
		}
	}
	renderAddEditRegistryLegend(){
		let isEdit = this.context.state.addRegistry.isEdit;
		let provider = NPECheck(this.context.state, 'addRegistry/newRegistry/provider', '');

		switch(provider) {

			case 'GCR':
				return (
					<div className="AddEditRegistryLegend">
						<span style={{paddingLeft: '0'}}>Provider</span>
						<span>Key Name</span>
						<span style={{paddingRight: '5px'}}>Region</span>
						{this.renderAddEditRegistryLegendClose()}
					</div>
				);
			break;

			default:
				return (
					<div className="AddEditRegistryLegend">
						<span style={{paddingLeft: '0'}}>Provider</span>
						<span>Key Name</span>
						<span >Access Key</span>
						<span>Private Key</span>
						<span style={{paddingRight: '5px'}}>Region</span>
						{this.renderAddEditRegistryLegendClose()}
					</div>
				);
		}


	}
	renderAddEditRegistryLegendClose(){
		return (
			<span  className="Close"
				   onClick={ () => this.context.actions.toggleShowAddEditRegistryModal() }>
				<i className="icon icon-dis-close" />
			</span>
		);
	}
	renderAddEditRegistry(){
		let isEdit = this.context.state.addRegistry.isEdit;
		return (
			<ControlRoom renderHeaderContent={() => this.renderAddEditRegistryLegend()}
						 renderBodyContent={() => <AddRegistry standaloneMode={true} isEdit={isEdit} /> } />
			
		);
	}
	renderPageContent(){
		let registries = this.context.state.registries;

		if(this.context.state.addRegistry.showModal) {
			return this.renderAddEditRegistry();
		}

		if(!registries.length) {
			return this.renderNoRegistries();
		}

		if(this.context.state.registriesXHR) {
			return (
				<div className="PageLoader">
					<Loader />
				</div>	
			);
		}

		return (
			<ControlRoom renderHeaderContent={() => this.renderLegend()}
					     renderBodyContent={() => registries.map(this.renderRegistryItem.bind(this))}/>				
		);
	}
	render() {
		return (
			<div className="RegistryList FlexColumn">
				{this.renderPageContent()}
			</div>
		);
	}
}

Registries.childContextTypes = {
    actions: PropTypes.object,
    state: PropTypes.object,
    router: PropTypes.object
};

Registries.contextTypes = {
    actions: PropTypes.object,
    state: PropTypes.object,
    router: PropTypes.object
};

