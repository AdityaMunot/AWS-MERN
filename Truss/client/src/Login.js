import React, { Component } from 'react';
import AWS from 'aws-sdk';
import * as AmazonCognitoIdentity from 'amazon-cognito-identity-js';
import './Login.css';

class App extends Component {

  state = {
    loggedIn: false,
    userId: '',
    loading: false,
  }

  authenticateUser = (e) => {
    e.preventDefault();

    let username = e.target.username.value;
    let password = e.target.password.value;

    if(!username) {
      this.setState({
        loading: false,
        error: 'Please enter username.',
      })
      return;
    } else if(!password) {
      this.setState({
        loading: false,
        error: 'Please enter password.',
      })
      return;
    }

    this.setState({
      loading: true,
      error: '',
      username: username
    })

    let authenticationData = {
        Username : username,
        Password : password,
    };
    let authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails(authenticationData);
    // console.log(authenticationDetails, "autDea")
    let poolData = {
        UserPoolId : USER_POOL_ID, // Your user pool id here
        ClientId : CLIENT_ID, // Your client id here
    };
    let userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
    // console.log(userPool, "userPool")
    let userData = {
        Username : username,
        Pool : userPool
    };
    let cognitoUser = new AmazonCognitoIdentity.CognitoUser(userData);

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: (result) => {
            var accessToken = result.getIdToken().getJwtToken();
            console.log(result, "result")
            //POTENTIAL: Region needs to be set if not already set previously elsewhere.
            AWS.config.region = POOL_REGION;

            AWS.config.credentials = new AWS.CognitoIdentityCredentials({
                IdentityPoolId : `${AWS.config.region}:${IDENTITY_POOL_ID}`, // your identity pool id here
                Logins : {
                    // Change the key below according to the specific region your user pool is in.
                    [`cognito-idp.${AWS.config.region}.amazonaws.com/${USER_POOL_ID}`] : accessToken
                }
            });

            //refreshes credentials using AWS.CognitoIdentity.getCredentialsForIdentity()
            AWS.config.credentials.refresh((error) => {
                if (error) {
                    console.error(error);
                } else {
                    // Instantiate aws sdk service objects now that the credentials have been updated.
                    // example: var s3 = new AWS.S3();
                    console.log('Successfully logged in!');
                }
            });
            this.setState({
              loading: false,
              loggedIn: true,
            });
        },

        onFailure: (err) => {
          this.setState({
            loading: false,
            error: err.message
          })
          // alert(err.message || JSON.stringify(err));
        },
    });
  }


  render() {
    const { username, loggedIn, loading, error} = this.state;

    return (
      <div className="App" style={{ backgroundImage: './bg.jpg' }}>
        {
          !loggedIn ?
          (
            <div className="form-box">
              <form onSubmit={this.authenticateUser}>
                <div className="form-head">
                  Login
                </div>

                <div className="input-div">
                  <input placeholder="Username" type="text" name="username" />
                </div>
                <div className="input-div">
                  <input placeholder="Password" type="password" name="password" />
                </div>
                <div className="other-links">
                  <div className="link">
                    Forgot password?
                  </div>
                  <div className="link">
                    Register here
                  </div>
                </div>
                {
                  error ?
                  <span className="error-message"> {error} </span>
                  : undefined
                }
                {
                  loading ?
                  <button className="button disabled">  <div className="loader"/> </button> 
                  : <button className="button" type="submit"> <div> Log In </div> </button>
                }
                
              </form>
            </div>
          ) : (
            <div className="dashboard">
              Dashboard Page of {username}
            </div>
          )
        }
      </div>
    );
  }
}

export default App;
