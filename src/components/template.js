import React from 'react';

import * as ptags from '../templates/ptags';
import { Grid, Form, Button, Container, Header, Icon, Divider, Select, Checkbox , Popup, Message} from 'semantic-ui-react';
import {DateInput}  from 'semantic-ui-calendar-react';
import {PtagPrinter} from './ptag-printer.js';

const languages = [
  { key: 'de', text: 'German', value: 'de' },
  { key: 'fr', text: 'French', value: 'fr' },
  { key: 'it', text: 'Italian', value: 'it' }
]

export class TemplateProduct extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      product:{
        name: '',
        lang: 'de',
        type: '',
        info: '',
        partNumber: '',
        normalPrice: 0.00,
        secondPrice: 0.00

      }
    };
  };

  handleChange = (e, {name, value}) => {
    if (this.state.product.hasOwnProperty(name)) {
      this.setState(
        { product: {...this.state.product,[name] : value}});
    }
    console.log(this.state);
  }

  render(){
    return(
      <div>
      <Message>
        <Message.Header>Template</Message.Header>
          <p>Using this form you can generate a price banner for any manual information.</p>
        </Message>
      <Form>
      <Form.Field control={Select} label='Language' options={languages} name='lang' onChange={this.handleChange} value={this.state.product.lang} placeholder='Language' />
        <Form.Group widths='equal'>
            <Form.Input type = "text" label="Name" id="name" name='name' value={this.state.product.name} onChange={this.handleChange}/>
            <Form.Input type = "text" label="Type" id="type" name='type' value={this.state.product.type} onChange={this.handleChange}/>
            <Form.Input type = "text" label="Info" id="info" name='info' value={this.state.product.info} onChange={this.handleChange}/>
            <Popup trigger={<Form.Input type = "text" label="Product Number" id="partNumber" name='partNumber' value={this.state.product.partNumber} onChange={this.handleChange}/>} header='Product number' on='focus'>
              <Popup.Content>
                <p>This will be used for the name of the generated file. If is empty, a random name will be generated</p>
              </Popup.Content>
            </Popup>

        </Form.Group>
        <Form.Group widths='equal'>
            <Popup trigger={<Form.Input type = "number" label="Normal Price" id="normalPrice" name='normalPrice' value={this.state.product.normalPrice} onChange={this.handleChange}/>} header='Normal Price' on='focus'>
              <Popup.Content>
                <p>If you choose the <strong>Automatic</strong> price, this will be the discount price. In case you choose <strong>Discount</strong> or <strong>Manual</strong> this will be the normal price.</p>
              </Popup.Content>
            </Popup>

            <Form.Input type = "number" label="Old Price" id="oldPrice" name='secondPrice' value={this.state.product.secondPrice} onChange={this.handleChange}/>
        </Form.Group>
      </Form>
        <PtagPrinter product={this.state.product} />
      </div>
    )
  }
}
