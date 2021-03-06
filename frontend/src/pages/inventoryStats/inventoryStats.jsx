import React from "react"
import Navbar from "../../components/navbar/navbar"
import InvBar from "../../components/invNavBar/invNavbar"
import {Line} from "react-chartjs-2"
import ErrorDiv from "../../components/errorDiv/errorDiv"

class InventoryStats extends React.Component {
    state = {
        x: null,
        y: null, 
        loading: false,
        error: false,
        error_element: null
    }

    async componentDidMount() {
        var element = document.getElementById("stats-point")
        element.style.backgroundColor = "#fff"
        element.style.color = "#353535"
        this.setState({loading: true})
        const url = "/api/inventory/stats"
        const response = await fetch(url, {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({"steamid": this.props.match.params.steamid, "api_key": ""})
        })
        if (response.status != 200) {
            this.setState({error: true, error_element: <ErrorDiv statusCode={response.status}/>})
            return
        }
        const data = await response.json()
        let x_data = []
        let y_data = []
        Object.keys(data).map((x) => {
            x_data.push(x)
            y_data.push(parseFloat(data[x]["todays_cashout"].split("$")[1]))
        })
        this.setState({loading: false, x: x_data, y: y_data})
    }
    render() {
        return(
            <div className="inventoryStats">
                <Navbar title="Stats" steamid={this.props.match.params.steamid}/>
                <InvBar steamid={this.props.match.params.steamid}/>
                <br/>
                {this.state.error ? <div className="item-grid">{this.state.error_element}</div> : 
                <div align="center" className="chart">
                    <Line
                        data={{
                            labels: this.state.x,
                            datasets: [{
                                label:"Value",
                                data: this.state.y
                            }],
                            borderColor: '#c54964',
                        }}
                    />
                </div>}
            </div>
        )
    }
}

export default InventoryStats;