
import React, { Component } from 'react';

import { LineChart,Line,XAxis,CartesianGrid,Tooltip,Legend,YAxis} from 'recharts';
import $ from 'jquery';

const startTime = new Date("2018-10-12 09:00:00").getTime()
const endTime = new Date("2018-10-12 15:00:00").getTime()


const intervalMills = 10000
const graphHeight = 400
const graphWidth = 1000

const macdMetric = "indicator.macd"
const upperSubLowBand = "indicator.band.upperSubLow"
const security = "SR9999.XZCE"
const yAxisZero = []

class CustomDot extends Component{
  render(){
      return(
          <div>
          </div>

        );
  }
}

class  MACD extends Component{
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
        param['metrics'].push(macdMetric)
        param['metrics'].push(upperSubLowBand)
     
       var response = $.post("/restapi/tsdb/queryMulMetric",JSON.stringify(param))


       var responseText = response.responseText
       var jsonArray = $.parseJSON(responseText)
       var length = jsonArray.length


      if(length === 0 ){
          var mockObj = {}
          mockObj["name"] = 'Nan'
          mockObj[macdMetric] = 0
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

          jsonArray[i]["yAxisZero"] = 0
       }

       return jsonArray

    } 

  
    render(){
        return(

           <LineChart width={graphWidth} height={graphHeight} data={this.state.response} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                
                  <XAxis dataKey="name">

                  </XAxis>
                  <YAxis domain ={['dataMin - 0.5', 'dataMax + 0.5']} label={{ value: 'MACD', angle: 0, position: 'bottom' ,offset:-20}}>
                  </YAxis>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                 
                  <Line type="monotone" dataKey="indicator.band.upperSubLow" stroke="red" activeDot={{r: 8}} dot = {<CustomDot/>}/>
                  
          </LineChart>  

        );
    }
}

export default MACD;
