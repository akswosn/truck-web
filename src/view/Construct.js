import React, { Component } from 'react';
import '../styles/app.css';


class Construct extends Component {

	render () {

	

		return (
			<div className="page-container">
				
				<div className="horizontal-form constructWrap">
					<div className="form-group">
						<label className="form-label" htmlFor="1">공사소재지</label>
						<input className="form-input" placeholder="search" id="1" />
					</div>
					<div className="form-group">
						{/*<SelectInputGroup   label="토석종류"   value={this.state.inputSelect}   options={getSelectOption()}   />*/}
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="2">토석수량</label>
						<input className="form-input" placeholder="0" id="2" />
					</div>
					<div className="form-group">
						{/*<SelectInputGroup   label="현장종류"   value={this.state.inputSelect}   options={getSelectOption()}   /> */}
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="3">운반료</label>
						<input className="form-input" placeholder="0원" id="3" />
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="4">운반장소</label>
						<input className="form-input" placeholder="search" id="4" />
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="5">필요수량</label>
						<input className="form-input" placeholder="0" id="5" />
					</div>
					<div className="form-group">
						<label className="form-label" htmlFor="6">덤프종류</label>
						<input className="form-input" placeholder="" id="6" />
					</div>
					<div className="form-group">
						
					<button className="btn btn-primary" >등록</button>
					</div>
				</div>
			</div>
		);
	}
}

export default Construct;