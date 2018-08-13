import React from 'react'
import axios  from 'axios'

class UserController extends React.Component {

    constructor(props) {
		super(props);
		this.state = {isToggleOn: true};
	
		// This binding is necessary to make `this` work in the callback
		this.setCompany = this.setCompany.bind(this);
       // this.loginCheck = this.loginCheck.bind(this);
        //this.setLogin = this.setLogin.bind(this);
	  }
    //로그인 여부 확인
    loginCheck(){

    }
    //로그인 정보 저장(local Storage)
    setLogin(){

    }

    //회원가입
    setCompany(object){
        fetch('http://52.79.177.67:5051/api/org_user/reg', {
			method: 'post',
			body: JSON.stringify(object),
			mode: 'no-cors',
			headers:{
			'Access-Control-Allow-Origin':'*'
			},
        })
        .then(function(response) {
			console.log(response);
			
        })
        .then(function(data) {
			console.log('Created Gist:', data.html_url);
		});
    }


}

export default UserController;