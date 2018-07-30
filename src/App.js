import React from 'react';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import './App.css';
import { Query } from "react-apollo";
import { ApolloProvider } from 'react-apollo';

import * as ptags from './templates/ptags';
import { Grid, Form, Button, Container, Header, Icon, Divider, Select, Checkbox } from 'semantic-ui-react';
import {DateInput}  from 'semantic-ui-calendar-react';

var DIM_OPTIONS = [
  { value: '50_120', text: '50x120cm'},
  { value: '25_60', text: '25x60cm'},
  { value: 'a5' , text: 'a5'}
];

class PtagPrinter extends React.Component {
  constructor (props) {
        super(props);
    this.state = {
      product: props.product,
      ptagSize: '25_60',
      discount: 10,
      date_start: '',
      date_end: '',
      discountPrice: 0,
      manualPrice: false
    }
  }

  handleChange = (e, {name, value}) => {
    if (this.state.hasOwnProperty(name)) {
      this.setState({ [name]: value });
    }
  }

  handleCheck = (e, data) => {
    this.setState({ [data.name]: data.checked });
  }


  printDocument = () => {
    const input = document.getElementById('printarea');
    var finalPrice = 0 ;
    if (this.state.manualPrice){
      finalPrice = this.state.discountPrice;
    }else {
      finalPrice = this.state.product.normalPrice - (this.state.product.normalPrice * (this.state.discount/100));
      finalPrice = finalPrice.toFixed(2);
    }
    switch (this.state.ptagSize) {
      case '50_120':
        ptags.ptag.pb25x60(this.state.product,finalPrice,this.state.date_start, this.state.date_end);
        break;
     case '25_60':
       ptags.ptag.pb25x60(this.state.product,finalPrice,this.state.date_start, this.state.date_end);
       break;
     case 'a5':
       ptags.ptag.a5(this.state.product,finalPrice);
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
      <p><b>Discount Price: </b>{this.state.product.normalPrice - (this.state.product.normalPrice * (this.state.discount/100))}</p>

      <Form>
        <Form.Group widths='equal'>
          <Form.Field>
            <label>From:</label>
            <DateInput
            inline
            name="date_start"
            dateFormat='DD/MM/YY'
            value={this.state.date_start}
            onChange={this.handleChange}/>
          </Form.Field>
          <Form.Field>
            <label>To:</label>
            <DateInput
            inline
            name="date_end"
            dateFormat='DD/MM/YY'
            value={this.state.date_end}
            onChange={this.handleChange}
            />
          </Form.Field>
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input type = "number" label="Discount" id="discount" name='discount' value={this.state.discount} onChange={this.handleChange}/>
          <Form.Field>
            <label>Manual Price</label>
            <Checkbox toggle checked={this.state.manualPrice} name='manualPrice' onChange={this.handleCheck}/>
          </Form.Field>
          <Form.Input type = "number" label="Reduced price" id="discountPrice" name='discountPrice' disabled = {!this.state.manualPrice} value={this.state.discountPrice} onChange={this.handleChange}/>

        </Form.Group>
          <Form.Field control={Select} label='Size' name='ptagSize' options={DIM_OPTIONS} placeholder='Size' onChange={this.handleChange} />
          <Button type='submit' onClick={this.printDocument}>Download PDF</Button>
        </Form>
      </div>
    )
  }
}



const client = new ApolloClient({
    uri: "https://graphqlserver-productsinfo.herokuapp.com/"
})



const GET_INFO_PRODUCT = gql`
query product($partNumber: String!, $lang: String!) {
  product(partNumber: $partNumber, lang: $lang)  {
    partNumber
    name
    type
    normalPrice
    secondPrice
    familyPrice_startDate
    familyPrice_endDate
    familyPrice_price
    familyPrice_disclaimer
    lang
  }
}
`
const languages = [
  { key: 'de', text: 'German', value: 'de' },
  { key: 'fr', text: 'French', value: 'fr' },
  { key: 'it', text: 'Italian', value: 'it' }
]

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      partNumber: '',
      lang: 'de',
      product: {}
    };
  };

  changeDiscount = (event) => {
    this.setState({
      discount: document.getElementById('discount').value
    })
  }

  updateSearch = (event) => {
    this.setState({
      partNumber: document.getElementById("input_value").value
    });
    //console.log(this.state)
  }

   submitSearch = (event) => {
     event.preventDefault()
     ////console.log(this.state)
   }

   handleChange = (e, {name, value}) => {
     if (this.state.hasOwnProperty(name)) {
       this.setState({ [name]: value });
     }
   }




//     var doc = new jspdf(orientation,'cm',size);//this.state.selectedOption.value);
//     doc.fromHTML(input);
//     var nameFile = this.state.partNumber + '.pdf';
//     doc.save(nameFile);


  render() {

  //  const { status } = this.state;
    //const { selectedOption } = this.state.selectedOption;


    return (
      <ApolloProvider
        client={client}>
        <Container>
      <div className="App">
      <Grid columns = {1} >
        <Grid.Row><Grid.Column>
           <Header as='h2' icon textAlign='center'>
              <Icon name='print' circular />
              <Header.Content>Discount Ptag Printer</Header.Content>
           </Header>
           <Divider />
        </Grid.Column></Grid.Row>
        <Grid.Row><Grid.Column>
        <Grid columns={1} divided>
        <Grid.Row>
          <Grid.Column>
          <Form>
            <Form.Group widths='equal'>
            <Form.Field control={Select} label='Language' options={languages} name='lang' onChange={this.handleChange} value={this.state.lang} placeholder='Language' />
            <Form.Field>
              <label>Enter the product number:</label>
              <Form.Input id="input_value" type="text" placeholder="Product number"/>
            </Form.Field>

            </Form.Group>

            <Button type='submit' onClick={this.updateSearch}>Search</Button>

          </Form>
            <div>
            </div>
            </Grid.Column></Grid.Row>
            <Grid.Row><Grid.Column>
            <Divider />
          <Query
            query={GET_INFO_PRODUCT}
            skip={!this.state.partNumber}
            variables={{partNumber: this.state.partNumber, lang: this.state.lang}} >

          {({ loading, error, data }) => {
            if (loading) return <p></p>;
            if (error) return <p>Error :</p>;
            if (data.product === null) return <p>Null product for reference number</p>;
            return (

              <PtagPrinter
                product={data.product}
                />

            );
          }}

          </Query>

          </Grid.Column></Grid.Row>
        </Grid>
        </Grid.Column></Grid.Row>
        </Grid>







      </div>
      </Container>
      </ApolloProvider>
    );
  }
}

export default App;
