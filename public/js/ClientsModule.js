Ext.require([
    'Ext.grid.*',
    'Ext.data.*',
    'Ext.panel.*',
    'Ext.util.*',
    'Ext.layout.container.Border'
]);

Ext.onReady(function(){

    var form = new Ext.form.FormPanel({
        region		: "north",
        width       : 400,
	    bodyStyle	: "padding: 10px;",
	    url		    : "serverside/updateContact.php",
	    margins		: "3 3 3 3",
	    border		: false,
	    defaults	: {allowBlank: false},
	    items		: [
            {xtype : "textfield", name : "id", hidden: true, allowBlank:true},
			{xtype : "textfield", name : "identification", fieldLabel : "Identification"},
			{xtype : "textfield", name : "name", fieldLabel : "Name"},
			{
                xtype       : "fieldcontainer",
                name        : "type",
                fieldLabel  : "Type",
                defaultType : 'radiofield',
                defaults    : {flex: 1},
                layout      : 'hbox',
                items       : [
                    {
                        boxLabel  : 'Client',
                        name      : 'type',
                        inputValue: 'client',
                        id        : 'radio1'
                    }, {
                        boxLabel  : 'Provider',
                        name      : 'type',
                        inputValue: 'provider',
                        id        : 'radio2'
                    }
                ]
            },
            {xtype : "textfield", name : "email", fieldLabel : "E-mail", vtype :"email"},
            {xtype : "textfield", name : "phonePrimary", fieldLabel : "Primary Phone", regexp: '/\d/i', invalidText: 'Not a valid value.'},
            {xtype : "textfield", name : 'phoneSecondary', fieldLabel : "Secondary Phone", allowBlank:true, regexp: '/\d/i', invalidText: 'Not a valid value.'},
            {xtype : "textfield", name : 'fax', fieldLabel : "Fax", allowBlank:true, regexp: '/\d/i', invalidText: 'Not a valid value.'},
            {xtype : "textfield", name : 'mobile', fieldLabel : "Mobile", allowBlank:true, regexp: '/\d/i', invalidText: 'Not a valid value.'},
            {xtype : "textareafield", name : 'address', fieldLabel : 'Address'},
            {xtype : "textareafield", name : 'observations', fieldLabel : 'Observations', allowBlank:true},
		],
	    fbar		: [
            {
                text        : "save",
                scope       : this,
                handler     : function() {
                    if (!form.isValid()) {
                        Ext.Msg.alert("Error","Campos Incorrectos!!!");
                        return false;
                    }
                    let rec = form.getRecord();
                    if (rec) {
                        form.updateRecord(rec);
                    } else {
                        let contact = Ext.create('Client',{
			                identification	: form.getForm().getValues().identification,
			                name	        : form.getForm().getValues().name,
			                type	        : form.getForm().getValues().type,
			                email	        : form.getForm().getValues().email,
                            phonePrimary	: form.getForm().getValues().phonePrimary,
                            phoneSecondary	: form.getForm().getValues().phoneSecondary,
                            fax	            : form.getForm().getValues().fax,
                            mobile	        : form.getForm().getValues().mobile,
                            address	        : form.getForm().getValues().address,
                            observations	: form.getForm().getValues().observations,
		                });
                        store.insert(0,contact);
                        store.reload();
                    }
                    form.reset(true);
                    win.hide();
                }
            }
        ],
    });

    var win = Ext.create('Ext.window.Window',{
        title       : 'Client',
        width       : 400,
        modal       : true,
        closeAction : 'method-hide',
        items       : [form]
    });

    var proxy = Ext.create('Ext.data.proxy.Ajax',{
        api     : {
            read 	: "search",
            create 	: "save",
            update	: "save",
            destroy	: "delete"
        },
        reader  : {
            type            : 'json',
            totalProperty   : 'total',
            rootProperty    : 'items',
        },
        writer  : {
            type            : 'json',
            writeAllFields  : true
        },
        filterParam: 'query'
    });

    Ext.define('Client',{
        extend      : 'Ext.data.Model',
        idProperty  : 'post_id',
        proxy       : proxy,
        fields: [
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

    var store = Ext.create('Ext.data.Store', {
        model   : 'Client',
        proxy   : proxy,
        remoteFilter: true,
        autoLoad: true,
        autoSave: true,
        autoSync: true
    });

    Ext.override(store.getProxy(), {
        applyEncoding   : function(a) {
            return a;
        }
    });

    var grid = Ext.create('Ext.grid.Panel', {
        store       : store,
        forceFit    : true,
        width       : 600,
        split       : true,
        region      : 'west',
        collapsible : true,
        remoteSort  : true,
        columns     : [
            {text: "Identification", width: 120, dataIndex: 'identification', sortable: true},
            {
                text        : "Name",
                flex        : 1,
                dataIndex   : 'name',
                sortable    : true,
                filter      : {
                    type        : 'string',
                    serializer  : function(filter) {
                        return filter.value;
                    }
                }
            },
            {text: "email", width: 125, dataIndex: 'email', sortable: true},
            {text: "Phone", width: 125, dataIndex: 'phonePrimary', sortable: true}
        ],
        tbar        : [
            {
                text    : "New",
                scope   : this,
                handler : function() {
                    form.reset(true);
                    win.show();
                },
                iconCls :'delete-icon'
            },
            {
                text    :"Update",
                scope   :this,
                handler : function() {
                    var rows = grid.getSelectionModel().getSelection();
                    if(rows.length === 0){
                        return false;
                    }
                    win.show();
                },
                iconCls :'delete-icon'
            },
			{
                text    :"Delete",
                scope   :this,
                handler : function() {
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
                                form.reset(true);
                            }	
                        }
                    );
                },
                iconCls :'delete-icon'
            }
		],
        stripeRows  : true,
        loadMask    : true,
        dockedItems : [{
            dock: 'top',
            xtype: 'toolbar',
            items: ['->', {
                xtype: 'component',
                itemId: 'status',
                tpl: 'Matching threads: {count}',
                style: 'margin-right:5px'
            }]
        }],
        plugins     : 'gridfilters',
    });
        
    var tplMarkup = [
        'Id: {id}<br/>',
        'Identification: {identification}<br/>',
        'Name: {name}<br/>',
        'Email: {email}<br/>',
        'Phone Primary: {phonePrimary}<br/>'
    ];
    var tpl = Ext.create('Ext.Template', tplMarkup);

    Ext.create('Ext.Panel', {
        renderTo    : 'binding-example',
        frame       : true,
        title       : 'Client List',
        width       : 1040,
        height      : 600,
        layout      : 'border',
        items       : [
            grid, 
            {
                id          : 'detailPanel',
                region      : 'center',
                bodyPadding : 7,
                bodyStyle   : "background: #ffffff;",
                html        : 'Please select a client to see additional details.'
            }
        ]
    });
    
    grid.getSelectionModel().on('selectionchange', function(sm, selectedRecord) {
        if (selectedRecord.length) {
            var detailPanel = Ext.getCmp('detailPanel');
            detailPanel.update(tpl.apply(selectedRecord[0].data));
            form.loadRecord(selectedRecord[0]);
        }
    });

    store.load();
});