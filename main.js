// shorthand used in window resize code
var w = window,
    d = document,
    b = d.getElementsByTagName('body')[0],
    e = d.documentElement,
    forumData = {},
    // map state/province abbreviations to full names
    abbr = {
        "CA-AB": "Alberta",
        "CA-BC": "British Columbia",
        "CA-MB": "Manitoba",
        "CA-NB": "New Brunswick",
        "CA-NL": "Newfoundland and Labrador",
        "CA-NT": "Northwest Territories",
        "CA-NS": "Nova Scotia",
        "CA-NU": "Nunavut",
        "CA-ON": "Ontario",
        "CA-PE": "Prince Edward Island",
        "CA-QC": "Quebec",
        "CA-SK": "Saskatchewan",
        "CA-YT": "Yukon",
        "US-AL": "Alabama",
        "US-AK": "Alaska",
        "US-AZ": "Arizona",
        "US-AR": "Arkansas",
        "US-CA": "California",
        "US-CO": "Colorado",
        "US-CT": "Connecticut",
        "US-DE": "Delaware",
        "US-DC": "District of Columbia",
        "US-FL": "Florida",
        "US-GA": "Georgia",
        "US-HI": "Hawaii",
        "US-ID": "Idaho",
        "US-IL": "Illinois",
        "US-IN": "Indiana",
        "US-IA": "Iowa",
        "US-KS": "Kansas",
        "US-KY": "Kentucky",
        "US-LA": "Louisiana",
        "US-ME": "Maine",
        "US-MD": "Maryland",
        "US-MA": "Massachusetts",
        "US-MI": "Michigan",
        "US-MN": "Minnesota",
        "US-MS": "Mississippi",
        "US-MO": "Missouri",
        "US-MT": "Montana",
        "US-NE": "Nebraska",
        "US-NV": "Nevada",
        "US-NH": "New Hampshire",
        "US-NJ": "New Jersey",
        "US-NM": "New Mexico",
        "US-NY": "New York",
        "US-NC": "North Carolina",
        "US-ND": "North Dakota",
        "US-OH": "Ohio",
        "US-OK": "Oklahoma",
        "US-OR": "Oregon",
        "US-PA": "Pennsylvania",
        "US-RI": "Rhode Island",
        "US-SC": "South Carolina",
        "US-SD": "South Dakota",
        "US-TN": "Tennessee",
        "US-TX": "Texas",
        "US-UT": "Utah",
        "US-VT": "Vermont",
        "US-VA": "Virginia",
        "US-WA": "Washington",
        "US-WV": "West Virginia",
        "US-WI": "Wisconsin",
        "US-WY": "Wyoming"
    },
    // load data
    handleJSON = function (err, json) {
        if (err) {
            console.log(err);
            return false;
        } else {
            forumData = json;
            visualize();
        }
    },
    // given state DOM el, return associated datum
    getStateDatum = function (el) {
        var state = el.id;
        if (forumData[state]) {
            return forumData[state];
        } else {
            // default to 0
            return 0;
        }
    },
    // iterate over object's properties & return highest number
    // depends on d3.max()
    max4obj = function (obj) {
        var nums = [], prop;
        for (prop in obj) {
            if (obj.hasOwnProperty(prop) && typeof obj[prop] === 'number') {
                nums.push(obj[prop]);
            }
        }
        return d3.max(nums);
    },
    // run viz steps once we have data
    visualize = function () {
        // transparency scale from the data
        var alpha = d3.scale.linear().domain([0, max4obj(forumData)]).range([0.3, 1]),
            tooltip = d3.select('.tooltip');

        // fill in states & provinces
        // use data to determine alpha value of rgba
        d3.selectAll('#USA > [id], #Canada > [id]').attr('fill',
            function (datum, index){
                var attendees = getStateDatum(this);
                // this = current DOM element
                if (attendees === 0) {
                    return '#ddd';
                } else {
                    return 'rgba(256,0,0,' +
                        alpha(attendees) +
                        ')';
                }
        // add tooltips on hover
        }).on('mousemove', function () {
            var target = this,
                event = d3.event;

            // show tooltip, base position on mouse's coords
            tooltip.classed('hidden', false)
                .attr('style', function () {
                    var left = 'left:',
                        top = 'top:';

                    // numbers below are guesses that look OK
                    // could be adjusted
                    left += (event.x + 15) + 'px;';
                    top += (event.y - 50) + 'px;';

                    return left + top;
                // set text of tooltip to "State - # of Attendees"
                }).text( function () {
                    return abbr[target.id] + ' - ' + getStateDatum(target);
                });
        }).on('mouseleave', function () {
            // hide tooltip when mouse isn't over a state/province
            tooltip.classed('hidden', true);
        });
    },
    // set SVG canvas based upon whichever constraint is greatest
    fitScreen = function () {
        var width = d.innerWidth || e.clientWidth || b.clientWidth,
            height = w.innerHeight|| e.clientHeight|| g.clientHeight;
        if ( width < height ) {
            d3.select('#map').attr('width', width).attr('height', width);
        } else {
            d3.select('#map').attr('width', height).attr('height', height);
        }
    },
    init = function () {
        d3.json('data/2014.json', handleJSON);
        fitScreen();
        // if user adjusts screen, resize map
        d3.select(window).on('resize', fitScreen);
    };

// this kicks everything off
init();
