import { monitorEventLoopDelay } from "perf_hooks";
import React from "react";
import { Button, Container, Form, InputGroup, Table } from "react-bootstrap";

interface IProps{

}

interface IState{
    homePrice: number | '';
    downPaymentNum: number | '';
    downPaymentSym: '%' | '$';
    interestRate: number | '';
    loanTerm: number | '';
    startDate: number | '';
    propertyTax: number | '';
    homeInsurance: number | '';
    pmiInsurance: number | '';
    hoaFee: number | '';
    otherCosts: number | '';
    monthlyPayment: number | null,
    monthlyPaymentTotal: number| null,
    expandForm1: boolean,
    monthOrYear: boolean,
}

export default class Calculator extends React.Component<IProps, IState>{
    constructor(props: IProps){
        super(props);
        this.state = {
            homePrice: 1000000,
            downPaymentNum: 20,
            downPaymentSym: '%',
            interestRate: 6,
            loanTerm: 30,
            startDate: '',
            propertyTax: 1,
            homeInsurance: 1500,
            pmiInsurance: 900,
            hoaFee: 100,
            otherCosts: 200,
            monthlyPayment: null,
            monthlyPaymentTotal: null,
            expandForm1: false,
            monthOrYear: false,
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
            downPaymentNum: '',
            downPaymentSym: '%',
            interestRate: '',
            loanTerm: '',
            startDate: '',
            propertyTax: '',
            homeInsurance: '',
            pmiInsurance: '',
            hoaFee: '',
            otherCosts: '',
            monthlyPayment: null,
            monthlyPaymentTotal: null,
            expandForm1: false,
            monthOrYear: false,
        });
    };

    handleInputOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        this.setState(({
            [name]: Number(value),
        } as unknown) as IState);
    }

    handleSwitchChange = (e: React.ChangeEvent<HTMLInputElement>) =>{
        this.setState({ expandForm1: e.target.checked });
    }

    handleSwitchChange2 = (e: React.ChangeEvent<HTMLInputElement>, ) =>{
        this.setState({ monthOrYear: e.target.checked });
    }

    handleOnSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        let { homePrice, interestRate, downPaymentNum, loanTerm, pmiInsurance, propertyTax, hoaFee, homeInsurance, otherCosts} = this.state;
        if(homePrice === ''){
            homePrice = 0;
        } 
        if(interestRate === ''){
            interestRate = 0;
        }
        if(downPaymentNum === ''){
            downPaymentNum = 0;
        }
        if(loanTerm === ''){
            loanTerm = 0;
        }
        if(homeInsurance === ''){
            homeInsurance = 0;
        }
        if(propertyTax === ''){
            propertyTax = 0;
        }
        if(pmiInsurance === ''){
            pmiInsurance = 0;
        }
        if(hoaFee === ''){
            hoaFee = 0;
        }
        if(otherCosts === ''){
            otherCosts = 0;
        }
        let downPayment = downPaymentNum;
        if(this.state.downPaymentSym === '%'){
            downPayment = (homePrice * downPayment) / 100;
        }
        const loanAmount = homePrice - downPayment;
        const monthlyInterestRate = interestRate / 1200;
        const accumulationFactor = Math.pow((1 + monthlyInterestRate), loanTerm * 12);
        const monthlyPayment = (loanAmount * monthlyInterestRate * accumulationFactor) / (accumulationFactor - 1);
        const propertyTaxMonth = (homePrice * propertyTax) / 1200;
        const monthlyPaymentTotal = monthlyPayment + (homeInsurance / 12) + propertyTaxMonth + pmiInsurance + hoaFee + otherCosts;
        this.setState({ monthlyPayment, monthlyPaymentTotal });
    }

    displayResult = (showMontly: boolean) => {
        let { homePrice, interestRate, downPaymentNum, loanTerm, homeInsurance, propertyTax, pmiInsurance, hoaFee, otherCosts} = this.state;
        if(homePrice === ''){
            homePrice = 0;
        } 
        if(interestRate === ''){
            interestRate = 0;
        }
        if(downPaymentNum === ''){
            downPaymentNum = 0;
        }
        if(loanTerm === ''){
            loanTerm = 0;
        }
        if(homeInsurance === ''){
            homeInsurance = 0;
        }
        if(propertyTax === ''){
            propertyTax = 0;
        }
        if(pmiInsurance === ''){
            pmiInsurance = 0;
        }
        if(hoaFee === ''){
            hoaFee = 0;
        }
        if(otherCosts === ''){
            otherCosts = 0;
        }
        const monthlyPaymentTotal = this.state.monthlyPaymentTotal === null ? 0 : this.state.monthlyPaymentTotal;
        const monthlyPayment = this.state.monthlyPayment === null ? 0 : this.state.monthlyPayment;
        const ceilOrZero = (num : number) =>{
            if(num < 0){
                return 0;
            }
            return Math.ceil(num);
        }
        let downPayment = downPaymentNum;
        if(this.state.downPaymentSym === '%'){
            downPayment = (homePrice * downPayment) / 100;
        }
        const monthlyInterestRate = interestRate / 1200;
        const tableRowsMonthly = [];
        const tableRowsYearly = [];
        let remainingBalance = homePrice - downPayment;
        let yearlyInterestPayment = 0;
        let yearlyPrincipalPayment = 0;
        for(let i = 1; i <= loanTerm * 12; i++){
            let interestPayment = remainingBalance * monthlyInterestRate;
            let principalPayment = monthlyPayment - interestPayment;
            remainingBalance = remainingBalance - principalPayment;
            yearlyInterestPayment += interestPayment;
            yearlyPrincipalPayment += principalPayment;
            tableRowsMonthly.push([ceilOrZero(interestPayment), ceilOrZero(principalPayment), ceilOrZero(remainingBalance)]);
            if(i % 12 == 0){
                tableRowsYearly.push([ceilOrZero(yearlyInterestPayment), ceilOrZero(yearlyPrincipalPayment), ceilOrZero(remainingBalance)]);
                yearlyInterestPayment = 0;
                yearlyPrincipalPayment = 0;
            }
        }
        const resultDisplay = showMontly ? tableRowsMonthly : tableRowsYearly;
        return resultDisplay.map((row, index) => (
            <tr>
                <td>{index + 1}</td>
                <td>${row[0]}</td>
                <td>${row[1]}</td>
                <td>${row[2]}</td>
            </tr>
        ));
    }
    
    render() : React.ReactNode {
        return(
          <Container>
            <Form onSubmit={this.handleOnSubmit}>
                <Form.Group>
                    <Form.Label>Home Price</Form.Label>
                    <Form.Control name="homePrice" type ="text" value={this.state.homePrice} onChange={this.handleInputOnChange}/>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Downpayment</Form.Label>
                    <Form.Control type="text" name="downPaymentNum" value={this.state.downPaymentNum} onChange={this.handleInputOnChange}/>
                    <Form.Select>
                        {this.getSymbolsAsOptions()}
                    </Form.Select>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Loan Term</Form.Label>
                    <InputGroup>
                        <Form.Control type="text" name="loanTerm" value={this.state.loanTerm} onChange={this.handleInputOnChange}/>
                        <InputGroup.Text>years</InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Interest Rate</Form.Label>
                    <InputGroup>
                        <Form.Control type="text" placeholder="%" name="interestRate" value={this.state.interestRate} onChange={this.handleInputOnChange}/>
                        <InputGroup.Text>%</InputGroup.Text>
                    </InputGroup>
                </Form.Group>
                <Form.Group>
                    <Form.Label>Start Date</Form.Label>
                    <Form.Select>
                        {this.getMonthsAsOptions()}
                    </Form.Select>
                    <Form.Control type="text" placeholder="YYYY"/>
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
                            <Form.Label>Property Taxes (Annual)</Form.Label>
                            <InputGroup>
                                <Form.Control type="text" name="propertyTax" value={this.state.propertyTax} onChange={this.handleInputOnChange}/>
                                <InputGroup.Text>%</InputGroup.Text>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Home Insurance (Annual)</Form.Label>
                            <InputGroup>
                                <Form.Control type="text" name="homeInsurance" value={this.state.homeInsurance} onChange={this.handleInputOnChange}/>
                            </InputGroup>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>PMI Insurance (Monthly)</Form.Label>
                            <Form.Control type="text" name="pmiInsurance" value={this.state.pmiInsurance} onChange={this.handleInputOnChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>HOA Fee (Monthly)</Form.Label>
                            <Form.Control type="text" name="hoaFee" value={this.state.hoaFee} onChange={this.handleInputOnChange}/>
                        </Form.Group>
                        <Form.Group>
                            <Form.Label>Other Costs (Monthly)</Form.Label>
                            <Form.Control type="text" name="otherCosts" value={this.state.otherCosts} onChange={this.handleInputOnChange}/>
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
            <Form.Check
                type="switch"
                label="Show Payments Month by Month"
                checked={this.state.monthOrYear}
                onChange={this.handleSwitchChange2}
            />
            {/* Display the result if it exists */}
            {this.state.monthlyPayment !== null && (
                <Table striped bordered size="sm">
                    <thead>
                        <tr>
                            <th>{this.state.monthOrYear ? "Month" : "Year"}</th>
                            <th>Interest</th>
                            <th>Principal</th>
                            <th>Ending Balance</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.displayResult(this.state.monthOrYear)}
                    </tbody>
                </Table>
            )}
          </Container>
          );
    }
}