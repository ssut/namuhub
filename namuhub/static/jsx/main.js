window.alert = function(text) {
    $.notify(text, 'warn');
};
window.cal = new CalHeatMap();

var App = React.createClass({
    displayName: 'namuhub',

    getInitialState: function() {
        return {
            data: null,
            loading: false,
            user: window.user || '',
        };
    },

    load: function(user) {
        var self = this;
        this.setState({loading: true});

        $.ajax({
            url: '/',
            type: 'POST',
            timeout: 15000,
            data: {
                user: user
            },
            cache: false,
            success: function(data) {
                if($.isEmptyObject(data)) {
                    self.setState({loading: false});
                    $.notify('데이터를 불러오지 못했습니다.\n기여내역이 없는 경우에도 이 메시지가 표시됩니다.', 'error');
                    return;
                }

                self.setState({loading: false, data: data});
            },
            error: function(xhr, reason, message) {
                if(reason == 'timeout') {
                    self.setState({loading: false});
                    $.notify('서버가 바쁘다네요. 잠시 후 다시 시도해주세요.\n아니면 오류가 났을지도..', 'error');
                    return;
                }
            },
        });
    },

    render: function() {
        return (
            <div className="ui">
                <div className="ui center aligned header">
                    <SearchBox onSubmit={this.load} loading={this.state.loading} user={this.state.user} />
                </div>
                <div className="ui center aligned">
                    <ContribBox data={this.state.data} />
                </div>
            </div>
        );
    }
});

React.render(
    <App />,
    document.getElementById("container")
);
