import React from 'react';
import './App.css';
import { Container } from 'react-bootstrap';
import Calculator from './Calculator';

export default class App extends React.Component{
  render() : React.ReactNode {
    return (
      <Calculator/>
    );
  }
}