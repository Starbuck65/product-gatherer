import React from 'react';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import { Query } from "react-apollo";
import { ApolloProvider } from 'react-apollo';

import { Grid, Form, Button, Container, Header, Icon, Divider, Select, Checkbox } from 'semantic-ui-react';
import {PtagPrinter} from './ptag-printer.js';

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
    priceDisclaimer
    familyPrice_startDate
    familyPrice_endDate
    familyPrice_price
    familyPrice_disclaimer
    lang
    info
  }
}
`
const languages = [
  { key: 'de', text: 'German', value: 'de' },
  { key: 'fr', text: 'French', value: 'fr' },
  { key: 'it', text: 'Italian', value: 'it' }
]

export class OnlineProduct extends React.Component {
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
};
