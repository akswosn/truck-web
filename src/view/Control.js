import React, { Component } from 'react';
import '../styles/truckweb.css';
import $ from "jquery"
import Select from 'react-select';
import {
	
	loadNavermapsScript
  } from 'react-naver-maps'
  import socketIOClient from 'socket.io-client'

 const CLIENT_ID = 'zgoUlbG7eyzVh2dgRvQO'

 /**
  * 관제시스템 컴포넌트
  */
class Control extends Component {
	constructor(props) {


		super(props);
		this.state = {
			isToggleOn: true,
			
		};

		this.user = {};
		this.user.id = '';
		this.user.name = '';
		this.user.password = '';
		this.state.map = false;
		this.state.zoom = 7;
		// 현장 Marker, circle, window
		this.state.markers = [];
		this.state.circle = [];
		this.state.infoWindow = [];
		this.state.conssiteVal = 0;
		
		this.state.options = [];
		this.state.conssite = [];
		this.state.form_markers = [];
		this.state.to_markers = [];
		this.state.current_truck = [];
		this.state.current_truck_markers = [];
		this.state.current_truck_circle = [];
		this.state.isChangeSelect = false;
		var args = props.match.params;
		
		this.state.lat = args.lat ;
		this.state.lon = args.lon ;
		if(this.state.lat === undefined){
			this.state.lat  = '';
		}
		if(this.state.lon === undefined){
			this.state.lon  = '';
		}
		
			
		this.getLogin = this.getLogin.bind(this);
		this.initConssite = this.initConssite.bind(this);
		this.mapZoomIn = this.mapZoomIn.bind(this);
		this.setMarkers = this.setMarkers.bind(this);
		this.mapRefresh = this.mapRefresh.bind(this);
		this.mapCenterMove = this.mapCenterMove.bind(this);
		this.handleChangeSelect = this.handleChangeSelect.bind(this);
		this.getLogin();
		this.initConssite();
		
	}

	//Map 중앙이동 
	//1. mapInit=> (맵생성후 주어진 좌표로 이동)
	mapCenterMove(lat, lon){
		this.state.map.setOptions({
			center : new this.navermaps.LatLng(lat, lon)
		});
	}
	//Map 줌 변경(현재 미사용)
	mapZoomIn(){
		this.state.zoom ++;
		this.state.map.setOptions({
			zoom : this.state.zoom 
		});
	}
	//Map 새로고침(현재 미사용)
	mapRefresh(){
		this.state.zoom = 7;
		this.mapInit(this.state.lat, this.state.lon, this.state.zoom);
	}

	//Map 초기화
	//1. componentWillMount => 최초 맵 구성시 호출
	mapInit(lat, lon, zoom){
		this.setState({loaded:true});
		
		this.state.map  = new this.navermaps.Map('map',{
			center : new this.navermaps.LatLng(lat, lon),
			zoom : zoom
		});
		
		this.setMarkers(0);
	}

	//현장선택 event(selectBox)
	handleChangeSelect = (e) => {
		// console.log('isChange',this.state.isChangeSelect);
		if(this.state.isChangeSelect === false){
			return;
		}
		this.setState({
			e
		});
		this.state.conssiteVal = e.id;
		for(var i in this.state.form_markers){
			if(e.value === this.state.form_markers[i].id){
				this.mapCenterMove(this.state.form_markers[i].lat,this.state.form_markers[i].lon);
			}
		}
		this.setMarkers(e.value);
		
	}

	//현장 Marker 등록
	//1.mapInit => 맵최초 호출시 현장 마커 등록
	//2.handleChangeSelect => 현장 변경시 현장 마커 재등록(초기화후 등록))
	setMarkers(id){
		//this.state.markers = [];

		//clear
		for(var i in this.state.markers){
			this.state.markers[i].setMap(null);
		}
		this.state.markers = [];
		for(var i in this.state.circle){
			this.state.circle[i].setMap(null);
		}
		this.state.circle = [];

		this.state.current_truck = [];
		this.state.infoWindow = [];

		for(var i in this.state.current_truck_markers){
			this.state.current_truck_markers[i].setMap(null);
		}
		for(var i in this.state.current_truck_circle){
			this.state.current_truck_circle[i].setMap(null);
		}
		this.state.current_truck_markers = [];
		this.state.current_truck_circle = [];
		//clear end

		
		for(var i in this.state.form_markers){
			if(id === 0 || id === this.state.form_markers[i].id){

				var marker = new this.navermaps.Marker({
					position:new this.navermaps.LatLng(this.state.form_markers[i].lat, this.state.form_markers[i].lon),
					map : this.state.map,
					
					
				})
				//console.log('id',id);
				//console.log(this.state.form_markers[i]);
				if(this.state.form_markers[i].race_state === 3 && id > 0){
					//console.log('truck push', this.state.form_markers[i]);
					this.state.current_truck.push( this.state.form_markers[i]);
				}
	
				var circle = new this.navermaps.Circle({
					map: this.state.map,
					center: new this.navermaps.LatLng(this.state.form_markers[i].lat, this.state.form_markers[i].lon),
					radius: 500,
					fillColor: 'blue',
					fillOpacity: 0.3
				});
				//console.log(this.state.form_markers[i]);
				var infoWindow = new this.navermaps.InfoWindow({
					content: '<div style="width:400px;text-align:center;padding:10px;">'
						+ '<b><a target="_blank" href="/detail/'+this.state.to_markers[i].id+'">'+this.state.form_markers[i].name +'(출발지)</a></b><hr/>'
						+ '주소 : '+ this.state.form_markers[i].addr
						+ '</div>'
				});
			
				this.state.markers.push(marker);
				this.state.circle.push(circle);
				this.state.infoWindow.push(infoWindow);
			}
		}
		for(var i in this.state.to_markers){
			if(id === 0 || id === this.state.to_markers[i].id){
				var marker = new this.navermaps.Marker({
					position:new this.navermaps.LatLng(this.state.form_markers[i].to_lat, this.state.form_markers[i].to_lon),
					map : this.state.map,						
				});
				var circle = new this.navermaps.Circle({
					map: this.state.map,
					center: new this.navermaps.LatLng(this.state.form_markers[i].to_lat, this.state.form_markers[i].to_lon),
					radius: 500,
					fillColor: 'red',
					fillOpacity: 0.3
				});

				var infoWindow = new this.navermaps.InfoWindow({
					content: '<div style="width:400px;text-align:center;padding:10px;">'
						+ '<b><a target="_blank" href="/detail/'+this.state.to_markers[i].id+'">'+this.state.to_markers[i].name +'(목적지)</a></b><hr/>'
						+ '주소 : '+ this.state.to_markers[i].to_addr
						+ '</div>'
				});

				this.state.markers.push(marker);
				this.state.circle.push(circle);
				this.state.infoWindow.push(infoWindow);
			}
		}

		for (var i=0, ii= this.state.markers.length; i<ii; i++) {
			this.navermaps.Event.addListener(this.state.markers[i], 'click', this.getClickHandler(i));
		}
		//add truck marker
		//console.log(this.state.current_truck);
		if(this.state.current_truck.length > 0){
			this.truckGPS();
		}

		this.state.isChangeSelect = true;
	}

//트럭 위치정보 조회
//setMarkers 에서 호출 (아래의 조건 모두 만족)
//1. 조건 id > 0 : selectbox 현장 선택상태
//2. 조건 state = 3 : 운행상태 일경우
	truckGPS(){
		var self = this;
		
		if(this.state.current_truck.length ===0){
			return;
		}
		
		var url = 'http://52.79.177.67:5051/';
		// var url = 'http://52.79.177.67:5051/';
		
		//console.log(truck);
		var socket = socketIOClient(url);
		//const socket = socketIOClient(url+truck.race_id);
		//console.log(socket);
		socket.on('connection', (socket) => {
			//console.log(socket.id);
			
		});
		
		socket.on('send:gps', (res) => {
			//console.log('send:gps',res);
			self.randerTruckGPS(res);
		});

		for(var i in this.state.current_truck){
			var id = this.state.current_truck[i].race_id;

			socket.emit('connect:gps', {race_call:id}) ;
	
			//socket.emit('send:gps', {race_call:id, driver_idx: 5, lat: 37.4319703, lon: 127.1316331  }) ;		
		}
		
	}

	//GPS truck marker 등록
	// call by truckGPS
	randerTruckGPS(data){
		//console.log(this.state.current_truck_circle[data.driver_idx] !== undefined);
		if(this.state.current_truck_markers[data.driver_idx] !== undefined
			|| this.state.current_truck_circle[data.driver_idx] !== undefined){
			this.state.current_truck_markers[data.driver_idx].setMap(null);
			this.state.current_truck_circle[data.driver_idx].setMap(null);
		}
		

		var marker = new this.navermaps.Marker({
			position:new this.navermaps.LatLng(data.lat, data.lon),
			map : this.state.map,
			icon:{
				url : '/images/main/truck.png',
				
				size: new this.navermaps.Size(48, 48),
				scaledSize: new this.navermaps.Size(48, 48),
				origin: new this.navermaps.Point(0, 0),
				anchor: new this.navermaps.Point(12, 34)
			}
		});
		var circle = new this.navermaps.Circle({
			map: this.state.map,
			center: new this.navermaps.LatLng(data.lat, data.lon),
			radius: 100,
			fillColor: 'lightGray',
			fillOpacity: 0.3
		});

		this.state.current_truck_markers[data.driver_idx] = marker;
		this.state.current_truck_circle[data.driver_idx] = circle;
	}
	//infowindow 초기화
	allWindowClear (){
		//console.log('allWindowClear');
		for(var i in this.state.infoWindow){
			var	infoWindow = this.state.infoWindow[i];
			if (infoWindow.getMap()) {
				infoWindow.close();
			}
		}
	}
	//info window open event
	getClickHandler(seq) {
		var self = this;
		return function(e) {
			// console.log(self.state.markers);
			var marker = self.state.markers[seq];
			var	infoWindow = self.state.infoWindow[seq];
	
			if (infoWindow.getMap()) {
				infoWindow.close();
			} else {
				infoWindow.open(self.state.map, marker);
			}
		}
	}

	//Rander 호출후 다음 실행되는 lifecicle event function
	//Map 초기화 하기위해 사용
	componentWillMount(){
		//var HOME_PATH = window.HOME_PATH || '.';
		var self = this;
		//현재 위치 후 맵 오픈
		console.log(self.state.lat);
		if(self.state.lat === '' || self.state.lon ===''){

			navigator.geolocation.getCurrentPosition(function(pos){
				self.state.lat = pos.coords.latitude;
				self.state.lon = pos.coords.longitude;
				loadNavermapsScript({clientId:CLIENT_ID})
					.then((navermaps)=>{
						self.navermaps=navermaps;
						self.mapInit(self.state.lat, self.state.lon, self.state.zoom);
				
					})
			});

			setTimeout(function(){
				if(self.state.lat === '' || self.state.lon ===''){//현재 자표 못구할시 서울시청으로
					self.state.lat = 37.566535;
					self.state.lon = 126.97796919999996;
					loadNavermapsScript({clientId:CLIENT_ID})
					.then((navermaps)=>{
						self.navermaps=navermaps;
						self.mapInit(self.state.lat, self.state.lon, self.state.zoom);
				
					})
				}
			}, 2000)
		}
		else {
			loadNavermapsScript({clientId:CLIENT_ID})
					.then((navermaps)=>{
						self.navermaps=navermaps;
						self.mapInit(self.state.lat, self.state.lon, self.state.zoom);
					})
		}
		
	}

	//현장 리스트 검색(회사)
	initConssite(){
		var object = {}
		$.ajax({
			type: 'POST',
			url: 'http://52.79.177.67:5051/api/consite/find',
			data: object,
			headers: {
				'Access-Control-Allow-Origin': '*',
				user : JSON.stringify(this.user)
			},
			async : false                 
		}).done((res) => {

			console.log(res);
			// this.state.options.push({
			// 	value : 0,
			// 	label : '전체'
			// });
			if(res.data !== null && res.data !== undefined){
				var options = [];
				for(var i in res.data){
					var obj = {
						value : res.data[i].id,
						label : res.data[i].name
					}
					this.state.options.push(obj);
					
				}
				//현재 위치
				
				//this.state.lat = res.data[0].lat;
				//this.state.lon = res.data[0].lon;
				
				this.state.conssite = res.data;
				this.state.form_markers = res.data;
				this.state.to_markers = res.data;
				//console.log(this.state.options);
			}
			
		}).fail((res) => {
			console.log(res);
			console.log(res.responseJSON);
			//alert(res.responseJSON.error);
		}); 
	}

	//로그인 체크
	getLogin(){
		if(sessionStorage.length === 0 ){
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
		this.user.id = escape(id);
		this.user.name = escape(name);
		this.user.password = sessionStorage.getItem("password");
	}
	//UI
	render () {

		return (
			<div className="page-container">
				
				<div className="control-wrap">
					<span>
						1.지도
					</span>
					<span id="selectView">
						
						
						<Select inputProps={{ id: 'conssite' }} onChange={(e)=>this.handleChangeSelect(e)} id="conssite" options={this.state.options} value={this.state.conssiteVal}>
							
						</Select>
					</span>
					{/*
					<span>
						<button className="btn btn-link" onClick={()=>this.mapZoomIn()}>+</button>
					</span>
					<span>
						<button className="btn-xs btn-primary" onClick={()=>this.mapRefresh()}>새로고침</button>
					</span>*/}
				</div>
				<div>
					<div id="map" style={{width:'100%',height:'500px'}}></div>
				</div>
			
			</div>
		);
	}
}

export default Control;