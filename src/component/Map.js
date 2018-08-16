import React from 'react'

import {
  Map as NaverMap,
  loadNavermapsScript,
} from 'react-naver-maps'
import Loadable from 'react-loadable'
 
const CLIENT_ID = 'zgoUlbG7eyzVh2dgRvQO'
 
class Map extends React.Component {
  constructor (props) {
    super(props);
    this.state={};
  }
 
  componentWillMount(){
    var HOME_PATH = window.HOME_PATH || '.';
    var map = null;

    loadNavermapsScript({clientId:CLIENT_ID})
    .then((navermaps)=>{
        this.navermaps=navermaps;
        this.setState({loaded:true});
        map = new navermaps.Map('map',{
            center : new navermaps.LatLng(37.4544266, 127.1309902),
            zoom : 10
        });

        var marker = new navermaps.Marker({
            position:new navermaps.LatLng(37.4544266, 127.1309902),
            map : map
        })
    })
  }

  render () {
    return (
      <div>
        <div id="map" style={{width:'100%',height:'500px'}}></div>
      </div>
    )
  }
}
 

export default Map;