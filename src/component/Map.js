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
    this.state={
      lat :  props.lat,
      lon : props.lon,
      markers : props.markers
    };
    this.state.map = false;
    console.log(props);

    this.mapZoomIn = this.mapZoomIn.bind(this);
  }

  mapZoomIn(){
    console.log(this.state.map);
  }
 
  componentWillMount(){
    var HOME_PATH = window.HOME_PATH || '.';
    
    var self = this;
    loadNavermapsScript({clientId:CLIENT_ID})
    .then((navermaps)=>{
        this.navermaps=navermaps;
        this.setState({loaded:true});
        
        self.state.map  = new navermaps.Map('map',{
            center : new navermaps.LatLng(self.state.lat, self.state.lon),
            zoom : 7
        });

        // var marker = new navermaps.Marker({
        //     position:new navermaps.LatLng(37.4544266, 127.1309902),
        //     map : map
        // })
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