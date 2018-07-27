import React from 'react';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import './App.css';
import { Query } from "react-apollo";
import { ApolloProvider } from 'react-apollo';

import * as ptags from './templates/ptags';
import { Grid, Form, Button, Container, Header, Icon, Divider, Select } from 'semantic-ui-react';


const client = new ApolloClient({
    uri: "https://graphqlserver-productsinfo.herokuapp.com/"
})

var DIM_OPTIONS = [
  { value: '50_120', text: '50x120cm'},
  { value: '25_60', text: '25x60cm'},
  { value: 'a5' , text: 'a5'}
];

const GET_INFO_PRODUCT = gql`
query product($partNumber: String!) {
  product(partNumber: $partNumber)  {
    partNumber
    name
    type
    normalPrice
    secondPrice
    familyPrice_startDate
    familyPrice_endDate
    familyPrice_price
    familyPrice_disclaimer
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
      selectedOption: '',
      discount: 10
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
    console.log(this.state)
  }

   submitSearch = (event) => {
     event.preventDefault()
     //console.log(this.state)
   }

   handleChange = (e, {value}) => {
     this.setState({ selectedOption: value });
     //console.log('Option selected: ', value);
   }



   printDocument=(data) => {
     const input = document.getElementById('printarea');
     console.log(this.state.selectedOption);
     var size = 'a4';
     var orientation = 'p';
     switch (this.state.selectedOption) {
       case '50_120':
         size = [50,120];
         break;
      case '25_60':
        ptags.ptag.pb25x60(data.product,this.state.discount);
        break;
      case 'a5':
        size = 'a4';
        console.log('sdf');
        orientation = 'l';
        ptags.ptag.a5(data.product,this.state.discount);
        break;
       default:
        size = 'a4';
        orientation= 'p';
     }

//     var doc = new jspdf(orientation,'cm',size);//this.state.selectedOption.value);
//     doc.fromHTML(input);
//     var nameFile = this.state.partNumber + '.pdf';
//     doc.save(nameFile);

   }

  render() {

  //  const { status } = this.state;
    //const { selectedOption } = this.state.selectedOption;

console.log(ptags.ptag)
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
        <Grid columns={3} divided>
        <Grid.Row>
          <Grid.Column>
          <Form>
            <Form.Field control={Select} label='Language' options={languages} placeholder='Language' />
            <Form.Field>
              <label>Enter the product number:</label>
              <input id="input_value" type="text" placeholder="Product number"/>
            </Form.Field>
            <Form.Field>
              <label>Discount:</label>
              <input type = "number" id="discount" value="10" onChange={this.changeDiscount}/>
            </Form.Field>
            <Button type='submit' onClick={this.updateSearch}>Search</Button>

          </Form>
            <div>
            </div>
          </Grid.Column>
          <Grid.Column>
          <div id="printarea">
          <Query
            query={GET_INFO_PRODUCT}
            skip={!this.state.partNumber}
            variables={{partNumber: this.state.partNumber}} >

          {({ loading, error, data }) => {
            if (loading) return <p>Loading...</p>;
            if (error) return <p>Error :</p>;
            if (data.product === null) return <p>Null product for reference number</p>;
            this.printDocument(data);
            return (
              <div id="panel">

              <p><b>NAME:</b>{data.product.name}</p>
              <p><b>TYPE: </b>{data.product.type}</p>
              <p><b>NORMAL_PRICE: </b>{data.product.normalPrice}</p>
              <p><b>SECOND_PRICE: </b>{data.product.normalPrice - (data.product.normalPrice * (this.state.discount/100))}</p>
              <p><b>FAMILY_START_DATE: </b>{data.product.familyPrice_startDate}</p>
              <p><b>FAMILY_END_DATE: </b>{data.product.familyPrice_endDate}</p>
              <p><b>FAMILY_DISCLAIMER: </b>{data.product.familyPrice_disclaimer}</p>
              </div>
            );
          }}

          </Query>
          </div>

          </Grid.Column>
          <Grid.Column>
          <Form>
          <Form.Field control={Select} label='Size' name='size' options={DIM_OPTIONS} placeholder='Size' onChange={this.handleChange} />
          <Button type='submit' onClick={this.printDocument}>Download PDF</Button>
          </Form>

          </Grid.Column>
          </Grid.Row>

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
