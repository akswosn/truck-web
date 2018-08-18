import React, { Component } from 'react';
import '../styles/app.css';
import $ from "jquery"
import Select from 'react-select';
import Modal from 'react-modal';
import {
	
	loadNavermapsScript
} from 'react-naver-maps'
const CLIENT_ID = 'zgoUlbG7eyzVh2dgRvQO'
 

const customStyles = {
	content : {
	  top                   : '50%',
	  left                  : '50%',
	  right                 : 'auto',
	  bottom                : 'auto',
	  marginRight           : '-50%',
	  transform             : 'translate(-50%, -50%)'
	}
  };


class Construct extends Component {
	constructor(props) {
		super(props);

		
		this.state = {
			isToggleOn: true,
			addrModal: false,
			toAddrModal : false,
			maploaded : false,
			
			//searchModal2: false
		};

		

		this.state.name = '';
		this.state.addr = '검색';
		this.state.lat = '';
		this.state.lon = '';
		this.state.quantity = 0;
		this.state.fee = 0;
		this.state.to_addr = '검색';
		this.state.to_lat = '';
		this.state.to_lon = '';
		this.state.need_quantity = 0;
		this.state.truck_type = '';
		this.state.soil_type = '';
		this.state.site_type = '';

		this.user = {};
		this.user.id = '';
		this.user.name = '';
		this.user.password = '';
		
		this.getLogin = this.getLogin.bind(this);
		this.submitAction = this.submitAction.bind(this);
		this.getTruckType = this.getTruckType.bind(this);
		this.getSoilType = this.getSoilType.bind(this);
		this.getSiteType = this.getSiteType.bind(this);
		this.getLogin();

		this.truckTypeList = [];
		this.soilTypeList = [];
		this.siteTypeList = [];

		this.getTruckType();
		this.getSoilType();
		this.getSiteType();

		//modal
		
		this.openAddrModal = this.openAddrModal.bind(this);
		this.openAfterAddrModal = this.openAfterAddrModal.bind(this);
		this.closeAddrModal = this.closeAddrModal.bind(this);
		this.openToAddrModal = this.openToAddrModal.bind(this);
		this.openAfterToAddrModal = this.openAfterToAddrModal.bind(this);
		this.closeToAddrModal = this.closeToAddrModal.bind(this);
		//this.searchModal2 = this.searchModal2.bind(this);
		//this.afterSearchModal2 = this.afterSearchModal2.bind(this);
		//this.closeSearchModal2 = this.closeSearchModal2.bind(this);
	}
	openAddrModal(o){
		this.setState({addrModal: true, addr:''});
		
	}
	openAfterAddrModal() {
		// references are now sync'd and can be accessed.
		this.subtitle.style.color = '#f00';
	}
	
	closeAddrModal() {
		this.setState({addrModal: false});
	}
	openToAddrModal(o){
		this.setState({toAddrModal: true,to_addr:''});
		
	}
	openAfterToAddrModal() {
		// references are now sync'd and can be accessed.
		this.subtitle.style.color = '#f00';
	}
	
	closeToAddrModal() {
		this.setState({toAddrModal: false});
	}
	componentWillMount(){
		
		var map = null;
	
		loadNavermapsScript({clientId:CLIENT_ID,submodules: ['panorama', 'geocoder']})
		.then((navermaps)=>{
			this.navermaps=navermaps;
			
			this.setState({maploaded:true});

			map = new navermaps.Map('map',{
				center : new navermaps.LatLng(37.2918741, 128.2710296),
				zoom : 10
			});
			this.mapcontent = map;
		})
	  }
	searchAddrModal(self){
		console.log(self.navermaps);
		console.log(self.state);

		if(self.state.addr !== ''){
			self.navermaps.Service.geocode({ address: self.state.addr }, function(status, response) {
				if(status == 200){
					// 성공시의 response 처리
					var data = response.result.items;
					console.log(data);
					var html = [];
					for(var i in data){
						var obj = data[i];
						//html += '<a href="javascript:void(0);" onClick="setAddr(\''+data[i].address+'\', \''+data[i].point.x+'\', \''+data[i].point.y+'\')">'+data[i].address+'</a><br/>';
						html.push(<a onClick={self.setAddr.bind(self, obj)}>{obj.address}</a>);
						html.push(<br/>);
					}
					//self.setAddr = self.setAddr.bind(self);
					console.log(html);
					self.setState({
						addrItems : html
					});
					console.log(self.state);
				}
				else {
					alert('검색된 결과가 존재하지 않습니다.');
				}
				
			});
		}
	
		
	}
	searchToAddrModal(self){
		console.log(self.navermaps);
		console.log(self.state);

		if(self.state.addr !== ''){
			self.navermaps.Service.geocode({ address: self.state.to_addr }, function(status, response) {
				if(status == 200){
					// 성공시의 response 처리
					var data = response.result.items;
					console.log(data);
					var html = [];
					for(var i in data){
						var obj = data[i];
						//html += '<a href="javascript:void(0);" onClick="setAddr(\''+data[i].address+'\', \''+data[i].point.x+'\', \''+data[i].point.y+'\')">'+data[i].address+'</a><br/>';
						html.push(<a onClick={self.setToAddr.bind(self, obj)}>{obj.address}</a>);
						html.push(<br/>);
					}
					//self.setAddr = self.setAddr.bind(self);
					console.log(html);
					self.setState({
						toAddrItems : html
					});
					console.log(self.state);
				}
				else {
					alert('검색된 결과가 존재하지 않습니다.');
				}
				
			});
		}
		
	}
	setAddr( e, obj ){
		
		this.setState({
			addr  : e.address,
			lat  : e.point.y,
			lon  : e.point.x,
			addrModal: false
		})		
	}
	setToAddr( e, obj ){
		
		this.setState({
			to_addr  : e.address,
			to_lat  : e.point.y,
			to_lon  : e.point.x,
			toAddrModal: false
		})		
	}

	getTruckType(){
		$.ajax({
			type: 'POST',
			url: 'http://52.79.177.67:5051/api/consite/trucktype',
			data: {},
			headers: {
				'Access-Control-Allow-Origin': '*',
				user : JSON.stringify(this.user)
			},
            async : false              
		}).done((res) => {
			console.log(res);
			if(res.data !== null && res.data !== undefined){
				for(var i in res.data){
					var obj = {
						value : res.data[i].id,
						label : res.data[i].display_name
					}
					this.truckTypeList.push(obj);
				}
			}
			console.log(this.truckTypeList);
			return this.truckTypeList;
			
		}).fail((res) => {
			console.log(res);
			console.log(res.responseJSON);
			return[];
			//alert(res.responseJSON.error);
		});
	}
	getSoilType(){
		$.ajax({
			type: 'POST',
			url: 'http://52.79.177.67:5051/api/consite/soiltype',
			data: {},
			headers: {
				'Access-Control-Allow-Origin': '*',
				user :JSON.stringify(this.user)
			},
			async : false               
		}).done((res) => {
			console.log(res);
			if(res.data !== null && res.data !== undefined){
				for(var i in res.data){
					var obj = {
						value : res.data[i].id,
						label : res.data[i].display_name
					}
					this.soilTypeList.push(obj);
				}
			}
			console.log(this.soilTypeList);
			$('.soil_type').html()
			return this.soilTypeList;
		}).fail((res) => {
			console.log(res);
			console.log(res.responseJSON);
			//alert(res.responseJSON.error);
			return [];
		});
	}
	getSiteType(){
		$.ajax({
			type: 'POST',
			url: 'http://52.79.177.67:5051/api/consite/sitetype',
			data: {},
			headers: {
				'Access-Control-Allow-Origin': '*',
				user : JSON.stringify(this.user)
			},
			async : false                
		}).done((res) => {
			console.log(res);
			if(res.data !== null && res.data !== undefined){
				for(var i in res.data){
					var obj = {
						value : res.data[i].id,
						label : res.data[i].display_name
					}
					this.siteTypeList.push(obj);
				}
			}

			console.log(this.siteTypeList);
			return this.siteTypeList;
		}).fail((res) => {
			console.log(res);
			console.log(res.responseJSON);
			//alert(res.responseJSON.error);
			return [];
		});
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
	submitAction(e){
		e.preventDefault();
		console.log(this.state);
		const object = {
			name : this.state.name,
			addr : this.state.addr,
			lat : (this.state.lat),
			lon : (this.state.lon),
			to_addr : this.state.to_addr,
			to_lat : (this.state.to_lat),
			to_lon : (this.state.to_lon),
			soil_type : this.state.soil_type.value,
			quantity : this.state.quantity,
			site_type : this.state.site_type.value,
			fee : this.state.fee,
			need_quantity : this.state.need_quantity,
			truck_type : this.state.truck_type.value,
			contact : sessionStorage.getItem('contactgit push')
		}
		console.log(object);
		$.ajax({
			type: 'POST',
			url: 'http://52.79.177.67:5051/api/consite/reg',
			data: object,
			headers: {
				'Access-Control-Allow-Origin': '*',
				user : JSON.stringify(this.user)
			},
                            
		}).done((res) => {
			if(res.data !== null && res.data !== undefined){
				alert('등록되었습니다.');
				window.location.href='/';
			}
			
		}).fail((res) => {
			console.log(res);
			console.log(res.responseJSON);
			alert(res.responseJSON.error);
		}); 
		
	}
	handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
		})
	}
//handleChangeSoilType
	handleChangeSelect = (id, e) => {
		console.log(e);
		console.log(id);
		this.setState({
			[id]: e
		})
	}
	render () {
		
		return (
			<div className="page-container">
				
				<div className="horizontal-form constructWrap"  >
				<div className="form-group">
						<label className="form-label" htmlFor="name">현장명</label>
						<input className="form-input" placeholder="현장명" id="name" value={this.state.name} onChange={e => this.handleChange(e)}/>
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="addr" >공사소재지</label>
						<button className="btn" onClick={()=>this.openAddrModal(this.state)}>{this.state.addr}</button> 
						<input type="hidden" id="lat" value={this.state.lat}/>
						<input type="hidden" id="lon" value={this.state.lon}/>
						<div>
						<Modal
							isOpen={this.state.addrModal}
							style={customStyles}
							navermaps={this.navermaps}
							contentLabel="Example Modal">

							<input className="modal-inbut" placeholder="주소 검색" id="addr" value={this.state.addr} onChange={e => this.handleChange(e)}/>
							<button className="modal-btn btn btn-success" onClick={()=>this.searchAddrModal(this)}>검색</button> 
							<hr></hr>
							<div id="addr-result">
								{this.state.addrItems}
							</div>
						</Modal>
						</div>
					</div>
					<div className="form-group">
						<label className="form-input" className="form-label" htmlFor="soil_type">토석종류</label>
						<Select inputProps={{ id: 'soil_type' }} onChange={(e)=>this.handleChangeSelect('soil_type', e)} id="soil_type" options={this.soilTypeList} value={this.state.soil_type} >
							
						</Select>
						
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="quantity">토석수량</label>
						<input className="form-input" placeholder="0" id="quantity" value={this.state.quantity} onChange={e => this.handleChange(e)}/>
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="site_type">현장종류</label>
						
						<Select inputProps={{ id: 'site_type' }} onChange={(e)=>this.handleChangeSelect('site_type',e)} id="site_type" options={this.siteTypeList} value={this.state.site_type}>
							
						</Select>
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="fee">운반료</label>
						<input className="form-input" placeholder="0원" id="fee" value={this.state.fee} onChange={e => this.handleChange(e)}/>
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="addr" >운반장소</label>
						<button className="btn" onClick={()=>this.openToAddrModal(this.state)}>{this.state.to_addr}</button> 
						<input type="hidden" id="lat" value={this.state.to_lat}/>
						<input type="hidden" id="lon" value={this.state.to_lon}/>
						<div>
						<Modal
							isOpen={this.state.toAddrModal}
							style={customStyles}
							navermaps={this.navermaps}
							contentLabel="Example Modal">

							<input className="modal-inbut" placeholder="주소 검색" id="to_addr" value={this.state.to_addr} onChange={e => this.handleChange(e)}/>
							<button className="modal-btn btn btn-success" onClick={()=>this.searchToAddrModal(this)}>검색</button> 
							<hr></hr>
							<div id="addr-result">
								{this.state.toAddrItems}
							</div>
						</Modal>
						</div>
					</div>
					
					<div className="form-group">
						<label className="form-label" htmlFor="need_quantity">필요수량</label>
						<input className="form-input" placeholder="0" id="need_quantity" value={this.state.need_quantity} onChange={e => this.handleChange(e)}/>
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="truck_type">덤프종류</label>
						<Select inputProps={{ id: 'truck_type' }} onChange={(e)=>this.handleChangeSelect('truck_type', e)} id="truck_type" options={this.truckTypeList} value={this.state.truck_type}>
							
						</Select>
					</div>
					<div className="form-group">
						<button  className="btn btn-primary" onClick={this.submitAction}>등록</button>
					</div>
				</div>
				<div id="map" style={{display:'none'}}></div>
			</div>
		);
	}
}

export default Construct;