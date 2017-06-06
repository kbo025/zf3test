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
			{xtype : "textfield", name : "identification", fieldLabel : "Identification", allowBlank:true},
			{xtype : "textfield", name : "name", fieldLabel : "Name"},
			{
                xtype       : "fieldcontainer",
                name        : "type",
                fieldLabel  : "Type",
                defaultType : 'checkboxfield',
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
            {xtype : "textfield", name : "email", fieldLabel : "E-mail", vtype :"email", allowBlank:true},
            {xtype : "textfield", name : "phonePrimary", fieldLabel : "Primary Phone", regexp: '/\d/i', invalidText: 'Not a valid value.', allowBlank:true},
            {xtype : "textfield", name : 'phoneSecondary', fieldLabel : "Secondary Phone", allowBlank:true, regexp: '/\d/i', invalidText: 'Not a valid value.'},
            {xtype : "textfield", name : 'fax', fieldLabel : "Fax", allowBlank:true, regexp: '/\d/i', invalidText: 'Not a valid value.'},
            {xtype : "textfield", name : 'mobile', fieldLabel : "Mobile", allowBlank:true, regexp: '/\d/i', invalidText: 'Not a valid value.'},
            {xtype : "textfield", name : 'city', fieldLabel : 'City', allowBlank:true},
            {xtype : "textareafield", name : 'dir', fieldLabel : 'Address', allowBlank:true},
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
                        rec.data.address.address = form.getForm().getValues().dir;
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
                            address	        : {
                                address : form.getForm().getValues().dir,
                                city    : form.getForm().getValues().city,
                            },
                            dir             : form.getForm().getValues().dir,
                            city            : form.getForm().getValues().city,
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
            {name: 'address', type: 'auto'},
            {name: 'city', type: 'string', mapping:'address.city'},
            {name: 'dir', type: 'string', mapping:'address.address'},
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
                text    :'<span class="glyphicon glyphicon-plus"></span>',
                scope   : this,
                handler : function() {
                    form.reset(true);
                    win.show();
                }
            },
            {
                text    :'<span class="glyphicon glyphicon-pencil"></span>',
                scope   :this,
                handler : function() {
                    var rows = grid.getSelectionModel().getSelection();
                    if(rows.length === 0){
                        return false;
                    }
                    win.show();
                }
            },
			{
                text    :'<span class="glyphicon glyphicon-remove"></span>',
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
                }
            }
		],
        bbar: Ext.create('Ext.PagingToolbar', {
            store: store,
            displayInfo: false,
            inputItemWidth: 35,
            items:[]
        }),
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
        '<div class="row"><div class="col-sm-6">Identification</div><div class="col-sm-6">{identification}</div></div>',
        '<div class="row"><div class="col-sm-6">Name</div><div class="col-sm-6">{name}</div></div>',
        '<div class="row"><div class="col-sm-6">Email</div><div class="col-sm-6">{email}</div></div>',
        '<div class="row"><div class="col-sm-6">Phone Primary</div><div class="col-sm-6">{phonePrimary}</div></div>',
        '<div class="row"><div class="col-sm-6">Phone Secondary</div><div class="col-sm-6">{phoneSecondary}</div></div>',
        '<div class="row"><div class="col-sm-6">Fax</div><div class="col-sm-6">{fax}</div></div>',
        '<div class="row"><div class="col-sm-6">Mobile</div><div class="col-sm-6">{mobile}</div></div>',
        '<div class="row"><div class="col-sm-6">type</div><div class="col-sm-6">{type}</div></div>',
        '<div class="row"><div class="col-sm-6">City</div><div class="col-sm-6">{city}</div></div>',
        '<div class="row"><div class="col-sm-6">Address</div><div class="col-sm-6">{dir}</div></div>',
        '<div class="row"><div class="col-sm-6">Observations</div><div class="col-sm-6">{observations}</div></div>',
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
            form.getForm().getValues().address = selectedRecord[0].data.dir
        }
    });

    store.load();
});