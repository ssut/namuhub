var ContribBox = React.createClass({
    getInitialState: function() {
        return {
            loaded: false,
            totalContribs: 0,
            yearContribs: 0,
            monthContribs: 0,
        };
    },

    componentWillReceiveProps: function(props) {
        if(props.data !== null && props.data !== this.props.data) {
            // set state
            var self = this;
            this.setState({loaded: false});

            // start date (365 days ago)
            // first day of month
            var startDate = new Date(), firstDay = new Date();
            startDate.setDate(startDate.getDate() - 365);
            firstDay.setDate(1);

            // group items to calculate statistics
            var merged = $.map(props.data, function(obj) {return obj});
            // calculate and apply
            this.setState({
                totalContribs: merged.length,
                yearContribs: $(merged).filter(function(_, obj) {
                    return obj.when > +startDate;
                }).length,
                monthContribs: $(merged).filter(function(_, obj) {
                    return obj.when > +firstDay;
                }).length,
            });

            // clear existing calendar
            cal = new CalHeatMap();
            $('#cal').html('');

            // re-arrange data
            var data = {};
            $.each(props.data, function(date, items) {
                date = +new Date(date) / 1000 | 0;
                data[date] = items.length;
            });

            // draw calendar
            cal.init({
                itemSelector: '#cal',
                domain: 'month',
                subDomain: 'day',
                range: 12,
                start: startDate,
                data: data,
                tooltip: true,
                legendHorizontalPosition: 'left',
                onComplete: function() {
                    setTimeout(function() {
                        $('#contrib, #cal').css('width', $('#cal > svg').width());
                        self.setState({loaded: true});
                    }, 0);
                },
            });
        }
    },

    render: function() {
        var contribClassString = 'ui center';
        if(!this.state.loaded) {
            contribClassString += ' hide';
        }

        return (
            <div id="contrib" className={contribClassString}>
                <div id="cal"></div>
                <div className="ui divider"></div>
                총 기여 <span>{this.state.totalContribs}</span>
                올해 기여 <span>{this.state.yearContribs}</span>
                이번달 기여 <span>{this.state.monthContribs}</span>
            </div>
        );
    }
});

var SearchBox = React.createClass({
    getInitialState: function() {
        return {
            user: this.props.user || ''  
        };
    },

    submit: function(e) {
        var uri = '/' + this.state.user;
        e.preventDefault();

        if(this.props.loading) {
            alert('이미 불러오는 중입니다.');
            return;
        }

        var ps = history.pushState ? 1 : 0;
        [function(){location.replace(uri)},function(){history.pushState(null,null,uri)}][ps]();

        this.props.onSubmit(this.state.user);
    },

    updateUser: function(e) {
        this.setState({
            user: e.target.value
        });
    },

    componentDidMount: function() {
        if(this.state.user) {
            this.props.onSubmit(this.state.user);
        }
    },

    render: function() {
        var btnClassString = 'ui teal button ';
        if(this.props.loading) {
            btnClassString += 'loading';
        }

        return (
            <form className="ui" onSubmit={this.submit}>
                <div className="ui action center aligned input">
                    <input type="text" disabled={this.props.loading} placeholder="나무위키 아이디 입력" defaultValue={this.props.user} onChange={this.updateUser} />
                    <button className={btnClassString}>조회</button>
                </div>
            </form>
        );
    }
});
