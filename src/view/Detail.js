import React, { Component } from 'react';
//import '../styles/app.css';
import '../styles/truckweb.css';
import $ from "jquery"




class Detail extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isToggleOn: true,
			id:props.match.params.id,
			raceCalls : []
		};
        
        
		this.user = {};
		this.user.id = '';
		this.user.name = '';
		this.user.password = '';

        this.getLogin = this.getLogin.bind(this);
		this.getDetail = this.getDetail.bind(this);
		this.getRaceCalls = this.getRaceCalls.bind(this);
		//this.randerRaceCalls = this.randerRaceCalls.bind(this);
       // this.setRaceCallState = this.setRaceCallState.bind(this);
        
        this.getLogin();
        this.getDetail();
		this.getRaceCalls();
	}
	getLogin(){
		console.log(sessionStorage)
		if(sessionStorage.length === 0 ){
			alert('로그인후 이용해주세요');
			window.location.href = '/login';
			return;
		}

		var id = sessionStorage.getItem("id");
		var name = sessionStorage.getItem("name");
		console.log(name);
		if(id === null || name === null ){
			alert('로그인후 이용해주세요');
			window.location.href = '/login';
			return;
		}
		this.user.id = escape(id);
		this.user.name = escape(name);
		this.user.password = sessionStorage.getItem("password");
	}
	getRaceCalls(){
		console.log(this.state.id);
		var self = this;
		$.ajax({
			type: 'get',
			url: 'http://52.79.177.67:5051/api/race/site/'+this.state.id,
			
			headers: {
				'Access-Control-Allow-Origin': '*',
				user : JSON.stringify(this.user)
			},
			async : false                
		}).done((res) => {
			console.log(res);
			
			if(res.data !== null){
				self.state.raceCalls = res.data;
			}
            console.log(self.state.viewRaceCalls);
		}).fail((res) => {
			console.log(res);
			console.log(res.responseJSON);
			
		});
	}
    getDetail(){
       
        var self = this;
		$.ajax({
			type: 'POST',
			url: 'http://52.79.177.67:5051/api/consite/detail',
			data: {id : this.state.id},
			headers: {
				'Access-Control-Allow-Origin': '*',
				user : JSON.stringify(this.user)
			},
			async : false                
		}).done((res) => {
            console.log(res);
            if(res.data !== null && res.data.length !== 0){
			   self.setState(res.data[0]);
			   
               for(var i in res.data[0]){
                   //console.log(i);
                   //['this.state.'+i] = res.data[0].i;
                   this.state[i] = res.data[0][i];
               }
            }
            else {
				alert('데이터 조회 실패');
				window.close();	
            }
            console.log(self.state);
		}).fail((res) => {
			console.log(res);
			console.log(res.responseJSON);
			console.log(res.responseJSON);
			if(res.responseJSON === null || res.responseJSON === undefined){
				alert('서버에러 관리자에게 문의해주세요');
			}
			else {
				alert(res.responseJSON.error);
			}
		});
	}
	setRaceCallState(evt){
		var id = $(evt.target).attr('data-id');
		var state = $(evt.target).attr('data-state');
		var self = this;
		if(Number(state) === 1){//배차신청
			state =2;
		} else {//배차취소
			state =1;
		}
		
		$.ajax({
			type: 'POST',
			url: 'http://52.79.177.67:5051/api/race/update',
			data: {id : id, state: state},
			headers: {
				'Access-Control-Allow-Origin': '*',
				user : JSON.stringify(this.user)
			},
			async : false                
		}).done((res) => {
			
			console.log(res);
			if(res.status === 'success'){
				alert('변경되었습니다.');
				//self.getRaceCalls();
				//self.randerRaceCalls();
				window.location.reload();	
			}
            //this.getRaceCalls()
            
		}).fail((res) => {
			console.log(res);
			console.log(res.responseJSON);
			alert(res.responseJSON.error);
		});
		//alert('배차설정 Action')
	}

	randerRaceCalls(){
		var  result = [];

		for(var i = 0; i < this.state.raceCalls.length;i++){
			var obj = this.state.raceCalls[i];
			if(obj.state === 0){
				result.push(<li><span style={{backgroundColor:'block'}}>[대기]</span> {obj.name}( {obj.truck_number} ) 덤프 : {obj.truck_name} </li>);
			}
			else if(obj.state === 1){
				result.push(<li><span style={{backgroundColor:'#9aac03'}}>[덤프등록]</span> {obj.name}( {obj.truck_number} ) 덤프 : {obj.truck_name} 
					<button data-id={obj.id} data-state={obj.state}  onClick={(evt) => this.setRaceCallState(evt)} className="btn btn-default-success">배차등록</button></li>);
			}
			else if(obj.state === 2){
				result.push(<li><span style={{backgroundColor:'#0037ffbf'}}>[배차]</span> {obj.name}( {obj.truck_number} ) 덤프 : {obj.truck_name} 
					<button data-id={obj.id} data-state={obj.state} onClick={(evt) => this.setRaceCallState(evt)} className="btn btn-default-danger">배차취소</button></li>);
			}
			else if(obj.state == 3){
				result.push(<li><span style={{backgroundColor:'#04ff00bf'}}>[운행중]</span> {obj.name}( {obj.truck_number} ) 덤프 : {obj.truck_name} </li>);
			}
			else if(obj.state === 4){
				result.push(<li><span style={{backgroundColor:'#ff9900'}}>[운행종료]</span> {obj.name}( {obj.truck_number} ) 덤프 : {obj.truck_name} </li>);
			}
			
		}

		
		return result;
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
							{this.randerRaceCalls()}
						</ul>
                    </div>
                </div>
			</div>
		);
	}
}
export default Detail;