
// widget configuration
let config = 
{
	layout: 
	{
		name: 'layout',
		padding: 0,
		panels: [
			{	type: 'right', size: 270, resizable: true, minSize: 120,
				style: 'margin-top:33px;'
			},
			{	type: 'main', size: 250, minSize: 120,
				style: 'margin-top:33px;'
			},
            {	type: 'left', size: 360, resizable: true, minSize: 120, overflow: 'hidden', 
				tabs:
				{
					name:'tabsDB',
					active: 'IndexedDB',
					tabs: [
						{ id: 'IndexedDB', text: 'IndexedDB' },
						{ id: 'localForage', text: 'localForage' }						
					],
					onClick(event) {
						event.onComplete = function()
						{
							w2ui.layout.get('left').tabs.active = event.tab.id;
							
							if( event.tab.text == 'IndexedDB' )
							{
								w2ui.layout.html('left', w2ui.gridIDB);
								showDB('gridIDB');
							}
							else if( event.tab.text == 'localForage' )
							{
								w2ui.layout.html('left', w2ui.gridForage);
								showDB('gridForage');
							}
						}
					}
				}
			}
        ]
    },    
    grid1: 
	{
		name: 'gridIDB',
        show: {
			header:true,
			toolbar: true,
			toolbarReload : false,
			toolbarColumns : false,
			toolbarSearch: false,
			searchAll: false,
            toolbarInput: false,
			selectColumn: true
        },
		toolbar:
		{
			name: 'gridIDBToolbar',
			items: [
				{ type: 'button',  id: 'itemAdddDB',  text: 'Add', img: 'iconAddDB' },
				{ type: 'button',  id: 'itemDeleteDB',  text: 'Delete', img: 'iconDeleteDB', disabled:true },
				{ type: 'button',  id: 'itemLoadDB',  text: 'Import', img: 'iconImportDB' },
				{ type: 'button',  id: 'itemSaveDB',  text: 'Export', img: 'iconExportDB', disabled:true },
				{ type: 'button',  id: 'itemSaveAsDB',  text: 'Save As', img: 'iconEditDB', disabled:true }	
			],
			onClick: function (event) 
			{
				event.onComplete = function()
				{
					if( event.item.text == "Add" )
					{
						ShowAddIDBDialog();
					}
					else if( event.item.text == "Delete" )
					{
						ShowDelDBDialog( 'Delete IndexedDB' );						
					}
					else if( event.item.text == "Import" )
					{
						ShowImportDBDialog("Import DB");
					}
					else if( event.item.text == "Export" )
					{
						var selected = w2ui['gridIDB'].getSelection();
							
						for(var j=0; j<selected.length; j++)
						{
							var DBName = DBTools.ArrayOfIndexedDBObject[selected[j]].name;
							exportDB(DBName);							
						}						
					}
					else if( event.item.text == "Save As" )
					{
						showDBSaveAsDialog(DBTools.curDBSelected);
					}
				}	
			}
		},		
        sortData: [ { field: 'name', direction: 'asc' } ],
        columns: [
            { field: 'recid', text: 'recID', size: '30px', sortable: true, hidden: true },
			{ field: 'name', text: 'Name', size: '30%', sortable: true },
			{ field: 'version', text: '<div style="text-align: center;">Version</div>', size: '10%', style: 'text-align: center' }			
        ],
		onSelect: function (event)
		{
			event.onComplete = function()
			{
				if( event.all && event.all === true )		// Click sur header checkbox pour selectionner toutes les rangées.
				{
					toolBarEnable('gridIDB', [3]);
					toolBarDisable('gridIDB', [0, 1, 2, 4]);
					toolBarDisable('gridObjectStore', [0, 1, 2, 3]);
					toolBarDisable('gridIndex', [0, 1, 2, 3]);
					w2ui['gridObjectStore'].clear();
					w2ui['gridIndex'].clear();	
				}
				else if( event.column && event.column === null && event.recid !== '-none-' )
				{
					gridEventsOnSelectCB('gridIDB', event);
				}
				else if( event.column && event.column >= 1 && event.recid !== '-none-' )
				{
					gridEventsOnSelectRow('gridIDB', event);	
				}
				else
				{
					if( w2ui['gridIDB'].getSelection().length > 1 )
					{
						toolBarEnable('gridIDB', [3]);
						toolBarDisable('gridIDB', [0, 1, 2, 4]);	
					}
				}
			}
		},
		onUnselect: function (event)
		{
			event.onComplete = function()
			{	
				if( event.all && event.all === true )		// Click sur header checkbox pour déselectionner toutes les rangées.
				{
					toolBarEnable('gridIDB', [0, 2]);
					toolBarDisable('gridIDB', [1, 3, 4]);	
				}
				else
				{
					if( w2ui['gridIDB'].getSelection().length === 0 )
					{
						toolBarEnable('gridIDB', [0, 2]);
						toolBarDisable('gridIDB', [1, 3, 4]);
						toolBarDisable('gridObjectStore', [0, 1, 2, 3]);
						toolBarDisable('gridIndex', [0, 1, 2, 3]);
						w2ui['gridObjectStore'].clear();
						w2ui['gridIndex'].clear();	
					}
					else if( w2ui['gridIDB'].getSelection().length === 1 )
					{
						toolBarEnable('gridIDB', [1, 4]);
						toolBarDisable('gridIDB', [0, 2, 3]);	
					}					
				}
			}
		}		
    },	
	grid2: 
	{
        name: 'gridForage',
        show: {
			header:true,
			toolbar: true,
			toolbarReload : false,
			toolbarColumns : false,
			toolbarSearch: false,
			searchAll: false,
            toolbarInput: false,
			selectColumn: true
        },
		toolbar:
		{
			name: 'gridForageToolbar',
			items: [
				{ type: 'button',  id: 'itemAdddDB',  text: 'Add', img: 'iconAddDB' },
				{ type: 'button',  id: 'itemDeleteDB',  text: 'Delete', img: 'iconDeleteDB', disabled:true },
				{ type: 'button',  id: 'itemLoadDB',  text: 'Import', img: 'iconImportDB' },
				{ type: 'button',  id: 'itemSaveDB',  text: 'Export', img: 'iconExportDB', disabled:true },
				{ type: 'button',  id: 'itemSaveAsDB',  text: 'Save As', img: 'iconEditDB', disabled:true }
			],
			onClick: function (event) 
			{
				event.onComplete = function()
				{
					if( event.item.text == "Add" )
					{
						ShowAddForageDialog();
					}
					else if( event.item.text == "Delete" )
					{
						ShowDelDBDialog( 'Delete localForage' );						
					}
					else if( event.item.text == "Import" )
					{
						ShowImportDBDialog("Import DB");						
					}
					else if( event.item.text == "Export" )
					{
						var selected = w2ui['gridForage'].getSelection();
						
						for(var j=0; j<selected.length; j++)
						{
							var DBName = DBTools.ArrayOfLocalForageObject[selected[j]].name;
							exportDB(DBName);							
						}							
					}					
					else if( event.item.text == "Save As" )
					{
						showDBSaveAsDialog(DBTools.curDBSelected);
					}
				}	
			}
		},
        sortData: [ { field: 'name', direction: 'asc' } ],
        columns: [
            { field: 'recid', text: 'recID', size: '60px', sortable: true, hidden: true },				
			{ field: 'name', text: 'Name', size: '30%', sortable: true },
            { field: 'version', text: '<div style="text-align: center;">Version</div>', size: '20%', style: 'text-align: center' }			
        ],
		onSelect: function (event)
		{
			event.onComplete = function()
			{
				if( event.all && event.all === true )
				{
					toolBarEnable('gridForage', [3]);
					toolBarDisable('gridForage', [0, 1, 2, 4]);
					toolBarDisable('gridObjectStore', [0, 1, 2, 3]);
					toolBarDisable('gridIndex', [0, 1, 2, 3]);
					w2ui['gridObjectStore'].clear();
					w2ui['gridIndex'].clear();	
				}
				else if( event.column && event.column === null && event.recid !== '-none-' )
				{
					gridEventsOnSelectCB('gridForage', event);
				}
				else if( event.column && event.column >= 1 && event.recid !== '-none-' )
				{
					gridEventsOnSelectRow('gridForage', event);	
				}
				else
				{
					if( w2ui['gridForage'].getSelection().length > 1 )
					{
						toolBarEnable('gridForage', [3]);
						toolBarDisable('gridForage', [0, 1, 2, 4]);	
					}
				}
			}
		},
		onUnselect: function (event)
		{
			event.onComplete = function()
			{	
				if( event.all && event.all === true )
				{
					toolBarEnable('gridForage', [0, 2]);
					toolBarDisable('gridForage', [1, 3, 4]);	
				}
				else
				{
					if( w2ui['gridForage'].getSelection().length === 0 )
					{
						toolBarEnable('gridForage', [0, 2]);
						toolBarDisable('gridForage', [1, 3, 4]);
						toolBarDisable('gridObjectStore', [0, 1, 2, 3]);
						w2ui['gridObjectStore'].clear();
					}
					else if( w2ui['gridForage'].getSelection().length === 1 )
					{
						toolBarEnable('gridForage', [1, 4]);
						toolBarDisable('gridForage', [0, 2, 3]);	
					}					
				}				
			}
		}		
    },	
	grid3: 
	{
        name: 'gridObjectStore',
        show: {
			header:true,
			toolbar: true,
			toolbarEdit: true,
			toolbarReload : false,
			toolbarColumns : false,
			toolbarAdd: true,
			toolbarDelete: true,
			toolbarSearch: false,
			searchAll: false,
            toolbarInput: false			
        },
		multiSelect: false,
		toolbar:
		{
			name: 'gridObjectStoreToolbar',
			items: [
				{ type: 'button',  id: 'itemRename',  text: 'Rename', img: 'iconRename', disabled:true }				
			],
			onClick: function (event) 
			{
				event.onComplete = function()
				{
					if( event.item.text == "Rename" )
					{
						ShowRenameOSDialog();
					}					
				}	
			}
		},
        sortData: [ { field: 'name', direction: 'asc' } ],
        columns: [
            { field: 'recid', text: 'recID', size: '60px', sortable: true, hidden: true },
			{ field: 'name', text: 'Name', size: '30%', sortable: true }            			
        ],
		onEdit: function (event)
		{
			event.onComplete = function()
			{				
				ShowEditOSDialog(DBTools.curStoreClicked);
			}
		},
		onAdd: function (event)
		{
			event.onComplete = function()
			{		
				ShowAddOSDialog();				
			}
		},
		onClick: function (event)
		{
			event.onComplete = function()
			{
				if( event.recid !== '-none-' )
				{
					if( w2ui['gridObjectStore'].getSelection().length > 0 )
					{
						//toolBarEnable('gridObjectStore', [1, 2, 3]);
						//toolBarDisable('gridObjectStore', [0]);
						if( DBTools.arrayOfPageObject[IndexedDB].active )
						{
							toolBarEnable('gridObjectStore', [1, 2, 3]);
							toolBarDisable('gridObjectStore', [0]);
							toolBarEnable('gridIndex', [0]);
							DBTools.curStoreClicked = event.originalEvent.target.innerText; 	//store name
							populateIndexGrid();
						}
						else if( DBTools.arrayOfPageObject[localForage].active )
						{
							toolBarEnable('gridObjectStore', [2, 3]);
							toolBarDisable('gridObjectStore', [0, 1]);							
							DBTools.curStoreClicked = event.originalEvent.target.innerText; 	//store name	
						}
						//DBTools.curStoreClicked = event.originalEvent.target.innerText; 		//store name
						//populateIndexGrid();												
					}
					else
					{
						DBTools.curStoreClicked = '';
						w2ui['gridIndex'].clear();
						toolBarEnable('gridObjectStore', [0]);
						toolBarDisable('gridObjectStore', [1, 2, 3]);
						toolBarDisable('gridIndex', [0, 1, 2, 3]);	
					}
				}
			}
		},
		onDelete: function (event)
		{	
			event.preventDefault();			
			ShowDelOSDialog();
		}
    },	
	grid4: 
	{
        name: 'gridIndex',
        show: {
			header:true,
			toolbar: true,
			toolbarEdit: true,
			toolbarReload : false,
			toolbarColumns : false,
			toolbarAdd: true,
			toolbarDelete: true,
			toolbarSearch: false,			
			searchAll: false,
            toolbarInput: false			
        },
		multiSelect: false,
		toolbar:
		{
			name: 'gridIndexToolbar',
			items: [
				{ type: 'button',  id: 'itemRename',  text: 'Rename', img: 'iconRename', disabled:true },
			],
			onClick: function (event) 
			{
				event.onComplete = function()
				{
					if( event.item.text == "Rename" )
					{
						ShowRenameIndexDialog();
					}					
				}	
			}
		},
        sortData: [ { field: 'name', direction: 'asc' } ],
        columns: [
            { field: 'recid', text: 'recID', size: '60px', sortable: true, hidden: true },
			{ field: 'name', text: 'Name', size: '30%', sortable: true }            			
        ],
		onClick: function (event)
		{
			event.onComplete = function()
			{
				if( event.recid !== '-none-' )
				{
					if( w2ui['gridIndex'].getSelection().length > 0 )
					{
						toolBarEnable('gridIndex', [1, 2, 3]);
						toolBarDisable('gridIndex', [0]);
												
						DBTools.curIndexClicked = event.originalEvent.target.innerText; //index name											
					}
					else
					{
						DBTools.curIndexClicked = '';
						toolBarEnable('gridIndex', [0]);
						toolBarDisable('gridIndex', [1, 2, 3]);						
					}
				}								
			}
		},
		onEdit: function (event)
		{
			ShowEditIndexDialog(DBTools.curIndexClicked);	
		},
		onAdd: function (event)
		{
			ShowAddIndexDialog();			
		},
		onDelete: function (event)
		{	
			event.preventDefault();			
			ShowDelIndexDialog();
		}
    }
}


$(function () {
	var btn = w2obj.grid.prototype.buttons;
	btn['add'].text = 'Add';
	
	// initialization in memory
    $().w2layout(config.layout);
    $().w2grid(config.grid1);
	$().w2grid(config.grid2);
	$().w2grid(config.grid3);
	$().w2grid(config.grid4);
});

function openPopup() 
{
    w2popup.open(
	{
		title: '<div style="font:bold 20px Arial,sans-serif; color: #6c9af8;">IDBTools</div',
		width: 900,
        height: 600,
        showMax: true,
        body: '<div id="left" style="position: absolute; left: 0px; top: 0px; right: 0px; bottom: 0px;"></div>',
		modal:true,
				
		onOpen : function (event) 
		{
            event.onComplete = function () 
			{
				w2ui.layout.render('#w2ui-popup #left');
				w2ui.layout.html('left', w2ui.gridIDB);
				w2ui.layout.html('main', w2ui.gridObjectStore);
				w2ui.layout.html('right', w2ui.gridIndex);
				
				w2ui['gridIDB'].header = 'Database';
				w2ui['gridForage'].header = 'Database';
				w2ui['gridObjectStore'].header = 'ObjectStore';
				w2ui['gridIndex'].header = 'Index';
				showDB('gridIDB');					
            }
        }
    });    
}


