import React, { Component } from 'react';
import '../styles/app.css';
import Map from '../component/Map'

class Control extends Component {

	render () {
		// handle form input and validation
		// function getSelectOption(){
		// 	return [
		// 		{ label: 'Caramel',    value: 'caramel' },
		// 		{ label: 'Chocolate',  value: 'chocolate' },
		// 		{ label: 'Strawberry', value: 'strawberry' },
		// 		{ label: 'Vanilla',    value: 'vanilla' }
		// 	];
		// }
		return (
			<div className="page-container">
				
				<div className="control-wrap">
					<span>
						1.지도
					</span>
					<span>
				{/*<SelectInputGroup   label="현장"   value={this.state.inputSelect}   options={getSelectOption()}   />*/}
					</span>
					<span>
						<button className="btn btn-link">+</button>
					</span>
					<span>
						<button className="btn-xs btn-primary">새로고침</button>
					</span>
				</div>
				<div>
					<Map/>
				</div>
			
			</div>
		);
	}
}

export default Control;