import React from 'react';
import ApolloClient from 'apollo-boost';
import gql from 'graphql-tag';
import './App.css';
import { Query } from "react-apollo";
import { ApolloProvider } from 'react-apollo';

const client = new ApolloClient({
    uri: "https://graphqlserver-productsinfo.herokuapp.com/"
})

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
    this.state = {partNumber: ''};
  }

  updateSearch = (event) => {
    this.setState({
      partNumber: document.getElementById("input_value").value
    })
  }

   submitSearch = (event) => {
     event.preventDefault()
     //console.log(this.state)
   }

  render() {

    const { partNumber } = this.state;

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

        <Query
          query={GET_INFO_PRODUCT}
          skip={!partNumber}
          variables={{partNumber: partNumber}} >

        {({ loading, error, data }) => {
          if (loading) return <p>Loading...</p>;
          if (error) return <p>Error :</p>;
          if (data.product === null) return <p>Null product for reference number</p>;

          return (
            <ul>
            <p><li key={data.product.partNumber}><b>NAME:</b>{data.product.name}</li></p>
            <p><li><b>TYPE: </b>{data.product.type}</li></p>
            <p><li><b>NORMAL_PRICE: </b>{data.product.normalPrice}</li></p>
            <p><li><b>SECOND_PRICE: </b>{data.product.secondPrice}</li></p>
            <p><li><b>FAMILY_START_DATE: </b>{data.product.familyPrice_startDate}</li></p>
            <p><li><b>FAMILY_END_DATE: </b>{data.product.familyPrice_endDate}</li></p>
            <p><li><b>FAMILY_DISCLAIMER: </b>{data.product.familyPrice_disclaimer}</li></p>
            </ul>
          );
        }}  

        </Query>
        

      </div>
      </ApolloProvider>
    );
  }
}

export default App;
