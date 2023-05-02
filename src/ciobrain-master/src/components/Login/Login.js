import React, { Component } from "react"
import Popup from "reactjs-popup"
import "./Login.css"
import "reactjs-popup/dist/index.css"
import axios from "axios"
import dotenv from 'dotenv';
dotenv.config();

const URL =
    process.env.NODE_ENV === "development"
        ? process.env.REACT_APP_LOCAL + "/auth"
        : process.env.REACT_APP_API + "/auth"
const api = axios.create({ baseURL: URL })
console.log(process.env.REACT_APP_LOCAL + "/auth");
console.log(process.env.REACT_APP_API + "/auth");
//const api = axios.create({ baseURL: process.env.REACT_APP_API })


const modalStyle = {
    maxWidth: "600px",
    width: "80%",
    borderRadius: "10px",
    border: "1px solid #D6D6D6",
    boxShadow: "0 4px 4px rgba(0, 0, 0, 0.25)"
}

const formStyle = {
    display: "flex",
    flexDirection: "row",
    padding: "10px",
    justifyContent: "center"
}


export default class Login extends Component {
    constructor(props) {
        super(props)
        this.state = {password: null, loginsucc: "False"};
    }

    render() {
        return (
            <Popup
                open={true}
                modal={true}
                closeOnEscape={false}
                closeOnDocumentClick={false}
                contentStyle={modalStyle}>
                {close => this.popupContent(close)}
            </Popup>
        )
    }

    popupContent(close) {
        // const closeAndReset = event => {
        //     close(event)
        //     this.setState({asset: null})
        // }

        const handleSubmit = async(event) => {
            event.preventDefault()
            console.log("Password entered: " + this.state.password)
            await this.pushLogin()
            if(this.state.loginsucc==='Success'){
                close(event)
            }

        }
        const handleChange = event =>{
            this.setState({password: event.target.value});
            event.preventDefault();
        }
        const checkLoginned = event =>{
            if(this.state.loginsucc==='True'){
                console.log(this.state.loginsucc)
                close(event)
            }
        }

        return (
            <div className="modal">
                <div className="header">Login</div>
                <div className="content">
                    {checkLoginned}
                    <form onSubmit={handleSubmit} style={formStyle}>
                        <label>Enter your Password:</label>
                        <input
                            type="password"
                            style={{ width: "33.34%", margin: "auto" }}
                            id="LOGIN-INPUT"
                            name="passInput"
                            onChange={handleChange}
                        />
                        <input type="submit"/>
                    </form>
                </div>
            </div>
        )
    }
    
    async pushLogin() {
        const password = this.state.password
        await post(URL, {pass: password}).then(response => {
            console.log("API url: " + URL + ", Login result: " + response)
            this.setState({loginsucc: response});
        })
    }
}

const post = async (url, data) => {
    try {
        return (await api.post(url, data)).data
    } catch (error) {
        console.log(error)
    }
}
