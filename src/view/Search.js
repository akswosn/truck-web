import React, { Component } from 'react';
//import '../styles/app.css';
import '../styles/truckweb.css';
import $ from "jquery"
import Select from 'react-select';
import {
	
	loadNavermapsScript
  } from 'react-naver-maps'


 const CLIENT_ID = 'zgoUlbG7eyzVh2dgRvQO'

 /**
  * 검색 컴포넌트
  * (메인검색 결과)
  */
class Search extends Component {
	constructor(props) {
		super(props);
		this.state = {isToggleOn: true};

		this.user = {};
		this.user.id = '';
		this.user.name = '';
		this.user.password = '';
		this.state.map = false;
		this.state.zoom = 7;
		this.state.markers = [];
		this.state.circle = [];
		this.state.infoWindow = [];
		this.state.conssiteVal = 0;
		this.state.sitetype = [
			'',
			true,
			true,
			true,
			true,
		];
		
		this.state.options = [];
		this.state.conssite = [];
		this.state.form_markers = [];
		this.state.to_markers = [];

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
		this.handleInputChange = this.handleInputChange.bind(this);
		this.getLogin();
		this.initConssite();

	}


	mapCenterMove(lat, lon){
		this.state.map.setOptions({
			center : new this.navermaps.LatLng(lat, lon)
		});
	}
	mapZoomIn(){
		this.state.zoom ++;
		this.state.map.setOptions({
			zoom : this.state.zoom 
		});
	}
	mapRefresh(){
		this.state.zoom = 7;
		this.mapInit(this.state.lat, this.state.lon, this.state.zoom);
	}

	//맵 초기화
	mapInit(lat, lon, zoom){
		this.setState({loaded:true});
		
		this.state.map  = new this.navermaps.Map('map',{
			center : new this.navermaps.LatLng(lat, lon),
			zoom : zoom
		});
		
		this.setMarkers(0);
	}

	//현장 선택 이벤트
	handleChangeSelect = (e) => {
		
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

	//현장 마커 등록
	setMarkers(id){
		//clear
		for(var i in this.state.markers){
			this.state.markers[i].setMap(null);
		}
		this.state.markers = [];
		for(var i in this.state.circle){
			this.state.circle[i].setMap(null);
		}
		this.state.circle = [];

		
		this.state.infoWindow = [];
		//clear end
		var bgColorCir = ['','lightskyblue','lightgreen','lightcoral','darkkhaki'];
		console.log(this.state.sitetype);
		for(var i in this.state.form_markers){
			var stype =this.state.form_markers[i].site_type;
			
			if(this.state.sitetype[stype] === true){
				
				var marker = new this.navermaps.Marker({
					position:new this.navermaps.LatLng(this.state.form_markers[i].lat, this.state.form_markers[i].lon),
					map : this.state.map
				})
	
				var circle = new this.navermaps.Circle({
					map: this.state.map,
					center: new this.navermaps.LatLng(this.state.form_markers[i].lat, this.state.form_markers[i].lon),
					radius: 500,
					fillColor: bgColorCir[stype],
					strokeColor : bgColorCir[stype],
					fillOpacity: 0.5
				});
				//console.log(this.state.form_markers[i]);
				var infoWindow = new this.navermaps.InfoWindow({
					content: '<div style="width:400px;text-align:center;padding:10px;">'
						+ '<b>'+this.state.form_markers[i].name +'('+this.state.form_markers[i].display_type+')</b><hr/>'
						+ '주소 : '+ this.state.form_markers[i].addr
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
		this.navermaps.Event.addListener(this.state.map, 'click', this.allWindowClear());
	}

	allWindowClear (){
		/*
		for(var i in this.state.infoWindow){
			var	infoWindow = this.state.infoWindow[i];
			if (infoWindow.getMap()) {
				infoWindow.close();
			}
		}*/
	}

	//맵 클릭 이벤트(open infowindow)
	getClickHandler(seq) {
		var self = this;
		return function(e) {
			console.log(self.state.markers);
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

	//회사별 현장조회
	initConssite(){
		var object = {}
		$.ajax({
			type: 'GET',
			url: 'http://52.79.177.67:5051/api/consite/all',
			data: object,
			headers: {
				'Access-Control-Allow-Origin': '*',
				user : JSON.stringify(this.user)
			},
			async : false                 
		}).done((res) => {

			
			if(res.data !== null && res.data !== undefined){
				
				this.state.conssite = res.data;
				this.state.form_markers = res.data;
				this.state.to_markers = res.data;
				console.log(this.state.options);
			}
			
		}).fail((res) => {
			console.log(res);
			console.log(res.responseJSON);
			//alert(res.responseJSON.error);
		}); 
	}

	//입력값 변경 => state 값 바인딩
	handleInputChange(event){
		const target = event.target;
    	const value = $(target).is(':checked') === true ? true : true;
		const name = target.name;
		var obj = [];
		console.log($(target).is(':checked') );
		
		this.state.sitetype[name] = value;
		console.log(this.state.sitetype);
		this.setMarkers(0);
		return this.state.sitetype[name] ;
	}

	//로그인 정보 조회
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
				<div className="search-wrap">
					<div className="title">
						<h2>현장정보 검색</h2>
						<ul className="info-list">
							<li> 순성토 </li>
							<li> 사토</li>
							<li> 토취장</li>
							<li> 사토장</li>
							
						</ul>
					</div>
					<div style={{clear:'both'}}></div>
					<div className="search">
						
					</div>
					
					<div>
						<div id="map" style={{width:'100%',height:'500px'}}></div>
					</div>
				</div>
			</div>
		);
	}
}

export default Search;