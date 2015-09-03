var ContribBox = React.createClass({
    render: function() {
        return <div />;
    }
});

var SearchBox = React.createClass({
    getInitialState: function () {
        console.log(this.props);
        return {
            user: this.props.user || ''
        };
    },

    submit: function(e) {
        var uri = '/' + this.state.user;
        e.preventDefault();

        var ps = window.history.pushState | 1 || 0;
        [function(){location.replace(uri)},function(){window.history.pushState(null,null,uri)}][ps]();
    },

    updateUser: function(e) {
        this.setState({
            user: e.target.value
        });
    },

    render: function() {
        return (
            <form className="ui" onSubmit={this.submit}>
                <div className="ui action center aligned input">
                    <input type="text" placeholder="나무위키 아이디 입력" defaultValue={this.props.user} onChange={this.updateUser} />
                    <button className="ui teal button">조회</button>
                </div>
            </form>
        );
    }
});
