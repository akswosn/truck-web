import React, { Component } from 'react';
//import '../styles/app.css';
import '../styles/truckweb.css';
import {
	loadNavermapsScript
} from 'react-naver-maps'
const CLIENT_ID = 'zgoUlbG7eyzVh2dgRvQO'

class Main extends Component {
	constructor(props) {
		super(props);
		this.state = {isToggleOn: true,maploaded : false,};
		this.state.addrItems = [];
		this.user = {};
		this.user.id = '';
		this.user.name = '';
		this.user.password = '';
		this.state.addr = '';

		this.getLogin = this.getLogin.bind(this);
		this.getSearch = this.getSearch.bind(this);
		this.handleChange = this.handleChange.bind(this);
		this.getLogin();
	}
	handleChange = (e) => {
        this.setState({
            [e.target.id]: e.target.value
		})
	}

	getSearch(){
		var self = this;
		if(this.state.addr !== ''){
			this.navermaps.Service.geocode({ address: this.state.addr }, function(status, response) {
				if(status == 200){
					// 성공시의 response 처리
					var data = response.result.items;
					//console.log(data);					
					if(data.length == 1){
						var obj = data[0];
						console.log(obj);
						var url = "/search/"+obj.point.y+"/"+obj.point.x;
						window.location.href=encodeURI(url);
					}
					else {
						var htmls = [];
						for(var i =0; i < data.length;i++){
							var obj = data[i];
							var url = "/search/"+obj.point.y+"/"+obj.point.x;
							var html = <a href={url}> {obj.address} </a>;
							htmls.push(html);
							htmls.push(<hr/>);
						}
						self.setState({
							addrItems : htmls
						});
					}
				}
				else {
					alert('검색된 결과가 존재하지 않습니다.');
				}
				
			});
		}
		else {
			alert('검색어를 입력해주세요.');
		}
	}

	getLogin(){

		this.user.id = escape(sessionStorage.getItem("id"));
		this.user.name = escape(sessionStorage.getItem("name"));
		this.user.password = escape(sessionStorage.getItem("password"));
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

  render() {
    return (
      <div className="page-container">
				<ul className="main-content-seach">
					<li className="item-1">"획기적인 덤프배차솔루션 'TRUCK CALL'입니다."</li>
					<li className="item-2">근처 현장정보 및 덤프를 찾아보세요</li>
					<li className="item-3">
						<div className="u-margin-bottom-lg">
							<div className="input-group">
							<label className="form-label" htmlFor="addr"></label>
								<div className="input-group-control input-group-field">
									<input id="addr" type="text" className="form-input" placeholder="경기도 안산시 선부동" onChange={e => this.handleChange(e)} value={this.state.addr}/>
									<div className="viewSearch">
										{this.state.addrItems}
									</div>
								</div>
								<div className="input-group-control input-group-btn">
									<button className="btn btn-primary" type="button" onClick={this.getSearch}>검색</button>
								</div>
							</div>
						</div>
					</li>
				</ul>
				<div className="main-info">
                <img src="/images/main/main1.png"/>
				</div>
				<div id="map" style={{display:'none'}}></div>
			</div>
    );
  }
}

export default Main;
