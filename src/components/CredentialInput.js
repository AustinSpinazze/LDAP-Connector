import React, { useState, useEffect } from 'react'
import { Row, Col, Form } from 'react-bootstrap';
import 'bootstrap/dist/css/bootstrap.min.css';

import './CredentialInput.css';

const Input = ({inputHandler, credentials, isauthenticated}) => {
    const [isValid, setIsValid] = useState();
    useEffect(() => {
        setIsValid(isauthenticated)
        console.log("fired");
    }, [isauthenticated])

    return (
        <React.Fragment>
            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Username</Form.Label>
                        <Form.Control 
                            name="username" 
                            placeholder="adservice@example.com" 
                            onChange={inputHandler} 
                            value={credentials.username} 
                            required={true} 
                            className={isValid === null ? "" : (isValid === true ? "valid_Class" : "invalid_Class")}
                            readOnly={isValid}
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Password</Form.Label>
                        <Form.Control 
                            type="password" 
                            name="password" 
                            placeholder="Password for Read-Only Acccount" 
                            onChange={inputHandler} 
                            value={credentials.password} 
                            required={true} 
                            className={isValid === null ? "" : (isValid === true ? "valid_Class" : "invalid_Class")}
                            readOnly={isValid}    
                        />
                    </Form.Group>
                </Col>
            </Row>
            <Row>
                <Col>
                    <Form.Group>
                        <Form.Label>Host</Form.Label>
                        <Form.Control 
                            name="url" 
                            placeholder="ldap(s)://example.com" 
                            onChange={inputHandler} value={credentials.url} 
                            required={true} 
                            className={isValid === null ? "" : (isValid === true ? "valid_Class" : "invalid_Class")}
                            readOnly={isValid}    
                        />
                    </Form.Group>
                </Col>
                <Col>
                    <Form.Group>
                        <Form.Label>Base_DN</Form.Label>
                        <Form.Control 
                            name="baseDN" 
                            placeholder="DC=example,DC=com" 
                            onChange={inputHandler} 
                            value={credentials.baseDN} 
                            required={true} 
                            className={isValid === null ? "" : (isValid === true ? "valid_Class" : "invalid_Class")}
                            readOnly={isValid}    
                        />
                    </Form.Group>
                </Col>
            </Row>
        </React.Fragment>
    );
}

export default Input
