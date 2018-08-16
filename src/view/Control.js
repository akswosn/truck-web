import React, { Component } from 'react';
import '../styles/app.css';
import Map from '../component/Map'

class Control extends Component {
	constructor(props) {
		super(props);
		this.state = {isToggleOn: true};

		this.user = {};
		this.user.id = '';
		this.user.name = '';
		this.user.password = '';


		this.getLogin = this.getLogin.bind(this);
		this.getLogin();
	}

	

	getLogin(){
		if(sessionStorage.length == 0 ){
			alert('로그인후 이용해주세요');
			window.location.href = '/login';
			return;
		}

		var id = sessionStorage.getItem("id");
		var name = sessionStorage.getItem("name");

		if(id == null || name == null ){
			alert('로그인후 이용해주세요');
			window.location.href = '/login';
			return;
		}
		this.user.id = id;
		this.user.name = name;
		this.user.password = sessionStorage.getItem("password");
	}
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