import React, { Component } from 'react';
import '../styles/app.css';



class Login extends Component {
	constructor(props) {
		super(props);
		this.state = {isToggleOn: true};

		this.state.name = '';
		this.state.password = '';
		
		// This binding is necessary to make `this` work in the callback
		
		this.submitAction = this.submitAction.bind(this);
	  }
	  submitAction(e){
		e.preventDefault();
		const object = {
			name: this.state.name,
			password: this.state.password,
		}
		
		fetch('http://52.79.177.67:5051/api/org_user/login', {
			credentials: 'same-origin'  ,
			method: 'post',
			body: object,
			mode: 'no-cors',
			headers:{
				'Access-Control-Allow-Origin':'*'
			},
			
        })
        .then(function(response) {
			console.log(response);
			
        })
        .then(function(data) {
			console.log(data);
		});	
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