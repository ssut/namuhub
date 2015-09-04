var ContribBox = React.createClass({
    handleLoad: function(user) {
        alert(user);
    },

    componentWillReceiveProps: function(props) {
        if(props.data !== null && props.data !== this.props.data) {
            window.cal = new CalHeatMap();
            $('#cal').html('');
            var startDate = new Date();
            startDate.setDate(startDate.getDate() - 365);
            var data = {};
            window.$.each(props.data, function(date, items) {
                date = +new Date(date) / 1000 | 0;
                data[date] = items.length;
            });
            window.cal.init({
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
                        $('#cal').css('width', $('#cal > svg').width());
                    }, 0);
                },
            });
        }
    },

    render: function() {
        return <div id="cal"></div>;
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

        var ps = window.history.pushState ? 1 : 0;
        [function(){location.replace(uri)},function(){window.history.pushState(null,null,uri)}][ps]();

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
