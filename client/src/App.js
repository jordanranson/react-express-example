import './App.css'
import { useState, useEffect } from 'react'

function App() {
    // Error state so we can display a message to the user if something bad happens
    const [ error, setError ] = useState(false);

    // Loading state so we can do things like disable buttons while asynchronous actions are taking place
    const [ loading, setLoading ] = useState(false)

    // The data that we're sending TO the server FROM the client
    const [ dataFromClient, setDataFromClient ] = useState('')

    // The data we're fetching FROM the server
    const [ dataFromServer, setDataFromServer ] = useState('')

    // Only functions prefixed with `async` can use `await` in them.
    // async/await is syntatic sugar around the Promises API
    const sendClientData = async () => {
        setLoading(true)
        setError(false)
        
        let result
        // Wrap async code in try/catch so we can handle errors
        try {
            const response = await fetch('//localhost:3001/data', {
                method: 'post',
                headers: {
                    'Content-type': 'application/json' // important so Express knows how to parse the body
                },
                body: JSON.stringify({ // Need to stringify it so we can send something HTTP support over the network
                    data: dataFromClient
                }),
            })
            result = await response.json() // Parse the incoming JSON from the response's body
        } catch (error) {
            // Catch client errors
            setError(error.message)
        }
        
        if (result && result.error) {
            // Catch errors sent from the server
            setError(JSON.stringify(result.error))
        }

        // All done, unset loading state
        setLoading(false)
    }

    const fetchRemoteData = async () => {
        setLoading(true)
        setError(false)

        let result
        try {
            const response = await fetch('//localhost:3001/data', {
                method: 'get',
                headers: {
                    'Content-type': 'application/json'
                }
            })
            result = await response.json()
        } catch (error) {
            setError(error.message)
        }
        
        if (result) {
            if (result.error) {
                setError(JSON.stringify(result.error))
            } else {
                setDataFromServer(result.data)
            }
        }

        setLoading(false)
    }

    // Fetch data from the server on page load
    useEffect(() => {
        fetchRemoteData()
    }, [])

    return (
        <div className="App">
            <header className="App-header">
                <div>
                    <p>Local Data</p>
                    <input 
                        type='text' 
                        value={dataFromClient} 
                        onChange={(e) => setDataFromClient(e.target.value)}
                    />
                    <br />
                    <button disabled={loading || !dataFromClient} onClick={sendClientData}>Send Data to Server</button>
                </div>
                
                <div>
                    <p>Remote Data</p>
                    <pre>{dataFromServer}</pre>
                    <button disabled={loading} onClick={fetchRemoteData}>Fetch Data from Server</button>
                </div>

                {
                    error &&
                        <div>
                            <p>HTTP Request Errror</p>
                            <pre><small>{error}</small></pre>
                        </div>
                }
            </header>
        </div>
    )
}

export default App
