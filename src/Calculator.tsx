import { monitorEventLoopDelay } from "perf_hooks";
import React from "react";
import { Button, Container, Form, InputGroup, Table } from "react-bootstrap";

interface IProps{
}

interface IState{
    homePrice: number | '';
    downPayment: number | '';
    interestRate: number | '';
    loanTerm: number | '';
    startDate: number | '';
    propertyTax: number | '';
    homeInsurance: number | '';
    pmiInsurance: number | '';
    hoaFee: number | '';
    otherCosts: number | '';
    monthlyPayment: number | null,
    expandForm1: boolean,
}

export default class Calculator extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);
        this.state = {
            homePrice: '',
            downPayment: '',
            interestRate: '',
            loanTerm: '',
            startDate: '',
            propertyTax: '',
            homeInsurance: '',
            pmiInsurance: '',
            hoaFee: '',
            otherCosts: '',
            monthlyPayment: null,
            expandForm1: false
        };
    }

    getMonthsAsOptions = () => {
        const months: string[] = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return months.map((month, index) => (
            <option key={index} value={index + 1}>
                {month}
            </option>
        ));
    }

    getSymbolsAsOptions = () => {
        const symbols : string[] = ["%", "$"];
        return symbols.map((sym, index) => (
            <option key={index} value={index}>{sym}</option>
        ));
    }

    clearForm = () => {
        this.setState({
            homePrice: '',
            downPayment: '',
            interestRate: '',
            loanTerm: '',
            startDate: '',
            propertyTax: '',
            homeInsurance: '',
            pmiInsurance: '',
            hoaFee: '',
            otherCosts: '',
            monthlyPayment: null,
            expandForm1: false,
        });
    };

    handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        this.setState(({
            [name]: Number(value),
        } as unknown) as IState);
    }

    handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let { homePrice, interestRate, downPayment, loanTerm} = this.state;
        if(homePrice === ''){
            homePrice = 0;
        } 
        if(interestRate === ''){
            interestRate = 0;
        }
        if(downPayment === ''){
            downPayment = 0;
        }
        if(loanTerm === ''){
            loanTerm = 0;
        }
        const loanAmount = homePrice - downPayment;
        const monthlyInterestRate = interestRate / 1200;
        const accumulationFactor = Math.pow((1 + monthlyInterestRate), loanTerm * 12);
        const monthlyPayment = (loanAmount * monthlyInterestRate * accumulationFactor) / (accumulationFactor - 1);
        this.setState({ monthlyPayment });
    }

    handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        this.setState({ expandForm1: e.target.checked });
    }

    fillValues = () => {
        let { homePrice, interestRate, downPayment, loanTerm} = this.state;
        if(homePrice === ''){
            homePrice = 0;
        } 
        if(interestRate === ''){
            interestRate = 0;
        }
        if(downPayment === ''){
            downPayment = 0;
        }
        if(loanTerm === ''){
            loanTerm = 0;
        }
        const monthlyInterestRate = interestRate / 1200;
        const monthlyPayment = this.state.monthlyPayment === null ? 0 : this.state.monthlyPayment;
        const tableRows = [];
        let remainingBalance = homePrice - downPayment;
        for(let i = 0; i < loanTerm * 12; i++){
            let interestPayment = remainingBalance * monthlyInterestRate;
            let principalPayment = monthlyPayment - interestPayment;
            remainingBalance = remainingBalance - principalPayment;
            tableRows.push([interestPayment, principalPayment, remainingBalance]);
        }
        return tableRows.map((row, index) => (
            <tr>
                <td>{index + 1}</td>
                <td>{row[0]}</td>
                <td>{row[1]}</td>
                <td>{row[2]}</td>
            </tr>
        ));
    }
    
    render() : React.ReactNode {
        return(
          <Container>
            <Form onSubmit={this.handleOnSubmit}>
                <Form.Group>
                    <Form.Label>Home Price</Form.Label>
                    <Form.Control name="homePrice" type ="text" value={this.state.homePrice} onChange={this.handleInputOnChange}>
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Downpayment</Form.Label>
                    <Form.Control type="text" name="downPayment" value={this.state.downPayment} onChange={this.handleInputOnChange}>
                    </Form.Control>
                    <Form.Select>
                        {this.getSymbolsAsOptions()}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Loan Term</Form.Label>
                    <InputGroup>
                        <Form.Control type="text" name="loanTerm" value={this.state.loanTerm} onChange={this.handleInputOnChange}>
                        </Form.Control>
                        <InputGroup.Text>years</InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Interest Rate</Form.Label>
                    <InputGroup>
                        <Form.Control type="text" placeholder="%" name="interestRate" value={this.state.interestRate} onChange={this.handleInputOnChange}>
                        </Form.Control>
                        <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Select>
                        {this.getMonthsAsOptions()}
                    </Form.Select>
                    <Form.Control type="text" placeholder="YYYY">
                    </Form.Control>
                </Form.Group>
                <Form.Group>
                    <Form.Check
                        type="switch"
                        label="Include Taxes & Costs"
                        checked={this.state.expandForm1}
                        onChange={this.handleSwitchChange}
                    />
                </Form.Group>
                {(this.state.expandForm1 === true) ?
                    <>
                        <Form.Group>
                            <Form.Label>Property Taxes</Form.Label>
                            <Form.Control type="text">
                            </Form.Control>
                            <Form.Select>
                            {this.getSymbolsAsOptions()}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Home Insurance</Form.Label>
                            <Form.Control type="text">
                            </Form.Control>
                            <Form.Select>
                                {this.getSymbolsAsOptions()}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>PMI Insurance</Form.Label>
                            <Form.Control type="text">
                            </Form.Control>
                            <Form.Select>
                                {this.getSymbolsAsOptions()}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>HOA Fee</Form.Label>
                            <Form.Control type="text">
                            </Form.Control>
                            <Form.Select>
                                {this.getSymbolsAsOptions()}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Other Costs</Form.Label>
                            <Form.Control type="text">
                            </Form.Control>
                            <Form.Select>
                                {this.getSymbolsAsOptions()}
                            </Form.Select>
                        </Form.Group>
                        <Form.Text>Annual Tax & Cost Increase</Form.Text>
                        <Form.Group>
                            <Form.Label>Property Taxes Increase</Form.Label>
                            <Form.Control type="text" placeholder="%">
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Home Insurance Increase</Form.Label>
                            <Form.Control type="text" placeholder="%">
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>HOA Fee Increase</Form.Label>
                            <Form.Control type="text" placeholder="%">
                            </Form.Control>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Other Costs Increase</Form.Label>
                            <Form.Control type="text" placeholder="%">
                            </Form.Control>
                        </Form.Group>
                    </>                
                : null}
                <Button type="submit">Calculate</Button>
                <Button onClick={this.clearForm}>Clear</Button>
            </Form>
            {/* Display the result if it exists */}
            {this.state.monthlyPayment !== null && (
                <Table striped bordered size="sm">
                    <thead>
                        <tr>
                            <th>Month</th>
                            <th>Interest</th>
                            <th>Principal</th>
                            <th>Ending Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.fillValues()}
                    </tbody>
                </Table>
            )}
          </Container>
          );
    }
}