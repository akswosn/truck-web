import React, { Component } from 'react';
import '../styles/app.css';
import '../styles/truckweb.css';
import $ from "jquery"


class Detail extends Component {
	constructor(props) {
		super(props);
		this.state = {isToggleOn: true, id:props.match.params.id};
        
        
		this.user = {};
		this.user.id = '';
		this.user.name = '';
		this.user.password = '';

        this.getLogin = this.getLogin.bind(this);
        this.getDetail = this.getDetail.bind(this);
        console.log(props.match.params);
        
        this.getLogin();
        this.getDetail();
		
	}
	getLogin(){
		console.log(sessionStorage)
		if(sessionStorage.length == 0 ){
			alert('로그인후 이용해주세요');
			window.location.href = '/login';
			return;
		}

		var id = sessionStorage.getItem("id");
		var name = sessionStorage.getItem("name");
		console.log(name);
		if(id == null || name == null ){
			alert('로그인후 이용해주세요');
			window.location.href = '/login';
			return;
		}
		this.user.id = id;
		this.user.name = name;
		this.user.password = sessionStorage.getItem("password");
    }
    getDetail(){
        console.log(this.state);
        var self = this;
		$.ajax({
			type: 'POST',
			url: 'http://localhost:5051/api/consite/detail',
			data: {id : this.state.id},
			headers: {
				'Access-Control-Allow-Origin': '*',
				user : JSON.stringify(this.user)
			},
			async : false                
		}).done((res) => {
            console.log(res);
            if(res.data != null && res.data.length !== 0){
               // self.setState(res.data[0]);
               for(var i in res.data[0]){
                   console.log(i);
                   //['this.state.'+i] = res.data[0].i;
                   this.state[i] = res.data[0][i];
               }
            }
            else {
                alert('데이터 조회 실패');
            }
            console.log(self.state);
		}).fail((res) => {
			console.log(res);
			console.log(res.responseJSON);
			alert(res.responseJSON.error);
		});
	}
	render () {
		
		return (

			<div className="page-container">
                <div className="page-detail">
				    <h3 className="title">{this.state.name}</h3>
                    <div className="info">
                        <h4 className="title">기본정보</h4>
                        <hr/>
                        <ul className="info-list">
                            <li><span>현장주소</span> : {this.state.addr}</li>
                            <li><span>목적지주소</span> : {this.state.to_addr}</li>
                            <li><span>연락처</span> : {this.state.contact}</li>
                            <li><span>토석수량</span> : {this.state.quantity}개</li>
                            <li><span>필요수량</span> : {this.state.need_quantity}개</li>
                            <li><span>운반료</span> :  {this.state.fee}원</li>
                        </ul>
                    </div>

                    <div className="info-sub">
                        <h4 className="title">배차신청현황</h4>
                        <hr/>
						<ul className="info-list">

						</ul>
                    </div>
                </div>
			</div>
		);
	}
}
export default Detail;