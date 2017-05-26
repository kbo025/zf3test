Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.panel.*',
    'Ext.util.*',
    'Ext.grid.filters.Filters',
    'Ext.layout.container.Border'
]);

Ext.onReady(function(){
    Ext.define('Client',{
        extend: 'Ext.data.Model',
        proxy: {
            type: 'ajax',
            reader: 'json'
        },
        fields: [
            // set up the fields mapping into the xml doc
            // The first needs mapping, the others are very basic
            'id',
            'name',
            'identification',
            'email',
            'phonePrimary',
            'phoneSecondary',
            'fax',
            'mobile',
            'observations',
            'type',
            'address',
            'seller',
            'term',
            'priceList',
            'internalContacts'
        ]
    });

    // create the Data Store
    var store = Ext.create('Ext.data.Store', {
        model: 'Client',
        pageSize: 50,
        leadingBufferZone: 1000,
        proxy: {
            // load using HTTP
            type: 'ajax',
            url: 'testclients',
            // the return will be XML, so lets set up a reader
            reader: {
                rootProperty: 'items',
                totalProperty: 'total'
            },
            /*reader: {
                type: 'json',
                record: 'Item',
                totalProperty  : 'total'
            }*/
            simpleSortMode: true,
            filterParam: 'query'
        },
        listeners: {
            totalcountchange: onStoreSizeChange
        },
        remoteFilter: true,
        autoLoad: true
    });

    Ext.override(store.getProxy(), {
        applyEncoding: function(a) {
            return a;
        }
    });

    function onStoreSizeChange() {
        grid.down('#status').update({count: store.getTotalCount()});
    }

    function renderTopic(value, p, record) {
        return Ext.String.format(
            '<a href="http://sencha.com/forum/showthread.php?p={1}" target="_blank">{0}</a>',
            value,
            record.getId()
        );
    }

    // create the grid
    var grid = Ext.create('Ext.grid.Panel', {
        bufferedRenderer: false,
        store: store,
        columns: [
            {text: "Identification", width: 120, dataIndex: 'identification', sortable: true},
            {text: "Name", flex: 1, dataIndex: 'name', sortable: true},
            {text: "email", width: 125, dataIndex: 'email', sortable: true},
            {text: "Phone", width: 125, dataIndex: 'phonePrimary', sortable: true}
        ],
        forceFit: true,
        height:210,
        split: true,
        region: 'north',
        loadMask: true,
        dockedItems: [{
            dock: 'top',
            xtype: 'toolbar',
            items: ['->', {
                xtype: 'component',
                itemId: 'status',
                tpl: 'Matching threads: {count}',
                style: 'margin-right:5px'
            }]
        }],
        selModel: {
            pruneRemoved: false
        },
        multiSelect: true,
        viewConfig: {
            trackOver: false,
            emptyText: '<h1 style="margin:20px">No matching results</h1>'
        },
        plugins: 'gridfilters',
    });
        
    // define a template to use for the detail view
    var bookTplMarkup = [
        'Identification: {identification}<br/>',
        'Name: {name}<br/>',
        'Email: {email}<br/>',
        'Phone Primary: {phonePrimary}<br/>'
    ];
    var bookTpl = Ext.create('Ext.Template', bookTplMarkup);

    Ext.create('Ext.Panel', {
        renderTo: 'binding-example',
        frame: true,
        title: 'Client List',
        width: 580,
        height: 500,
        layout: 'border',
        items: [
            grid, {
                id: 'detailPanel',
                region: 'center',
                bodyPadding: 7,
                bodyStyle: "background: #ffffff;",
                html: 'Please select a book to see additional details.'
        }]
    });
    
    // update panel body on selection change
    grid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
        if (selectedRecord.length) {
            var detailPanel = Ext.getCmp('detailPanel');
            detailPanel.update(bookTpl.apply(selectedRecord[0].data));
        }
    });

    store.load();
});