
import React, { Component } from 'react';

import { LineChart,Line,XAxis,CartesianGrid,Tooltip,Legend,YAxis} from 'recharts';
import $ from 'jquery';

const startTime = new Date("2018-10-19 09:00:00").getTime()
const endTime = new Date("2018-10-19 15:00:00").getTime()


const intervalMills = 10000
const graphHeight = 400
const graphWidth = 1000

const atrMetric = "indicator.atr"
const security = "SR9999.XZCE"

class CustomDot extends Component{
  render(){
      return(
          <div>
          </div>

        );
  }
}

class  ATR extends Component{
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
        param['metrics'].push(atrMetric)
     
       var response = $.post("/restapi/tsdb/queryMulMetric",JSON.stringify(param))


       var responseText = response.responseText
       var jsonArray = $.parseJSON(responseText)
       var length = jsonArray.length


      if(length === 0 ){
          var mockObj = {}
          mockObj["name"] = 'Nan'
          mockObj[atrMetric] = 0
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
                  <YAxis domain ={['dataMin - 0.5', 'dataMax + 0.5']} label={{ value: 'ADX', angle: 0, position: 'bottom' ,offset:-20}}>
                  </YAxis>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                 
                  <Line type="monotone" dataKey={atrMetric} stroke="black" activeDot={{r: 8}} dot = {<CustomDot/>}/>
                  
          </LineChart>  

        );
    }
}

export default ATR;
