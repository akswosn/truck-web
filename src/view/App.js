import React from 'react';
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import '../styles/app.css';


import Main from './Main';
import Control from './Control';
import Construct from './Construct';
import Push from './Push';
import Login from './Login';
import Join from './Join';
import Search from './Search';

var divStyle = {
	float:'left',
	'fontSize': '18px',
	'paddingLeft':'10px',
	'fontWeight':'bold'
};
const PageNav = () => (
  <Router>
		<div className="page-wrapper">
			<nav className="primary-nav">
				<Link to="/" className="logo" style={divStyle}>Truck Call</Link>
				<Link className="primary-nav__item" to="control">관제시스템</Link>
				<Link className="primary-nav__item" to="construct">현장정보입력</Link>
				<Link className="primary-nav__item" to="push">푸쉬알림</Link>
				<Link className="primary-nav__item" to="login">로그인</Link>
				<Link className="primary-nav__item" to="join">회원가입</Link>
			</nav>
			<SubNav/>
			<div className="page-body">
					<Route exact path="/" component={Main} />
					<Route path="/control" component={Control} />
					<Route path="/construct" component={Construct} />
					<Route path="/push" component={Push} />
					<Route path="/login" component={Login} />
					<Route path="/join" component={Join} />
					<Route path="/search" component={Search} />
			</div>
		</div>
  </Router>

);

class SubNav extends React.Component {
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
			return title[uri];
		}
		getdisPlay(){
			
			var url = window.location.href;
			var uri = url.substring(url.lastIndexOf('/'));
	
			var result = 'none';
			if('/' != uri){
				result = 'block';
			}
			
	
			return {display:result};
		}
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

class App extends React.Component {
	render() {
		return (
			<div>
				
					<PageNav />
					
					{/*<SubNav/>*/}
					
					
				
			</div>
		);
	}
 }


export default App;