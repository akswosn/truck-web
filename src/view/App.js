import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";



import Main from './Main';
import Control from './Control';
import Construct from './Construct';
import Push from './Push';
import Login from './Login';
import Join from './Join';
import Search from './Search';
import Detail from './Detail';

var divStyle = {
	float:'left',
	'fontSize': '18px',
	'paddingLeft':'10px',
	'fontWeight':'bold'
};

//SubNavTitle Component
class SubNav extends React.Component {
		//uri로 메뉴명 리턴
		getTitle(){
			var title = {
				'/join':'회원가입',
				'/login':'로그인',
				'/push':'푸쉬알림',
				'/construct':'현장등록',
				'/control':'관제시스템',
				
			};
			
			var url = window.location.href;
			var uri = url.substring(url.lastIndexOf('/'));
			if(uri.indexOf('search') > -1){
				return '현장정보 검색';
			}
			return title[uri];
		}
		//메뉴 노출 여부
		getdisPlay(){
			
			var url = window.location.href;
			var uri = url.substring(url.lastIndexOf('/'));
	
			var result = 'none';
			if('/' !== uri || uri.indexOf( '/detail' ) !== -1){
				result = 'block';
			}
			
	
			return {display:result};
		}
		//back action event => home
		gotoBack() {
			window.location.href='/';
		}
		render() {
			return (
				<div className="page-nav" style={this.getdisPlay()}>
					<span className="item-title">{this.getTitle()}</span>
					<span className="item-historybtn"><button className="btn btn-primary" onClick={this.gotoBack}>Prev</button></span>
				</div>
			);
		}
	 }

// Start React
class App extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			menuDisplay : {},
			logoutDisplay : {}
		}
		
		this.getMenuDisplay();
		this.logout = this.logout.bind(this);
	}
	//Logout 
	logout(){
		sessionStorage.clear();
		window.location.href = '/login';
		return;
	}
	/**
	 * login / logout Menu Display change
	 */
	getMenuDisplay(){
		
		var id = sessionStorage.getItem("id");
		var name = sessionStorage.getItem("name");
		
		if(id === null || name === null ){
			this.state.menuDisplay.display = 'inline-block';
			this.state.logoutDisplay.display = 'none';
			
		}
		else {
			
			this.state.menuDisplay.display = 'none';
			this.state.logoutDisplay.display ='inline-block';
		}
		// console.log('data', this.state.menuDisplay);
		return this.state.menuDisplay;
	}

	render() {
		return (
			<div>
				
				<Router>
					<div className="page-wrapper">
						<nav className="primary-nav">
							<Link to="/" className="logo" style={divStyle}>Truck Call</Link>
							<Link className="primary-nav__item" to="/control">관제시스템</Link>
							<Link className="primary-nav__item" to="/construct">현장정보입력</Link>
							{/*<Link className="primary-nav__item" to="push">푸쉬알림</Link>*/}
							
							<Link className="primary-nav__item" to="/login" style={this.state.menuDisplay}>로그인</Link>
							<Link className="primary-nav__item" to="/join" style={this.state.menuDisplay}>회원가입</Link>
							<a className="primary-nav__item" href="javascript:void(0); return;"  style={this.state.logoutDisplay} onClick={this.logout}>로그아웃</a>
							
						</nav>
						<SubNav/>
						<div className="page-body">
								<Route exact path="/" component={Main} />
								
								<Route path="/control" component={Control} />
								<Route path="/construct" component={Construct} />
								<Route path="/push" component={Push} />
								<Route path="/login" component={Login} />
								<Route path="/join" component={Join} />
								<Route path="/search/:lat/:lon" component={Search} />
								<Route path="/detail/:id" component={Detail} />
						</div>
					</div>
			</Router>
			</div>
		);
	}
 }


export default App;