import React, { Component } from 'react';
import '../styles/app.css';

import $ from "jquery"
import Select from 'react-select';
import {
	Map as NaverMap,
	loadNavermapsScript,
  } from 'react-naver-maps'
 import Loadable from 'react-loadable'

 const CLIENT_ID = 'zgoUlbG7eyzVh2dgRvQO'

class Control extends Component {
	constructor(props) {
		super(props);
		this.state = {isToggleOn: true};

		this.user = {};
		this.user.id = '';
		this.user.name = '';
		this.user.password = '';
		this.state.map = false;
		this.state.zoom = 10;
		this.state.markers = [];
		this.state.circle = [];
		this.state.infoWindow = [];
		this.state.conssiteVal = 0;
		
		this.state.options = [];
		this.state.conssite = [];
		this.state.form_markers = [];
		this.state.to_markers = [];
		this.state.lat = '';
		this.state.lon = '';
			
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
	mapCenterMove(lat, lon){
		this.state.map.setOptions({
			center : new this.navermaps.LatLng(lat, lon)
		});
	}
	mapZoomIn(){
		this.state.zoom++;
		this.state.map.setOptions({
			zoom : this.state.zoom 
		});
	}
	mapRefresh(){
		this.state.zoom = 10
		this.mapInit(this.state.lat, this.state.lon, this.state.zoom);
	}
	mapInit(lat, lon, zoom){
		this.setState({loaded:true});
		console.log(lat);
		console.log(lon);
		console.log(zoom);
		this.state.map  = new this.navermaps.Map('map',{
			center : new this.navermaps.LatLng(lat, lon),
			zoom : zoom
		});
		
		this.setMarkers(0);
	}
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
		//clear end

		console.log('id', id);
		for(var i in this.state.form_markers){
			if(id === 0 || id === this.state.form_markers[i].id){

				var marker = new this.navermaps.Marker({
					position:new this.navermaps.LatLng(this.state.form_markers[i].lat, this.state.form_markers[i].lon),
					map : this.state.map
				})
	
				var circle = new this.navermaps.Circle({
					map: this.state.map,
					center: new this.navermaps.LatLng(this.state.form_markers[i].lat, this.state.form_markers[i].lon),
					radius: 500,
					fillColor: 'blue',
					fillOpacity: 0.3
				});
				var infoWindow = new this.navermaps.InfoWindow({
					content: '<div style="width:400px;text-align:center;padding:10px;">'
						+ '<b>'+this.state.form_markers[i].name +'(출발지)</b><hr/>'
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
					map : this.state.map
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
		console.log(this.state.markers);
		console.log(this.state.infoWindow);

		for (var i=0, ii= this.state.markers.length; i<ii; i++) {
			this.navermaps.Event.addListener(this.state.markers[i], 'click', this.getClickHandler(i));
		}
		
	}

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
	componentWillMount(){
		//var HOME_PATH = window.HOME_PATH || '.';
		var self = this;
		//현재 위치 후 맵 오픈
		navigator.geolocation.getCurrentPosition(function(pos){
			self.state.lat = pos.coords.latitude;
			self.state.lon = pos.coords.longitude;
			loadNavermapsScript({clientId:CLIENT_ID})
				.then((navermaps)=>{
					self.navermaps=navermaps;
					self.mapInit(self.state.lat, self.state.lon, self.state.zoom);
			
					// var marker = new navermaps.Marker({
					//     position:new navermaps.LatLng(37.4544266, 127.1309902),
					//     map : map
					// })
				})
		});
		
	}
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
			if(res.data != null && res.data != undefined){
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
				console.log(this.state.options);
			}
			
		}).fail((res) => {
			console.log(res);
			console.log(res.responseJSON);
			alert(res.responseJSON.error);
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
						
						
						<Select inputProps={{ id: 'conssite' }} onChange={(e)=>this.handleChangeSelect(e)} id="conssite" options={this.state.options} value={this.state.conssiteVal}>
							
						</Select>
					</span>
					<span>
						<button className="btn btn-link" onClick={()=>this.mapZoomIn()}>+</button>
					</span>
					<span>
						<button className="btn-xs btn-primary" onClick={()=>this.mapRefresh()}>새로고침</button>
					</span>
				</div>
				<div>
					<div id="map" style={{width:'100%',height:'500px'}}></div>
				</div>
			
			</div>
		);
	}
}

export default Control;