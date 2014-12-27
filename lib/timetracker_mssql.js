var Connection = require('tedious').Connection;
var Request = require('tedious').Request;

var config = {
    userName: "nodeuser",
    password: "node",
    server: 'localhost',
    options: {rowCollectionOnDone: true}

    // for azure, uncomment the below line or add option to existing options.
    // options: {encrypt: true}
};

var connStr = new Connection(config);

var WorkItem = function(){};
WorkItem.prototype.Id = "";
WorkItem.prototype.WorkItemId = "";
WorkItem.prototype.Hours = 0;
WorkItem.prototype.Date = "";
WorkItem.prototype.Archived = false;
WorkItem.prototype.Description = "";


function GetWorkItems(){
    var items = [];
    connStr.on('connect', function(err){
        if(err){console.log(err);}
        else {
            var request = new Request("select * from dbo.WorkItems", function(err, rowCount){
                if(err){console.log(err);}
                else{
                    console.log(rowCount + ' rows');
                    console.log(items);
                }
            });

            request.on('row', function(columns){
                var wi = new WorkItem();
                columns.forEach(function(column){
                    if(column.metadata.colName == "iId") wi.Id = column.value;
                    if(column.metadata.colName == "iWorkItemId") wi.WorkItemId = column.value;
                    if(column.metadata.colName == "fHours") wi.Hours = column.value;
                    if(column.metadata.colName == "tDate") wi.Date = new Date(column.value.getFullYear(), column.value.getMonth(), column.value.getDate()+1);
                    if(column.metadata.colName == "lArchived") wi.Archived = column.value;
                    if(column.metadata.colName == "cDescription") wi.Description = column.value;
                });
                items.push(wi);
            });

            // These are hear to make note that they exist, however "best practices" says dont listen to them.
            // instead, use the row event listener to collect rows, and the request object callback to consider things "done".
            // leaving this in here for documentation purposes.
            // At this time, I dont see this ever getting called.
            request.on('done', function(rowCount, more, rows){
                console.log('done getting rows.');
            });

            // this gets called on every iteration, however, rows is empty.
            // note that rowCount is undefined, more is undefined.
            // also note that I have not at this time test this with a stored proc. that may change things.
            request.on('doneProc', function(rowCount, more, rows){
                console.log('doneProc getting rows.');
            });

            // this gets called on every iteration, however, rows is only populated with options.rowCollectionOnDone = true for the config.
            // Also, more is always true, even when this is a single request, so not sure what its real value is.
            request.on('doneInProc', function(rowCount, more, rows){
                console.log('doneInProc getting rows.');
            });

            connStr.execSql(request);
        }
    });
}

exports.GetWorkItems = GetWorkItems;