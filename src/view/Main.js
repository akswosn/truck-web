import React, { Component } from 'react';
import '../styles/app.css';

class Main extends Component {
  render() {
    return (
      <div className="page-container">
				<ul className="main-content-seach">
					<li className="item-1">"획기적인 덤프배차솔루션 'TRUCK CALL'입니다."</li>
					<li className="item-2">근처 현장정보 및 덤프를 찾아보세요</li>
					<li className="item-3">
						<div className="u-margin-bottom-lg">
							<div className="input-group">
							<label className="form-label" htmlFor="search"></label>
								<div className="input-group-control input-group-field">
									<input id="search" type="text" className="form-input" placeholder="경기도 안산시 선부동" />
								</div>
								<div className="input-group-control input-group-btn">
									<button className="btn btn-primary" type="button">검색</button>
								</div>
							</div>
						</div>
					</li>
				</ul>
				<div className="main-info">
                <img src="/images/main/main1.png"/>
				</div>
			</div>
    );
  }
}

export default Main;
