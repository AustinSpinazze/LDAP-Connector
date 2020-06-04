import React, { useState, useMemo, useEffect } from 'react';
import { channels } from './shared/constants';
import { Button, Table, Container, Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import Input from './components/CredentialInput';

import './App.css';
const { ipcRenderer } = window;

const App = () => {
    const [object, setObject] = useState({
        appName: "",
        appVersion: ""
    });
    const [data, setData] = useState([]);
    const [isauthenticated, setIsAuthenticated] = useState(null);
    const [credentials, setCredentials] = useState({
        username: "",
        password: "",
        url: "",
        baseDN: "",
        query: 'CN=*'
    });
    const [input, setInput] = useState("");

    const inputHandler = useMemo(() => (event) => {
        const value = event.target.value;
        const name = event.target.name;
        setCredentials((prevState) => {
            if (name && (name in prevState)) {
                return {
                    //used because it is in an object and not on its own it saves the other properties from getting wiped from object or wanting to add to an array
                    ...prevState,
                    [name]: value
                };
            }
            return prevState;
        })
    },
    );

    useEffect(() => {
        ipcRenderer.send(channels.APP_INFO);
        ipcRenderer.on(channels.APP_INFO, (event, arg) => {
        ipcRenderer.removeAllListeners(channels.APP_INFO);
        const { appName, appVersion } = arg;
        setObject({ appName, appVersion });
    });

    }, [])
    

    const connect = async () => {
        const response = await ipcRenderer.sendSync(channels.AUTHENTICATE, credentials);
        console.log(response);
        setIsAuthenticated(response);
    }

    //...prevState is only used when you care about what what within an object or within 

    const renderArray = (group, index) => {
        return (
            <tr key={index} style={{textAlign: "center"}}>
                <td key={index}>{group}</td>
            </tr>
        )
    }

    const findGroups = async () => {
        console.log(credentials);
        const s = await ipcRenderer.sendSync(channels.FIND_GROUPS, credentials);
        setData(s);
    }

    return (
        <div className="container">
            <h1>{object.appName} version {object.appVersion}</h1>
            <Container>
                <Input inputHandler={inputHandler} credentials={credentials} isauthenticated={isauthenticated}/>
                <Row>
                    <Col>
                        <Button onClick={connect} variant="primary">Connect</Button>
                        <Button onClick={findGroups} variant="primary" style={{ marginLeft: "5px" }}>Find Groups</Button>
                        <Button onClick={() => console.log(credentials)} style={{ marginLeft: "5px" }}>Console Log Credentials</Button>
                    </Col>
                </Row>
            </Container>
            <Container style={{ marginTop: "10px" }}>
                <Form.Group>
                    <Form.Control placeholder="Enter a Group Name" value={input} onChange={e => setInput(e.target.value)}/>
                </Form.Group>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Groups</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.filter(groups => {
                            if(!input) return true;
                            if(groups.includes(input)) {
                                return true;
                            }
                            return false;
                        }).map(groups => (
                            renderArray(groups)
                        ))}
                    </tbody>
                </Table>
            </Container>
        </div>
    );
}

export default App;