import React from 'react';

import * as ptags from '../templates/ptags';
import { Grid, Form, Button, Container, Header, Icon, Divider, Select, Radio } from 'semantic-ui-react';
import {DateInput}  from 'semantic-ui-calendar-react';

var DIM_OPTIONS = [
  { value: '50_120', text: '50x120cm'},
  { value: '25_60', text: '25x60cm'},
  { value: 'a5' , text: 'a5'}
];

export class PtagPrinter extends React.Component {
  constructor (props) {
    super(props);
    this.state = {
      product: props.product,
      ptagSize: '25_60',
      discount: 10,
      date_start: '',
      date_end: '',
      discountPrice: 0,
      pricingMethod:'1',
    }
  }

  handleChange = (e, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  handleCheck = (e, data) => {
    this.setState({ [data.name]: data.value });
  }

componentDidUpdate = (prevProps) => {
  if (this.props.product !== prevProps.product) {
    this.setState({product: this.props.product});
  }
}


  printDocument = () => {
    const input = document.getElementById('printarea');
    var finalPrice = 0 ;
    var normalPrice = 0;
    console.log(this.state);
    if (this.state.pricingMethod==='1'){
      finalPrice = parseFloat(this.state.product.normalPrice).toFixed(2);
      normalPrice = parseFloat(this.state.product.secondPrice).toFixed(2);
    }else if (this.state.pricingMethod==='2') {
      finalPrice = this.state.product.normalPrice - (this.state.product.normalPrice * (this.state.discount/100));
      //finalPrice = this.state.product.normalPrice - (this.state.product.normalPrice * (this.state.discount/100));
      finalPrice = finalPrice.toFixed(2);
      normalPrice = parseFloat(this.state.product.normalPrice).toFixed(2);
    }else if (this.state.pricingMethod==='3') {
      finalPrice = parseFloat(this.state.discountPrice).toFixed(2);
      normalPrice = parseFloat(this.state.product.normalPrice).toFixed(2);
    }
    switch (this.state.ptagSize) {
      case '50_120':
        ptags.ptag.pb50x120(this.state.product,finalPrice, normalPrice, this.state.date_start, this.state.date_end);
        break;
     case '25_60':
       ptags.ptag.pb25x60(this.state.product,finalPrice, normalPrice, this.state.date_start, this.state.date_end);
       break;
     case 'a5':
       ptags.ptag.a5(this.state.product,finalPrice, normalPrice, this.state.date_start, this.state.date_end);
       break;
      default:
    }
  }

  render() {
    return(
      <div>
      <p><b>Name:</b>{this.state.product.name}</p>
      <p><b>Type: </b>{this.state.product.type}</p>
      <p><b>Normal price: </b>{this.state.product.normalPrice}</p>
      <p><b>Previous Price: </b>{this.state.product.secondPrice}</p>
      <Form>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>From: {this.state.date_start}</label>
            <DateInput
            inline
            name="date_start"
            dateFormat='DD/MM/YY'
            value={this.state.date_start}
            onChange={this.handleChange}/>
          </Form.Field>
          <Form.Field>
            <label>To: {this.state.date_end}</label>
            <DateInput
            inline
            name="date_end"
            dateFormat='DD/MM/YY'
            value={this.state.date_end}
            onChange={this.handleChange}
            />
          </Form.Field>
        </Form.Group>
          <Header as='h4'>Choose price method</Header>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>Automatic</label>
            <Radio toggle value='1' checked={this.state.pricingMethod==='1'} name='pricingMethod' onChange={this.handleCheck}/>
          </Form.Field>
          <Form.Field>
            <label>Discount</label>
            <Radio toggle value='2' checked={this.state.pricingMethod==='2'} name='pricingMethod' onChange={this.handleCheck}/>
          </Form.Field>
          <Form.Input type = "number" label="Discount" id="discount" name='discount' disabled = {this.state.pricingMethod!='2'} value={this.state.discount} onChange={this.handleChange}/>
          <Form.Field>
            <label>Manual Price</label>
            <Radio toggle value='3' checked={this.state.pricingMethod==='3'} name='pricingMethod' onChange={this.handleCheck}/>
          </Form.Field>
          <Form.Input type = "number" label="Reduced price" id="discountPrice" name='discountPrice' disabled = {this.state.pricingMethod!='3'} value={this.state.discountPrice} onChange={this.handleChange}/>

        </Form.Group>
          <Form.Field control={Select} label='Size' name='ptagSize' options={DIM_OPTIONS} placeholder='Size' onChange={this.handleChange} />
          <Button type='submit' onClick={this.printDocument}>Download PDF</Button>
        </Form>
      </div>
    )
  }
}
