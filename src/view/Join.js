import React, { Component } from 'react';
import '../styles/truckweb.css';
import $ from "jquery"

/**
 * 회원가입 컴포넌트
 */
class Join extends Component {
	constructor(props) {
		super(props);
		this.state = {isToggleOn: true};

		this.state.name = '';
		this.state.password = '';
		this.state.owner = '';
		this.state.contact = '';
		this.state.buz_number = '';
		
		// This binding is necessary to make `this` work in the callback
		this.cancelAction = this.cancelAction.bind(this);
		this.submitAction = this.submitAction.bind(this);		
	}

	//취소버튼 Action
	cancelAction(e){
		window.location.href='/';
	}
	
	//가입 Action
	submitAction(e){
		e.preventDefault();
		const object = {
			name: this.state.name,
			password: this.state.password,
			owner: this.state.owner,
			contact: this.state.contact,
			buz_number: this.state.buz_number
		}
				
		//console.log(this.fromData.get('name'));
		$.ajax({
			type: 'POST',
			url: 'http://52.79.177.67:5051/api/org_user/reg',
			data: object,
			headers: {'Access-Control-Allow-Origin': '*'},
                            
		}).done((res) => {
			if(res.data !== null && res.data !== undefined){
				alert('회원가입 되셨습니다.');
				window.location.href = '/login';
			}
			
		}).fail((res) => {
			console.log(res);
			console.log(res.responseJSON);
			if(res.responseJSON === null || res.responseJSON === undefined){
				alert('서버에러 관리자에게 문의해주세요');
			}
			else {
				alert(res.responseJSON.error);
			}
		});
		// fetch('http://52.79.1
		
	}

	//UI 입력 값으로 state 변경 
	handleChange = (e) => {
		console.log(e.target.id);
        this.setState({
            [e.target.id]: e.target.value
		})
		console.log(this.state);
	}
	
	//UI
	render () {
		return (
			<div className="page-container ">
				<form className="joinform-warpper" id="joinFrm" onSubmit={this.submitAction}>
					
					<div className="form-group">
						<label className="form-label" htmlFor="name">회사명</label>
						<input className="form-input" placeholder="회사명"  id="name" value={this.state.name} onChange={e => this.handleChange(e)}/>
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="password">비밀번호</label>
						<input className="form-input" type="password"  placeholder="비밀번호" id="password" value={this.state.password} onChange={e => this.handleChange(e)}/>
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="owner">대표자이름</label>
						<input className="form-input" placeholder="대표자이름"  id="owner" value={this.state.owner} onChange={e => this.handleChange(e)}/>
					</div>
					
					<div className="form-group">
						<label className="form-label" htmlFor="contact">연락처</label>
						<input className="form-input" placeholder="연락처"  id="contact" value={this.state.contact} onChange={e => this.handleChange(e)}/>
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="buz_number">사업자번호</label>
						<input className="form-input" placeholder="사업자번호"  id="buz_number" value={this.state.buz_number} onChange={e => this.handleChange(e)}/>
					</div>
					
					<div className="btn-area">
						<button className="btn" onClick={this.cancelAction}>취소</button>
						<input type="submit" className="btn btn-primary"  value="가입"/>
					</div>
				</form>
			</div>
		);
	}
}
export default Join;