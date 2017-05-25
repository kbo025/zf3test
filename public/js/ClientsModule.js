Ext.onReady(
    function () {
        console.log(Ext);
        Ext.Msg.show (
            {
                title: 'Mensaje',
                msg: 'Hola Mundo',
                buttons: Ext.MessageBox.OK,
                fn: function () {
                    console.log('funciona');
                },
                icon: Ext.MessageBox.QUESTION
            }
        );
        return;
    }
);