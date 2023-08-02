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
                hidden: true,
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
                options.push(
                    <li key={index}>
                        <a
                            id={folderData["index"]}
                            onClick={thisComp.handleChange.bind(
                                thisComp,
                                "moveToFolder"
                            )}
                        >
                            {folderData["name"]}
                        </a>
                    </li>
                );
            });
            this.setState({
                moveFolderCust: options,
            });
        },

        componentDidMount: function () {
            this.getCustomFolderList();
        },

        render: function () {
            return (
                <div className="desktop-search">
                    <input
                        type="search"
                        placeholder="Search..."
                        onChange={this.change.bind(this)}
                    />
                </div>
            );
        },
    });
});
