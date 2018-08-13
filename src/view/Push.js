import React, { Component } from 'react';
import '../styles/app.css';



class Push extends Component {
	constructor(props) {
		super(props);
		this.state = {isToggleOn: true};

		
		this.getLogint = this.getLogint.bind(this);
		this.getLogint();
	}
	getLogint(){
		if(sessionStorage.length == 0 ){
			alert('로그인후 이용해주세요');
			window.location.href = '/login';
		}

		var id = sessionStorage.getItem("id");
		var name = sessionStorage.getItem("name");

		if(id !== null || name !== null ){
			alert('로그인후 이용해주세요');
			window.location.href = '/login';
		}
	}
	render () {
		var self = this;
		
		this.list =  [
			{a:'18/06/06', b:'현대녹먼', c:'사토현장',d:'토사',e:'수량',f:'연락처'},
			{a:'18/06/06', b:'현대녹먼', c:'사토현장',d:'토사',e:'수량',f:'연락처'}
		];	
		 
		var rowData =  self.list.map(function(data, i) {
			return (
				<tr>
					<td>{data.a}</td>
					<td>{data.b}</td>
					<td>{data.c}</td>
					<td>{data.d}</td>
					<td>{data.e}</td>
					<td>{data.f}</td>
				</tr>
			);
			
		});
		
		return (

			<div className="page-container">
				<div className="push-warpper">
					<div className="top-area">
						
						<div className="item">
							

						</div>
						<div className="horizontal-form item">
							<div className="form-group">
								<label className="form-label" htmlFor="1">반경설정(km)</label>
								<input className="form-input" placeholder="0" id="1" />
							</div>	
						</div>
					</div>
				</div>
				<table className="w3-table-all w3-hoverable">
					
					<thead>
						<tr className="w3-light-grey">
							<th>날짜</th>
							<th>현장명</th>
							<th>현장종류</th>
							<th>토석종류</th>
							<th>수량</th>
							<th>연락처</th>
						</tr>
					</thead>
					<tbody>
						{rowData}
					</tbody>
				</table>
			</div>
		);
	}
}
export default Push;