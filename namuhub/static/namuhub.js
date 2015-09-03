var SearchBox = React.createClass({
    getInitialState: function() {
        return {
            user: this.props.user
        };
    },

    render: function() {
        return (
            <form className="ui">
                <div className="ui action center aligned input">
                    <input type="text" placeholder="나무위키 아이디 입력" value={this.state.user} />
                    <button className="ui teal button">조회</button>
                </div>
            </form>
        );
    }
});
