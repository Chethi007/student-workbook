//  *******************************************************************************
//  * Copyright 2012-2015 by Aerospike.
//  *
//  * Permission is hereby granted, free of charge, to any person obtaining a copy
//  * of this software and associated documentation files (the "Software"), to
//  * deal in the Software without restriction, including without limitation the
//  * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
//  * sell copies of the Software, and to permit persons to whom the Software is
//  * furnished to do so, subject to the following conditions:
//  *
//  * The above copyright notice and this permission notice shall be included in
//  * all copies or substantial portions of the Software.
//  *
//  * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
//  * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
//  * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
//  * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
//  * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
//  * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
//  * IN THE SOFTWARE.

'use strict';

var aerospike = require('aerospike');
var inquirer = require('inquirer');
var user_service = require('./scripts/user_service');
var tweet_service = require('./scripts/tweet_service');

// Connect to the Aerospike Cluster

//Exercise K1, Exercise R2, Exercise Q3 & Exercise A2
var hostaddr = '127.0.0.1';
//Override with your AWS IP Address
hostaddr = "54.172.239.132" ;

// Note: Node.js client does not implement default modlua config for client node.
// This is needed when using stream udfs.

// Exercise A2
var client = aerospike.client({
    hosts: [ { addr: hostaddr, port: 3000 }],
    // TODO: modlua:{...
    //       }
}).connect( function(response) {
    // Check for errors
    // Exercise K1
    if ( response == null ) {
      // Connection succeeded
      console.log("Connection to the Aerospike cluster succeeded!");
    }
    else {
      // Connection failed
      console.log("Connection to the Aerospike cluster failed. Please check cluster IP and Port settings and try again.");
      process.exit(0);
    }
});

// Setup tear down
// Exercise K1
process.on('exit', function() {
  if (client != null) {
    client.close();
    console.log("Connection to Aerospike cluster closed!");
    aerospike.releaseEventLoop();
    console.log("Event loop released.");
  }
});

// Present Menu
var loopMenu = ()=>{
 inquirer.prompt([
  {
    type: "rawlist",
    name: "answer",
    message: "What would you like to do:",
    choices: [
      "Create A User",
      "Create A Tweet By A User",
      "Read A User Record",
      "Batch Read Tweets For A User",
      "Scan All Tweets For All Users",
      "Update User Password using CAS",
      "Update User Password using Record UDF",
      "Query Tweets By Username",
      "Query Users By Tweet Count Range",
      "Stream UDF -- Aggregation Based on Tweet Count By Region",
      "Create Sample Users And Tweets",
      "Exit"
    ]
  }
 ], function( answers ) {
  // console.log( answers.answer );
  switch (answers.answer) {
    case "Create A User":
      user_service.createUser(client, loopMenu);
      break;
    case "Create A Tweet By A User":
      tweet_service.createTweet(client, loopMenu);
      break;
    case "Read A User Record":
      user_service.getUser(client, loopMenu);
      break;
    case "Batch Read Tweets For A User":
      user_service.batchGetUserTweets(client, loopMenu);
      break;
    case "Scan All Tweets For All Users":
      tweet_service.scanAllTweetsForAllUsers(client, loopMenu);
      break;
    case "Update User Password using CAS":
      user_service.updatePasswordUsingCAS(client, loopMenu);
      break;
    case "Update User Password using Record UDF":
      user_service.updatePasswordUsingUDF(client, loopMenu);
      break;
    case "Query Tweets By Username":
      tweet_service.queryTweetsByUsername(client, loopMenu);
      break;
    case "Query Users By Tweet Count Range":
      tweet_service.queryUsersByTweetCount(client, loopMenu);
      break;
    case "Stream UDF -- Aggregation Based on Tweet Count By Region":
      tweet_service.aggregateUsersByTweetCountByRegion(client, loopMenu);
      break;
    case "Create Sample Users And Tweets":

      inquirer.prompt([
        {
          type: "rawlist",
          name: "answer",
          message: "What would you like to do:",
          choices: [
            "Create Sample Users",
            "Create Sample Tweets"
          ]
        }
      ], function( answers ) {

        switch (answers.answer) {
          case "Create Sample Users":
            user_service.createUsers(client, loopMenu);
            break;
          case "Create Sample Tweets":
            tweet_service.createTweets(client, loopMenu);
            break;
          default:
            break;
        }
      });

      break;
    case "Exit":
      process.exit(0);
      break;
    default:  //inquirer automatically takes care of this, we should never get here
      console.log("Invalid choice.");
      loopMenu();
      break;
  }
  //process.exit(0);  //done
 });
}
loopMenu();