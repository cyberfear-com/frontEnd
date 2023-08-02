define(["react", "app", "accounting"], function (React, app, accounting) {
    return React.createClass({
        getInitialState: function () {
            return {
                moveFolderMain: [],
                moveFolderCust: [],
                checkNewMails: false,
                trashStatus: false,
                spamStatus: false,
                blackList: false,
                pastDue: false,
                balanceShort: false,
                hidden: true
            };
        },

        change: function (event) {
            console.log(event.target.value);
            // $("#emailListTable")
            //     .DataTable()
            //     .column(0)
            //     .search(event.target.value, 0, 1)
            //     .draw();
        },

        getCustomFolderList: function () {
            var folderList = app.globalF.getCustomFolderList();
            var thisComp = this;

            var options = [];
            $.each(folderList, function (index, folderData) {
                options.push(React.createElement(
                    "li",
                    { key: index },
                    React.createElement(
                        "a",
                        {
                            id: folderData["index"],
                            onClick: thisComp.handleChange.bind(thisComp, "moveToFolder")
                        },
                        folderData["name"]
                    )
                ));
            });
            this.setState({
                moveFolderCust: options
            });
        },

        componentDidMount: function () {
            this.getCustomFolderList();
        },

        render: function () {
            return React.createElement(
                "div",
                { className: "desktop-search" },
                React.createElement("input", {
                    type: "search",
                    placeholder: "Search...",
                    onChange: this.change.bind(this)
                })
            );
        }
    });
});