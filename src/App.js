import React, { Component } from 'react';
import './App.css';
import Container from 'react-bootstrap/lib/Container';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { LineChart,Line,XAxis,CartesianGrid,Tooltip,Legend,YAxis} from 'recharts';
import $ from 'jquery';


$.ajaxSetup({
  async: false,

});


class CustomDot extends Component{
  render(){
      return(
          <div>
          </div>

        );
  }
}

class AlertAudio extends Component{

    constructor(props) {
        super(props);
        this.requestMonitorAlert()
    }

    componentDidMount() {

      this.timerID = setInterval(
        () => this.tick(),
        5000
      );
    }

    componentWillUnmount() {
      clearInterval(this.timerID);
    }

    tick(){
      this.requestMonitorAlert()
    }


    requestMonitorAlert(){
        var response = $.post("indicatorCal/monitor/alert")


        var responseText = response.responseText
        var jsonObject = $.parseJSON(responseText)
         
        var flag = jsonObject["monitor"]



        var player = document.getElementById('player');
        console.log(flag)
        if(player && flag){
          player.play()  
        }
    }

    render(){
        return(
          <audio  id = "player" src="static/money.mp3" >
          </audio>
        );
    }
}

class  IndicatorPanel extends Component{
    constructor(props) {
        super(props);
        this.state = {response:this.requestIndicatorData()}
    }

    componentDidMount() {

      this.timerID = setInterval(
        () => this.tick(),
        5000
      );
    }

    componentWillUnmount() {
      clearInterval(this.timerID);
    }

    tick(){
      this.setState({
        response: this.requestIndicatorData()
      });
    
    }


    requestIndicatorData(){
        var startTime = new Date("2018-09-19 09:00:00").getTime()
        var endTime = new Date("2018-09-19 23:10:00").getTime()
        var param = {}
        param["start"] = startTime
        param["end"] = endTime
        
     
       // var response = 
       var response = $.post("/restapi/tsdb/query",JSON.stringify(param))


       var responseText = response.responseText
       var jsonArray = $.parseJSON(responseText)
       var length = jsonArray.length


      if(length === 0 ){
          var mockObj = {}
          mockObj["name"] = 'Nan'
          mockObj["joinQuant.futures.price"] = 0
          jsonArray.push(mockObj)
          return jsonArray
      }
       for(var i=0;i<length;i++){
          var timestamp = jsonArray[i]["name"]
          var date = new Date(timestamp)
          var hour = date.getHours()
          var minute = date.getMinutes()
          if(hour<10){
            hour = '0' + hour
          }
          if(minute < 10){
            minute = '0' + minute
          }
          jsonArray[i]["name"] = hour+":"+minute
       }

       return jsonArray

    } 

  
    render(){
        return(
           <LineChart width={900} height={500} data={this.state.response} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis domain ={['dataMin - 3', 'dataMax + 3']}/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Line type="monotone" dataKey="joinQuant.futures.price" stroke="black" activeDot={{r: 8}} dot = {<CustomDot/>}/>
                  <Line type="monotone" dataKey="indicator.band.middle" stroke="red" dot = {<CustomDot/>}/>
                  <Line type="monotone" dataKey="indicator.band.upper" stroke="blue" activeDot={{r: 8}} dot = {<CustomDot/>} />
                  <Line type="monotone" dataKey="indicator.band.low" stroke="green" dot = {<CustomDot/>}/>

          </LineChart>  
        );
    }
}


class Graph extends Component{
  render(){
      return(
       
          <IndicatorPanel/>

      );
  }
}


class MainLayOut extends Component{
  render(){
      return (
      <Container >
          <Row>
              <Col lg = {10}>
                <Graph name ="折线图">
                 
                </Graph>
              </Col>
              <Col lg = {2}>
                  <AlertAudio>

                  </AlertAudio>
              </Col>

          </Row>
          <Row>
             
          </Row>
      </Container>
    

      );
  }
}

export default MainLayOut;
