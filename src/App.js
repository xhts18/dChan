import React, { Component } from 'react';
import './App.css';
import Container from 'react-bootstrap/lib/Container';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import $ from 'jquery';

import SR9999 from './Sugar.js'
import UpperLowSub from './UpperLowSub.js'
import MFI from './MFI.js'

$.ajaxSetup({
  async: false,

});

const intervalMills = 10000


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

class MainLayOut extends Component{
  render(){
      return (
      <Container >
          <Row>
              <Col lg = {12}>
                <SR9999/>
              </Col>
          </Row>

        
            <Row>
              <Col lg = {12}>
                <MFI/>
              </Col>
          </Row>
          <Row>
              <Col lg = {1}>
                  <AlertAudio>
                  </AlertAudio>
              </Col>
          </Row>
      </Container>
    

      );
  }
}

export default MainLayOut;
