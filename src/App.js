import React from 'react';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import './App.css';
import { Query } from "react-apollo";
import { ApolloProvider } from 'react-apollo';
import Select from 'react-select';
import * as ptags from './templates/ptags';
import { Grid, Form, Button } from 'semantic-ui-react';


const client = new ApolloClient({
    uri: "https://graphqlserver-productsinfo.herokuapp.com/"
})


var styles = {
    color: 'red',
    //visibility: 'hidden'
};

var DIM_OPTIONS = [
  { value: '50_120', label: '50x120cm'},
  { value: '25_60', label: '25x60cm'},
  { value: 'a5' , label: 'a5'}
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

   handleChange = (selectedOption) => {
     this.setState({ selectedOption: selectedOption });
     console.log('Option selected: ', selectedOption);
   }



   printDocument=(data) => {
     const input = document.getElementById('printarea');
     console.log(this.state.selectedOption.value);
     var size = 'a4';
     var orientation = 'p';
     switch (this.state.selectedOption.value) {
       case '50_120':
         size = [50,120];
         break;
      case '25_60':
        size = [25,60];
        break;
      case 'a5':
        size = 'a4';
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
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Product Gatherer</h1>
        </header>
        <Grid columns={3} divided>
        <Grid.Row>
          <Grid.Column>
          <Form>
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
            <div className="App-intro">
              <p className="intro-header">
                Please, enter the Product Number below:
              </p>
              <form onSubmit={this.submitSearch}>
                <label>
                  <input id="input_value" type="text"/>
                </label>
                <input type="submit" onClick={this.updateSearch} />
              </form>
              <input type = "number" id="discount" value="10" onChange={this.changeDiscount}/>
            </div>
            <div>
              <Select value={this.state.selectedOption} onChange={this.handleChange} options={DIM_OPTIONS}/>
            </div>
          </Grid.Column>
          <Grid.Column>
          <div className="button">
            <button onClick={this.printDocument}><b>Download as PDF</b></button>
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
              <ul id="panel" style={styles} >
              <p><b></b></p>
              <p><li key={data.product.partNumber}><b>NAME:</b>{data.product.name}</li></p>
              <p><li><b>TYPE: </b>{data.product.type}</li></p>
              <p><li style={styles} ><b>NORMAL_PRICE: </b>{data.product.normalPrice}</li></p>
              //<p><li><b>SECOND_PRICE: </b>{data.product.secondPrice}</li></p>
              <p><li><b>SECOND_PRICE: </b>{data.product.normalPrice - (data.product.normalPrice * (this.state.discount/100))}</li></p>
              <p><li><b>FAMILY_START_DATE: </b>{data.product.familyPrice_startDate}</li></p>
              <p><li><b>FAMILY_END_DATE: </b>{data.product.familyPrice_endDate}</li></p>
              <p><li><b>FAMILY_DISCLAIMER: </b>{data.product.familyPrice_disclaimer}</li></p>
              </ul>
            );
          }}

          </Query>
          </div>

          </Grid.Column>
          </Grid.Row>

        </Grid>








      </div>
      </ApolloProvider>
    );
  }
}

export default App;
