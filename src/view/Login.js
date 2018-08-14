import React, { Component } from 'react';
import '../styles/app.css';
import $ from "jquery"


class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {isToggleOn: true};

		this.state.name = '';
		this.state.password = '';
		
		// This binding is necessary to make `this` work in the callback
		
		this.submitAction = this.submitAction.bind(this);
		this.setLogint = this.setLogint.bind(this);
	  }
	  setLogint(data){
		if(sessionStorage.length){
			sessionStorage.clear();
		}
		for(var i in data){
			sessionStorage.setItem(i, data[i]);
		}
	  }
	  submitAction(e){
		e.preventDefault();
		const object = {
			name: this.state.name,
			password: this.state.password,
		}
		

		$.ajax({
			type: 'POST',
			url: 'http://localhost:5051/api/org_user/login',
			data: object,
			headers: {'Access-Control-Allow-Origin': '*'},
                            
		}).done((data) => {
			console.log(data);
		}).fail((res) => {
			console.log(res);
		});
		
		// fetch('http://localhost:5051/api/org_user/login', {
		// 	credentials: 'same-origin'  ,
		// 	method: 'post',
		// 	body: JSON.stringify(object),
		// 	mode: 'no-cors',
		// 	headers:{
		// 		'Accept': 'application/json',
      	// 		'Content-Type': 'application/json',
		// 		'Access-Control-Allow-Origin':'*'
		// 	},
			
		// }).then((data) => console.log(data))
		
		// .done((data) => {
		// 	console.log(data);
		// }).fail((jqXhr) => {
		// 	console.log(jqXhr.responseJSON.message);
		// });
       
        // .then(function(data) {
		// 	//
		// 	console.log('data', data);
		// 	console.log(sessionStorage);
		// 	if(data != null && data != undefined){
				
		// 		this.setLogint(data);
		// 		window.location.href = '/';
		// 	}
		// });	
	}

	handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
		})
	}
	render () {
		return (
			<div className="page-container">
				
				<div className="login-container">
					
					<div className="horizontal-form ">
						<div className="form-group">
							<label className="form-label" htmlFor="name">이름</label>
							<input className="form-input" placeholder="이름" id="name" value={this.state.name} onChange={e => this.handleChange(e)}/>
						</div>
						<div className="form-group">
							<label className="form-label" htmlFor="password">비밀번호</label>
							<input type="password" className="form-input" placeholder="비밀번호" id="password" value={this.state.password} onChange={e => this.handleChange(e)}/>
						</div>
						<div className="form-group">
							
							<button className="btn btn-primary" onClick={this.submitAction}>로그인</button>
						</div>
					</div>
				</div>
			</div>
		);
	}
}
export default Login;