var React = require('react');

/**
 * Timesheet Bubble
 */
var Bubble = function(wMonth, min, start, end) {
    this.min = min;
    this.start = start;
    this.end = end;
    this.widthMonth = wMonth;
};

/**
 * Format month number
 */
Bubble.prototype.formatMonth = function(num) {
    num = parseInt(num, 10);

    return num >= 10 ? num : '0' + num;
};

/**
 * Calculate starting offset for bubble
 */
Bubble.prototype.getStartOffset = function() {
    return (this.widthMonth/12) * (12 * (this.start.getFullYear() - this.min) + this.start.getMonth());
};

/**
 * Get count of full years from start to end
 */
Bubble.prototype.getFullYears = function() {
    return ((this.end && this.end.getFullYear()) || this.start.getFullYear()) - this.start.getFullYear();
};

/**
 * Get count of all months in Timesheet Bubble
 */
Bubble.prototype.getMonths = function() {
    var fullYears = this.getFullYears();
    var months = 0;

    if (!this.end) {
        months += !this.start.hasMonth ? 12 : 1;
    } else {
        if (!this.end.hasMonth) {
            months += 12 - (this.start.hasMonth ? this.start.getMonth() : 0);
            months += 12 * (fullYears-1 > 0 ? fullYears-1 : 0);
        } else {
            months += this.end.getMonth() + 1;
            months += 12 - (this.start.hasMonth ? this.start.getMonth() : 0);
            months += 12 * (fullYears-1);
        }
    }

    return months;
};

/**
 * Get bubble's width in pixel
 */
Bubble.prototype.getWidth = function() {
    return (this.widthMonth/12) * this.getMonths();
};

/**
 * Get the bubble's label
 */
Bubble.prototype.getDateLabel = function() {
    return [
            (this.start.hasMonth ? this.formatMonth(this.start.getMonth() + 1) + '/' : '' ) + this.start.getFullYear(),
        (this.end ? '-' + ((this.end.hasMonth ? this.formatMonth(this.end.getMonth() + 1) + '/' : '' ) + this.end.getFullYear()) : '')
    ].join('');
};

/**
 * Parse data string
 */
function parseDate(date) {
    if (date.indexOf('/') === -1) {
        date = new Date(parseInt(date, 10), 0, 1);
        date.hasMonth = false;
    } else {
        date = date.split('/');
        date = new Date(parseInt(date[1], 10), parseInt(date[0], 10)-1, 1);
        date.hasMonth = true;
    }

    return date;
};


var TimeSheet = React.createClass({
    propTypes: {
        data: React.PropTypes.array.isRequired,
        min: React.PropTypes.number,
        max: React.PropTypes.number,
        theme: React.PropTypes.string
    },

    getDefaultProps: function(){
        return {
            className: 'timesheet'
        }
    },

    parse: function(data, min, max) {
        var ret = [];

        for (var n = 0, m = data.length; n<m; n++) {
            var beg = parseDate(data[n][0]);
            var end = data[n].length === 4 ? parseDate(data[n][1]) : null;
            var lbl = data[n].length === 4 ? data[n][2] : data[n][1];
            var cat = data[n][3] || 'default';

            if(!min){
                min = beg.getFullYear();
                max = min;
            }

            if (beg.getFullYear() < min) {
                min = beg.getFullYear();
            }

            if (end && end.getFullYear() > max) {
                max = end.getFullYear();
            } else if (beg.getFullYear() > max) {
                max = beg.getFullYear();
            }

            ret.push({start: beg, end: end, label: lbl, type: cat});
        }

        return {
            data: ret,
            year: {
                min: min,
                max: max
            }
        };
    },

    componentDidMount: function() {
        var widthMonth = this.refs.year.getDOMNode().offsetWidth;

        this.setState({
            widthMonth: widthMonth
        });
    },

    getLists: function(data, year){

        var lists = [];
        var widthMonth = this.state && this.state.widthMonth;
        if(!widthMonth) return lists;

        for (var i = 0, l = data.length; i < l; i++) {
            var cur = data[i];
            var bubble = new Bubble(widthMonth, year.min, cur.start, cur.end);

            var style = {
                marginLeft: bubble.getStartOffset() + 'px',
                width: bubble.getWidth() + 'px'
            };

            var className = 'bubble bubble-' + (cur.type || 'default');
            var duration = cur.end ? Math.round((cur.end-cur.start)/1000/60/60/24/39) : '';
            var date = bubble.getDateLabel();
            var label = cur.label;

            var line = [
                <span style={style} className={className} data-duration={duration}></span>,
                <span className="date">{date}</span>,
                <span className="label">{label}</span>
            ];

            lists.push(<li>{line}</li>);
        }

        return lists;
    },

    render: function() {

        var result = this.parse(this.props.data, this.props.min, this.props.max);
        var data = result.data;
        var year = result.year;

        var sections = [];
        for (var c = year.min; c <= year.max; c++) {
            sections.push(<section ref="year">{c}</section>);
        }

        var lists = this.getLists(data, year);
        var className = this.props.className + " " + (this.props.theme || '');

        return (
            <div className={className}>
                <div className="scale">
                    {sections}
                </div>
                <ul className="data">
                    {lists}
                </ul>
            </div>
        );
    }
});

module.exports = TimeSheet;
