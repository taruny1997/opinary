# Poll Widget (TypeeScript + JEST)
# Overview

This is a simple and reusable poll widget built using typescript. It allows users to vote on a question, stores their responses in local storage, and displays real-time results. Users are allowed to vote again after refreshing the page or by undo their previous vote. It is easy to embed on any HTML page without using iframes.

# Features

Configurable poll questions and answers

Saves votes locally using localStorage

Responsive design

Can be used on multiple pages with different questions, no duplicate polls

Displays real-time voting results

# Installation

No installation is required. Just include the JavaScript file in your HTML page.

Usage

1. Include the Script

Add the following script and styles to your HTML page:

```
<link href="style.css" rel="stylesheet" />
  
<script src="src/index.min.js" type="text/javascript"></script>
```

2. Add a Container for the Poll

In your HTML, create a div block with a unique id where the poll will be displayed
```
<div id="#widgetContainer"></div>
```

3. Initialize the Poll Widget

Add this script to your HTML file to configure the poll:

```
  <script>
   embedPoll("#widgetContainer",
             [{
                pollId: "poll1",
                pollQuestion: "What is your favorite programming language?",
                pollOptions: ["JavaScript", "Python", "Go", "Java"]
              }]
            );
  </script>
```

Configuration Options: Array of polls with below configurable options

pollId (string) - A unique identifier for the poll to manage votes separately.

pollQuestion (string) - The poll question to display.

pollOptions (array) - A list of possible answers.

# Changes
If modification made to the widget, run following commands:
<br/>To install all the dependencies
```
npm i
```

To convert the typescript code to mative javascript and minify the widget file
```
npm run build
```

# Running Tests

Unit tests is written using Jest.
To run tests:
```
npm test
```

# License

This project is licensed under the MIT License.

