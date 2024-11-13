const Notification = ({ status }) => {
    const offlineMessage = () => {
        console.log("this works")
        return (<div>
            <h2>You are currently offline</h2>
            <p>Please check your internet connection and try again.</p>
        </div>)
    }

    const message = () => {
        switch (status) {
            case "offline":
                return offlineMessage()
            default:
                return null
        }
    }

    return (
        <div>
            <div id="message">
                {message()}
            </div>
        </div>
    )
}

export default Notification