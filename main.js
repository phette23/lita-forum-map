// shorthand used in window resize code
var w = window,
    d = document,
    b = d.getElementsByTagName('body')[0],
    e = d.documentElement,
    forumData = {},
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
        // IDs on map are of form 'US-XX' or 'CA-XX'
        // so last 2 chars are state/province abbr
        var state = el.id.substr(3, 4);
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
        var alpha = d3.scale.linear().domain([0, max4obj(forumData)]).range([0.3, 1]);

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
        // add hover info
        }).append('title').text(
            function (datum) {
                return this.parentNode.id.substr(3, 4) +
                    ' - ' +
                    getStateDatum(this.parentNode);
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
        d3.json('2013data.json', handleJSON);
        fitScreen();
        // if user adjusts screen, resize map
        d3.select(window).on('resize', fitScreen);
    };

// this kicks everything off
init();
