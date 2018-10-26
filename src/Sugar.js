import React, { Component } from 'react';
import './App.css';

import { LineChart,Line,XAxis,CartesianGrid,Tooltip,Legend,YAxis} from 'recharts';
import $ from 'jquery';

const startTime = new Date("2018-07-02 09:00:00").getTime()
const endTime = new Date("2018-07-02 11:30:00").getTime()

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


const intervalMills = 10000
const graphHeight = 400
const graphWidth = 1000

const indicatorPrice =  'joinQuant.futures.price'
const security = 'SR9999.XZCE'

const upper_band_metric = "indicator.band.upper"
const middle_band_metric = "indicator.band.middle"
const low_band_metric = "indicator.band.low"

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
        param["security"] = security  
     
        param['metrics'] = []
        param['metrics'].push(indicatorPrice)
        param['metrics'].push(upper_band_metric)
        param['metrics'].push(middle_band_metric)
        param['metrics'].push(low_band_metric)



       var response = $.post("/restapi/tsdb/queryMulMetric",JSON.stringify(param))


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

           <LineChart width={graphWidth} height={graphHeight} data={this.state.response} margin={{top: 5, right: 30, left: 0, bottom: 5}}>
                
                  <XAxis dataKey="name">

                  </XAxis>
                  <YAxis domain ={['dataMin - 3', 'dataMax + 3']} label={{ value: '白糖', angle: 0, position: 'bottom' ,offset:-20}}>
                   
                  </YAxis>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  <Line type="monotone" dataKey="joinQuant.futures.price" stroke="black" activeDot={{r: 8}} dot = {<CustomDot/>}/>
                  <Line type="monotone" dataKey={upper_band_metric} stroke="red" activeDot={{r: 8}} dot = {<CustomDot/>}/>
                  <Line type="monotone" dataKey={middle_band_metric} stroke="blue" activeDot={{r: 8}} dot = {<CustomDot/>}/>
                  <Line type="monotone" dataKey={low_band_metric} stroke="green" activeDot={{r: 8}} dot = {<CustomDot/>}/>


          </LineChart>  

        );
    }
}

export default SR9999;
