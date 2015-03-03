React Time Sheet
=================

Time Sheet Component for React. Modified from [timesheet.js](https://github.com/sbstjn/timesheet.js)

## Demo & Examples

Live demo: [yuanyan.github.io/react-timesheet](http://yuanyan.github.io/react-timesheet/)

To build the examples locally, run:

```
npm install
gulp dev
```

Then open [`localhost:9999`](http://localhost:9999) in a browser.

## Installation

The easiest way to use `react-timesheet` is to install it from NPM and include it in your own React build process (using [Browserify](http://browserify.org), etc).

You can also use the standalone build by including `dist/react-timesheet.js` in your page. If you use this, make sure you have already included React, and it is available as a global variable.

```
npm install react-timesheet --save
```

## Usage

```
var React = require('react');
var TimeSheet = require('react-timesheet');
var Example1 = React.createClass({
    data: [
        ['2002', '09/2002', 'A freaking awesome time', 'lorem'],
        ['06/2002', '09/2003', 'Some great memories', 'ipsum'],
        ['2003', 'Had very bad luck'],
        ['10/2003', '2006', 'At least had fun', 'dolor'],
        ['02/2005', '05/2006', 'Enjoyed those times as well', 'ipsum'],
        ['07/2005', '09/2005', 'Bad luck again', 'default'],
        ['10/2005', '2008', 'For a long time nothing happened', 'dolor'],
        ['01/2008', '05/2009', 'LOST Season #4', 'lorem'],
        ['01/2009', '05/2009', 'LOST Season #4', 'lorem'],
        ['02/2010', '05/2010', 'LOST Season #5', 'lorem'],
        ['09/2008', '06/2010', 'FRINGE #1 & #2', 'ipsum']
    ],
    render: function() {
        return (
            <TimeSheet data={this.data}/>
        );
    }
});
```

## Properties

* `data`: Your configure data.
* `min`: Min year value.
* `max`: Max year data.
* `theme`: Custom theme name.
