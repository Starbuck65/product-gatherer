import React from 'react';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import './App.css';
import { Query } from "react-apollo";
import { ApolloProvider } from 'react-apollo';
import * as jspdf from 'jspdf';
import Select from 'react-select';

const client = new ApolloClient({
    uri: "https://graphqlserver-productsinfo.herokuapp.com/"
})


var styles = {
    color: 'red',
    visibility: 'hidden'
};

var DIM_OPTIONS = [
  { value: '[50,120]', label: '50x120cm'},
  { value: '[25,60]', label: '25x60cm'},
  { value: 'a4' , label: 'a5'}
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
    };
  };

  updateSearch = (event) => {
    this.setState({
      partNumber: document.getElementById("input_value").value
    })
  }

   submitSearch = (event) => {
     event.preventDefault()
     //console.log(this.state)
   }

   handleChange = (selectedOption) => {
     this.setState({ selectedOption: selectedOption });
     console.log('Option selected: ', selectedOption);
   }



   printDocument=() => {
     const input = document.getElementById('printarea');
     var doc = new jspdf('p','cm',this.state.selectedOption);
     doc.fromHTML(input);
     var nameFile = this.state.partNumber + '.pdf';
     doc.save(nameFile);

   }

  render() {

    const { partNumber } = this.state.partNumber;
    const { selectedOption } = this.state.selectedOption;


    return (
      <ApolloProvider
        client={client}>
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">Product Gatherer</h1>
        </header>
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
        </div>

        <Select
          value={selectedOption}
          onChange={this.handleChange}
          options={DIM_OPTIONS} />


        <div className="button">
          <button onClick={this.printDocument}><b>Download as PDF</b></button>
        </div>

        <div id="printarea"  >
        <Query
          query={GET_INFO_PRODUCT}
          skip={!partNumber}
          variables={{partNumber: partNumber}} >



        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :</p>;
          if (data.product === null) return <p>Null product for reference number</p>;

          return (
            <ul id="panel" style={styles} >
            <p><b></b></p>
            <p><li key={data.product.partNumber}><b>NAME:</b>{data.product.name}</li></p>
            <p><li><b>TYPE: </b>{data.product.type}</li></p>
            <p><li style={styles} ><b>NORMAL_PRICE: </b>{data.product.normalPrice}</li></p>
            <p><li><b>SECOND_PRICE: </b>{data.product.secondPrice}</li></p>
            <p><li><b>FAMILY_START_DATE: </b>{data.product.familyPrice_startDate}</li></p>
            <p><li><b>FAMILY_END_DATE: </b>{data.product.familyPrice_endDate}</li></p>
            <p><li><b>FAMILY_DISCLAIMER: </b>{data.product.familyPrice_disclaimer}</li></p>
            </ul>
          );
        }}

        </Query>
        </div>




      </div>
      </ApolloProvider>
    );
  }
}

export default App;
