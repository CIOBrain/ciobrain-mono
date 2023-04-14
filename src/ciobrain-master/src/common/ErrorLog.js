import axios from "axios"

let errorLoggingURL = `${process.env.REACT_APP_API}/log`;

export async function log(error, details) {
    displayMessage(error)
    try {
        const response = await axios.post(errorLoggingURL, {
            time: getCurrentDateTime(),
            data: "ERROR: " + error,
            details: details
        })
        return response.data
    } catch (error) {
        console.error(error)
    }
}

function displayMessage(error) {
    window.app.addMessage(error + ". See server log for more details. ")
}

function getCurrentDateTime() {
    const today = new Date()
    const date = `${today.getFullYear()}-${today.getMonth() + 1
        }-${today.getDate()}`
    const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`
    return `${date} ${time}`
}
