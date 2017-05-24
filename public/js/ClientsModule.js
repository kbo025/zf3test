Ext.onReady(
    function () {
        Ext.Msj.show (
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