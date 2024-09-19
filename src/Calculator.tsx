import React, { Component } from "react";
import { Container, Form } from "react-bootstrap";

interface IProps{
}

interface IState{
}

export default class Calculator extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);
    }

    render() : React.ReactNode {
        return(
          <Container>
            <Form>
                <Form.Group>

                </Form.Group>
            </Form>
          </Container>
          );
    }
}