Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.panel.*',
    'Ext.util.*',
    'Ext.layout.container.Border'
]);

Ext.onReady(function(){


    var win = Ext.create('Ext.window.Window',{
        title: 'Ventana con formulario',
        width: 400,
        height: 500,
        modal: true,
        items: []
    });

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
        model   : 'Client',
        //pageSize: 50,
        //leadingBufferZone: 1000,
        proxy   : {
            // load using HTTP
            type: 'ajax',
            api: {
                read 	: "testclients",
                create 	: "save",
                update	: "save",
                destroy	: "delete"
            },
            // the return will be XML, so lets set up a reader
            reader: {
                type: 'json',
                totalProperty  : 'total',
                rootProperty: 'items',
            },
            writer: {
                type: 'json',
                encode: true,
                writeAllFields: true
            }
            //simpleSortMode: true,
            //filterParam: 'query'
        },
        /*listeners: {
            totalcountchange: onStoreSizeChange
        },*/
        //remoteFilter: true,
        autoLoad: true,
        autoSave: true,
        autoSync: true
    });

    /*Ext.override(store.getProxy(), {
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
    }*/

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
        //height:210,
        width: 600,
        split: true,
        region: 'west',
        tbar: [
            {
                text: "New",
                scope: this,
                handler: function() {
                    win.show();
                    console.log('presionaste el boton de actualizar');
                },
                iconCls:'delete-icon'
            },
            {
                text:"Update",
                scope:this,
                handler: function() {
                    var rows = grid.getSelectionModel().getSelection();
                    if(rows.length === 0){
                        return false;
                    }
                    win.show();
                    console.log('presionaste el boton de actualizar');
                },
                iconCls:'delete-icon'
            },
			{
                text:"Delete",
                scope:this,
                handler: function() {
                    var rows = grid.getSelectionModel().getSelection();
                    if(rows.length === 0){
                        return false;
                    }
                    Ext.Msg.confirm(
                        'Confirmación',
                        '¿Desea Eliminar el cliente seleccionado?',
                        function(btn) {
                            if(btn === 'yes'){
                                store.remove(rows[0]);
                            }	
                        }
                    );
                },
                iconCls:'delete-icon'
            }
		],
        stripeRows: true
        //loadMask: true,
        /*dockedItems: [{
            dock: 'top',
            xtype: 'toolbar',
            items: ['->', {
                xtype: 'component',
                itemId: 'status',
                tpl: 'Matching threads: {count}',
                style: 'margin-right:5px'
            }]
        }],*/
        /*selModel: {
            pruneRemoved: false
        },*/
        //multiSelect: true,
        /*viewConfig: {
            trackOver: false,
            emptyText: '<h1 style="margin:20px">No matching results</h1>'
        },*/
        //plugins: 'gridfilters',
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
        width: 1040,
        height: 600,
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