import React, { Component } from 'react';
import './App.css';
import Container from 'react-bootstrap/lib/Container';
import Row from 'react-bootstrap/lib/Row';
import Col from 'react-bootstrap/lib/Col';

import { LineChart,Line,XAxis,CartesianGrid,Tooltip,Legend,YAxis} from 'recharts';


const data = [
      {name: 'Page A', uv: 4000, pv: 2400, amt: 2400},
      {name: 'Page B', uv: 3000, pv: 1398, amt: 2210},
      {name: 'Page C', uv: 2000, pv: 9800, amt: 2290},
      {name: 'Page D', uv: 2780, pv: 3908, amt: 2000},
      {name: 'Page E', uv: 1890, pv: 4800, amt: 2181},
      {name: 'Page F', uv: 2390, pv: 3800, amt: 2500},
      {name: 'Page G', uv: 3490, pv: 4300, amt: 2100},
];
// 指标面板
class  IndicatorPanel extends Component{
    constructor(props) {
        super(props);
        this.state = {response: this.requestIndicatorData()};
    }

    componentDidMount() {
      this.timerID = setInterval(
        () => this.tick(),
        20000
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



    httpPost(url,param){
        fetch(url,{
            method:'post',
            mode:'cors',
            headers: {
              'Content-Type': 'application/json'
            },
            body:param,
            credentials: "same-origin"

        }).then(function(response){
            return response.json()
          // return response
        },function(error){
          console.error(error)
        }).then(function(data){
          console.log(data)
        })

    }

    requestIndicatorData(){
        console.log("http post")
        var startTime = new Date("2018-09-21 00:00:00").getTime()
        var endTime = new Date("2018-09-22 00:00:00").getTime()
        var param = {}
        param["start"] = startTime
        param["end"] = endTime
        
        var queries = [];
        var oneQueryObj = {};
        oneQueryObj["aggregator"] = "sum";
        oneQueryObj["metric"] = "joinQuant.futures.price"

        var tags = {}
        tags["security"] = "M1901.XDCE"
        oneQueryObj["tags"] = tags 

        queries.push(oneQueryObj)
        param["queries"] = queries

        var response = this.httpPost("/restapi/tsdb/query",JSON.stringify(param))
    } 

   

    render(){
        return(
              <LineChart width={900} height={500} data={data} margin={{top: 5, right: 30, left: 20, bottom: 5}}>
                  <XAxis dataKey="name"/>
                  <YAxis/>
                  <CartesianGrid strokeDasharray="3 3"/>
                  <Tooltip/>
                  <Legend />
                  
                  <Line type="monotone" dataKey="pv" stroke="#8884d8" activeDot={{r: 8}}/>
                  <Line type="monotone" dataKey="uv" stroke="#82ca9d" />
              </LineChart>
        );
    }
}


class Graph extends Component{
  render(){
      return(
          // <div style={{height:'500px',border:'1px solid red',textAlign:'center',lineHeight:'500px'}}>
          // {this.props.name}
                     <IndicatorPanel></IndicatorPanel>

          // </div>
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
                大健康
              </Col>

          </Row>
          <Row>
             
          </Row>
      </Container>
    

      );
  }
}

export default MainLayOut;
