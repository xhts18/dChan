import React, { Component } from 'react';
import './App.css';
import Container from 'react-bootstrap/lib/Container';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { LineChart,Line,XAxis,CartesianGrid,Tooltip,Legend,YAxis,Label} from 'recharts';
import $ from 'jquery';
import RSI from './RSI.js'

$.ajaxSetup({
  async: false,

});

const startTime = new Date("2018-09-27 09:00:00").getTime()
const endTime = new Date("2018-09-27 15:00:00").getTime()
const intervalMills = 10000
const graphHeight = 450
const graphWidth = 1000

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
        intervalMills
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
          console.log("play") 
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

// 豆粕
class  M1901 extends Component{
    constructor(props) {
        super(props);
        this.state = {response:this.requestIndicatorData()}
    }

    componentDidMount() {

      this.timerID = setInterval(
        () => this.tick(),
        intervalMills
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
       
        var param = {}
        param["start"] = startTime
        param["end"] = endTime
        param["security"] = "M1901.XDCE"  
     
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

           <LineChart width={graphWidth} height={graphHeight} data={this.state.response} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                
                  <XAxis dataKey="name">

                  </XAxis>
                  <YAxis domain ={['dataMin - 3', 'dataMax + 3']} label={{ value: '豆粕', angle: 0, position: 'bottom' ,offset:-20}}>
                   
                  </YAxis>
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


// 白糖
class  SR9999 extends Component{
    constructor(props) {
        super(props);
        this.state = {response:this.requestIndicatorData()}
    }

    componentDidMount() {

      this.timerID = setInterval(
        () => this.tick(),
        intervalMills
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
       
        var param = {}
        param["start"] = startTime
        param["end"] = endTime
        param["security"] = "SR9999.XZCE"  
     
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

           <LineChart  width={graphWidth} height={graphHeight} data={this.state.response} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                
                  <XAxis dataKey="name">

                  </XAxis>
                  <YAxis domain ={['dataMin - 3', 'dataMax + 3']} label={{ value: '白糖', angle: 0, position: 'bottom' ,offset:-20}}>
                   
                  </YAxis>
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



//螺纹钢
class  RB9999 extends Component{
    constructor(props) {
        super(props);
        this.state = {response:this.requestIndicatorData()}
    }

    componentDidMount() {

      this.timerID = setInterval(
        () => this.tick(),
        intervalMills
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
       
        var param = {}
        param["start"] = startTime
        param["end"] = endTime
        param["security"] = "RB9999.XSGE"  
     
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

           <LineChart  width={graphWidth} height={graphHeight} data={this.state.response} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                
                  <XAxis dataKey="name">

                  </XAxis>
                  <YAxis domain ={['dataMin - 3', 'dataMax + 3']} label={{ value: '螺纹钢', angle: 0, position: 'bottom' ,offset:-20}}>
                   
                  </YAxis>
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


class MainLayOut extends Component{
  render(){
      return (
      <Container >
          <Row>
              <Col lg = {11}>
                <M1901/>
              </Col>
              <Col lg = {1}>
                  <AlertAudio>

                  </AlertAudio>
              </Col>

          </Row>
          <Row>
          
              <Col lg={12}>
                <RSI/>
              </Col>
          </Row>




     

      </Container>
    

      );
  }
}

export default MainLayOut;
