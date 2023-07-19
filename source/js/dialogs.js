
function setDialogs()
{
	var importDbDialog = $( "#importDbDialog").dialog(
	{
		autoOpen: false,
		modal: true,
		width: 400,
		height: 180,
		resizable: false,
		
		open: function()
		{
			$('.ui-dialog-buttonpane').find('button:contains("Import")').attr("disabled", true);				
		},	
		buttons:
		{
			Import: function() 
			{ 
				$('#importDbFileInput').val("");
				if( DBTools.importedDBFile !== "" )
				{
					dbGetAsText(DBTools.importedDBFile);

					if( DBTools.arrayOfPageObject[IndexedDB].active )
					{
						updateArrayOfIndexedDB(DBTools.curDBSelected, function(curDBConnect, recid)
						{
							importJSONToIDB(curDBConnect, DBTools.importedDBObjectStores);	
							showDB('gridIDB', recid);
							curDBConnect.close();
						});
					}
					else if( DBTools.arrayOfPageObject[localForage].active )
					{	
						updateArrayOfLocalForage(DBTools.curDBSelected, function(curDBConnect, recid)
						{
							showDB('gridForage', recid);
							populateOSGrid( 'gridForage' );
							curDBConnect.close();	
						});
					}
				}
				$( this ).dialog( "close" );	
			},			
			Cancel: function()
			{
				$('#importDbFileInput').val("");
				$( this ).dialog( "close" );
			}
		}		
	});
	
	var addIDBDialog =  $("#addIDBDialog").dialog(
	{
		autoOpen: false,
		height: 180,
		width: 380,
		modal: true,
	
		buttons:
		{
			Add: function() 
			{
				var DBName = $( "#addIDBDialog-InputDbName" ).val();
				if( DBName.trim() !== "" )
				{
					addIndexedDB(DBName);					
				}							
				$( this ).dialog( "close" );
			},
			
			Cancel: function()
			{				
				$( this ).dialog( "close" );				
			}
		},
		open: function()
		{
			$( "#addIDBDialog-InputDbName" ).val("");
			$( "#addIDBDialog-InputDbName" ).focus();
			$('.ui-dialog-buttonpane').find('button:contains("Add")').css('color', 'white');
			$('.ui-dialog-buttonpane').find('button:contains("Add")').css('background', 'green');			
		}	
	});
	
	var addForageDialog =  $("#addForageDialog").dialog(
	{
		autoOpen: false,
		height: 180,
		width: 380,
		modal: true,
	
		buttons:
		{
			Add: function() 
			{
				var DBName = $( "#addForageDialog-InputDbName" ).val();
				var storeName = $( "#addForageDialog-InputStoreName" ).val();
				
				if( DBName.trim() !== "" )
				{
					addForageDB(DBName, storeName);
				}							
				$( this ).dialog( "close" );
			},
			
			Cancel: function()
			{				
				$( this ).dialog( "close" );				
			}
		},
		open: function()
		{
			$( "#addForageDialog-InputDbName" ).focus();
			$('.ui-dialog-buttonpane').find('button:contains("Add")').css('color', 'white');
			$('.ui-dialog-buttonpane').find('button:contains("Add")').css('background', 'green');			
		}	
	});
	
	var delDbDialog = $( "#delDbDialog" ).dialog(
	{
		autoOpen: false,
		modal: true,
		closeText: "",
		width: 380,
		
		buttons:
		{
			Delete: function() 
			{
				deleteDB(DBTools.curDBSelected);
				DBTools.curDBSelected = '';
				var gridName = DBTools.arrayOfPageObject[IndexedDB].active ? 'gridIDB' : 'gridForage';
				toolBarDisable(gridName, [1, 4]);
				toolBarEnable(gridName, [0, 2]);
				toolBarDisable('gridObjectStore', [0, 1, 2]);
				$( this ).dialog( "close" );
			},
			Cancel: function()
			{
				$( this ).dialog( "close" );
			}
		},
		open: function()
		{
			$('.ui-dialog-buttonpane').find('button:contains("Delete")').css('color', 'white');
			$('.ui-dialog-buttonpane').find('button:contains("Delete")').css('background', 'red');
			$('.ui-dialog-buttonpane').find('button:contains("Cancel")').focus();	
		}
	});
	
	var DbSaveAsDialog = $( "#DbSaveAsDialog" ).dialog(
	{
		autoOpen: false,
		modal: true,
		width: 380,
		height: 180,
		resizable: false,

		buttons:
		{
			Save: function() 
			{
				var oldName = $( "#DbSaveAsDialog" ).dialog( "option", "oldName" ); 
				saveAsDB( oldName, $( '#DbSaveAsDialog-InputName' ).val() );
				$( this ).dialog( "close" );
			},			
			Cancel: function()
			{
				$( this ).dialog( "close" );
			}
		}		
	});
	
	var addOsDialog = $( "#addOsDialog" ).dialog(
	{
		autoOpen: false,
		modal: true,
		width: 380,
		height: 180,
		resizable: false,

		buttons:
		{
			Add: function() 
			{
				var OSName = $( "#addOsDialog-InputName" ).val();
				addObjectStore(OSName);
				toolBarEnable('gridIndex', [0]);	
																
				$( this ).dialog( "close" );
			},			
			Cancel: function()
			{
				$( this ).dialog( "close" );
			}
		},
		open: function()
		{
			$( "#addOsDialog-InputName" ).val("");
			$( "#addOsDialog-InputName" ).focus();
			$('.ui-dialog-buttonpane').find('button:contains("Add")').css('color', 'white');
			$('.ui-dialog-buttonpane').find('button:contains("Add")').css('background', 'green');						
		}
	});
	
	var editOSDialog = $( "#editOSDialog" ).dialog(
	{
		autoOpen: false,
		modal: true,
		width: 400,
		height: 240,
		resizable: true,

		buttons:
		{
			Save: function() 
			{
				var OSName = $( "#editOSDialog-InputName" ).val();
				var OSKeypath = $( "#editOSDialog-selectKeypath" ).val();
				if( OSKeypath  === "" ) OSKeypath = null;
				var OSAutoInc = document.getElementById("editOSDialog-autoIncrement").checked;
				
				editOSDialog_Save(OSName, OSKeypath, OSAutoInc);		
								
				$( this ).dialog( "close" );
			},			
			Cancel: function()
			{
				$( this ).dialog( "close" );
			}
		},
		open: function()
		{
			$( "#editOSDialog-selectKeypath" ).val($( this ).dialog( "option", "keyPath" ) );
			document.getElementById("editOSDialog-autoIncrement").checked = $( this ).dialog( "option", "autoIncrement" );			
			$( "#editOSDialog-InputName" ).val($( this ).dialog( "option", "OSName" ) );
			$( "#editOSDialog-InputName" ).focus();
					
			$('.ui-dialog-buttonpane').find('button:contains("OK")').css('color', 'white');
			$('.ui-dialog-buttonpane').find('button:contains("OK")').css('background', 'green');						
		}
	});
	
	var renameOsDialog = $( "#renameOsDialog" ).dialog(
	{
		autoOpen: false,
		modal: true,
		width: 380,
		height: 200,
		resizable: false,

		buttons:
		{
			Rename: function() 
			{
				var oldName = $( "#renameOsDialog-InputOldName" ).val();
				var newName = $( "#renameOsDialog-InputNewName" ).val();
												
				renameObjectStore(DBTools.curDBSelected, DBTools.curDBVersion, oldName, newName);
												
				$( this ).dialog( "close" );
			},			
			Cancel: function()
			{
				$( this ).dialog( "close" );
			}
		},
		open: function()
		{
			$('.ui-dialog-buttonpane').find('button:contains("Rename")').css('color', 'white');
			$('.ui-dialog-buttonpane').find('button:contains("Rename")').css('background', 'green');
			$( "#renameOSDialog-InputNewName" ).focus();	
		}
	});
	
	var delOsDialog = $( "#delOsDialog" ).dialog(
	{
		autoOpen: false,
		modal: true,
		width: 380,
		height: 160,
		resizable: false,

		buttons:
		{
			Delete: function() 
			{
				delete_ObjectStore(DBTools.curStoreClicked);
				populateOSGrid( 'gridIDB' );
								
				$( this ).dialog( "close" );
			},			
			Cancel: function()
			{
				$( this ).dialog( "close" );
			}
		},
		open: function()
		{
			$('#delOsDialog-InputName').val(DBTools.curStoreClicked);
			document.getElementById('delOsDialog-InputName').disabled = true;
			$('.ui-dialog-buttonpane').find('button:contains("Delete")').css('color', 'white');
			$('.ui-dialog-buttonpane').find('button:contains("Delete")').css('background', 'red');
			$('.ui-dialog-buttonpane').find('button:contains("Cancel")').focus();	
		}
	});
	
	var addIndexDialog = $( "#addIndexDialog" ).dialog(
	{
		autoOpen: false,
		modal: true,
		width: 380,
		height: 220,
		resizable: false,

		buttons:
		{
			Add: function() 
			{
				var indexName = $( "#addIndexDialog-InputName" ).val();
				var indexKeypath = $( "#addIndexDialog-selectKeypath" ).val();
				var CBUniqueChecked = document.getElementById("addIndexDialog-CbUnique").checked;
								
				objectStoreAddIndex(indexName, indexKeypath, CBUniqueChecked);
				toolBarEnable('gridIndex', [3]);
				toolBarDisable('gridIndex', [0]);
												
				$( this ).dialog( "close" );
			},			
			Cancel: function()
			{
				$( this ).dialog( "close" );
			}
		},
		open: function()
		{
			$( "#addIndexDialog-InputName" ).val("");
			$( "#addIndexDialog-selectKeypath" ).val("");	
			document.getElementById("addIndexDialog-CbUnique").checked = false;
			$('.ui-dialog-buttonpane').find('button:contains("Add")').css('color', 'white');
			$('.ui-dialog-buttonpane').find('button:contains("Add")').css('background', 'green');			
		}
	});
	
	var editIndexDialog = $( "#editIndexDialog" ).dialog(
	{
		autoOpen: false,
		modal: true,
		width: 380,
		height: 240,
		resizable: false,

		buttons:
		{
			OK: function() 
			{
				var indexName = $( "#editIndexDialog-InputName" ).val();
				if( indexName !== $( "#editIndexDialog" ).dialog( "option", "oldName" ))
				{
					renameIndex(DBTools.curDBSelected, DBTools.curDBVersion, $( "#editIndexDialog" ).dialog( "option", "oldName" ), indexName);
				}
				var indexKeypath = $( "#editIndexDialog-selectKeypath" ).val();
				var CBUniqueChecked = document.getElementById("editIndexDialog-CbUnique").checked;
							
				objectStoreEditIndex(indexName, indexKeypath, CBUniqueChecked);
												
				$( this ).dialog( "close" );
			},			
			Cancel: function()
			{
				$( this ).dialog( "close" );
			}
		},
		open: function()
		{
			editIndexDialog_GetIndexInfos(function(indexKeypath, CBUniqueChecked)
			{
				$( "#editIndexDialog-selectKeypath" ).val(indexKeypath);	
				document.getElementById("editIndexDialog-CbUnique").checked = CBUniqueChecked;	
			});
			
			$('.ui-dialog-buttonpane').find('button:contains("Add")').css('color', 'white');
			$('.ui-dialog-buttonpane').find('button:contains("Add")').css('background', 'green');			
		}
	});
	
	var delIndexDialog = $( "#delIndexDialog" ).dialog(
	{
		autoOpen: false,
		modal: true,
		width: 380,
		height: 160,
		resizable: false,

		buttons:
		{
			Delete: function() 
			{
				objectStoreDelIndex();
				toolBarDisable('gridIndex', [3]);
				$( this ).dialog( "close" );
			},			
			Cancel: function()
			{
				$( this ).dialog( "close" );
			}
		},
		open: function()
		{
			$('#delIndexDialog-InputName').val(DBTools.curIndexClicked);
			document.getElementById('delIndexDialog-InputName').disabled = true;
			$('.ui-dialog-buttonpane').find('button:contains("Delete")').css('color', 'white');
			$('.ui-dialog-buttonpane').find('button:contains("Delete")').css('background', 'red');
			$('.ui-dialog-buttonpane').find('button:contains("Cancel")').focus();	
		}
	});

	var renameIndexDialog = $( "#renameIndexDialog" ).dialog(
	{
		autoOpen: false,
		modal: true,
		width: 380,
		height: 200,
		resizable: false,

		buttons:
		{
			Rename: function() 
			{
				var oldName = $( "#renameIndexDialog-InputOldName" ).val();
				var newName = $( "#renameIndexDialog-InputNewName" ).val();
				
				renameIndex(DBTools.curDBSelected, DBTools.curDBVersion, oldName, newName);	
																
				$( this ).dialog( "close" );
			},			
			Cancel: function()
			{
				$( this ).dialog( "close" );
			}
		},
		open: function()
		{
			$('.ui-dialog-buttonpane').find('button:contains("Rename")').css('color', 'white');
			$('.ui-dialog-buttonpane').find('button:contains("Rename")').css('background', 'green');
			$( "#renameIndexDialog-InputNewName" ).val("");
			$( "#renameIndexDialog-InputNewName" ).focus();	
		}
	});
	
	var errorDialog = $( "#errorDialog" ).dialog(
	{
		autoOpen: false,
		modal: true,
		closeText: "",
		width: 380,
		
		buttons:
		{
			Cancel: function()
			{
				$( this ).dialog( "close" );
			}
		},
		open: function()
		{
			//$('.ui-dialog-buttonpane').find('button:contains("Delete")').css('color', 'white');
			//$('.ui-dialog-buttonpane').find('button:contains("Delete")').css('background', 'red');
			$('.ui-dialog-buttonpane').find('button:contains("Cancel")').focus();	
		}
	});
	
	var confirmDialog = $( "#confirmDialog" ).dialog(
	{
		autoOpen: false,
		modal: true,
		closeText: "",
		width: 380,
		
		buttons:
		{
			Yes: function() 
			{
				$( this ).dialog( "close" );
			},
			No: function()
			{
				$( this ).dialog( "close" );
			}
		},
	});
}


function ShowErrorDialog(msg, title)
{
	$( "#errorDialog #error-Text" ).html('<p>'+msg+'<p>');
	$( "#errorDialog" ).dialog( "option", "title", title);
	$( "#errorDialog" ).dialog( "open" );
}

function ShowConfirmDialog(msg, title, action)
{
	$( "#confirmDialog #confirm-Text" ).html('<p>'+msg+'<p>');
	$( "#confirmDialog" ).dialog( "option", "title", title);
	$( "#confirmDialog" ).dialog( "option", "action", action);
	$( "#confirmDialog" ).dialog( "open" );
}


function ShowImportDBDialog(action)
{
	$( "#importDbDialog #dbFileInput" ).val("");
	$( "#importDbDialog" ).dialog( "option", "title", action );		
	$( "#importDbDialog" ).dialog( "open" );	
}

function ShowAddIDBDialog()
{	
	$( "#addIDBDialog" ).dialog( "option", "title", 'Add IndexedDB Database' );
	$( "#addIDBDialog" ).dialog( "open" );		
}

function ShowAddForageDialog()
{	
	$( "#addForageDialog" ).dialog( "option", "title", 'Add localForage Database' );
	$( "#addForageDialog" ).dialog( "open" );		
}

function ShowDelDBDialog( title )
{
	$( "#delDbDialog #delDbDialog-confirmText" ).html('<p>You are about to delete <b>' + DBTools.curDBSelected + ' </b>.<br />Are you sure ?</p>');
	$( "#delDbDialog" ).dialog( "option", "title", title);
	$( "#delDbDialog" ).dialog( "open" );
}

function showDBSaveAsDialog(DBSelected)
{
	$( '#DbSaveAsDialog-InputName' ).val( DBSelected );
	$( "#DbSaveAsDialog" ).dialog( "option", "title", 'Save As' );
	$( "#DbSaveAsDialog" ).dialog( "option", "oldName", DBSelected );	
	$( "#DbSaveAsDialog" ).dialog( "open" );		
}

function ShowAddIndexDialog()
{	
	getStoreFields(function( fieldsArray )  //, keyPath, autoIncrement)
	{
		$( "#addIndexDialog-selectKeypath" ).autocomplete( "option", "source", fieldsArray );
				
		$( "#addIndexDialog" ).dialog( "option", "title", 'Add Index' );	
		$( "#addIndexDialog" ).dialog( "open" );		
    });	
}


function ShowEditIndexDialog(indexName)
{	
	getStoreFields(function( fieldsArray )  //, keyPath, autoIncrement)
	{
		$( "#editIndexDialog-selectKeypath" ).autocomplete( "option", "source", fieldsArray );
				
		$( "#editIndexDialog" ).dialog( "option", "title", 'Edit Index' );
		$( "#editIndexDialog" ).dialog( "option", "oldName", indexName );
		$( "#editIndexDialog-InputName" ).val(indexName);	
		$( "#editIndexDialog" ).dialog( "open" );		
    });	
}


function ShowDelIndexDialog()
{	
	$( "#delIndexDialog" ).dialog( "option", "title", 'Delete Index' );	
	$( "#delIndexDialog" ).dialog( "open" );	
}


function ShowRenameIndexDialog()
{	
	$( "#renameIndexDialog-InputOldName" ).val(DBTools.curIndexClicked);
	$( "#renameIndexDialog" ).dialog( "option", "title", 'Rename Index' );	
	$( "#renameIndexDialog" ).dialog( "open" );	
}


function ShowRenameOSDialog()
{	
	$( "#renameOsDialog-InputOldName" ).val(DBTools.curStoreClicked);
	$( "#renameOsDialog-InputNewName" ).val("");
	$( "#renameOsDialog" ).dialog( "option", "title", 'Rename Object Store' );		
	$( "#renameOsDialog" ).dialog( "open" );		
}

function ShowAddOSDialog()
{	
	$( "#addOsDialog" ).dialog( "option", "title", 'Add Object Store' );	
	$( "#addOsDialog" ).dialog( "open" );		
}

function ShowEditOSDialog(OSName)
{	
	getStoreEditInfos(function(fieldsArray, keyPath, autoIncrement)
	{
		$( "#editOSDialog-selectKeypath" ).autocomplete( "option", "source", fieldsArray );
		    	
		$( "#editOSDialog" ).dialog( "option", "title", 'Edit Object Store' );
		$( "#editOSDialog" ).dialog( "option", "OSName", OSName );
		$( "#editOSDialog" ).dialog( "option", "keyPath", keyPath );
		$( "#editOSDialog" ).dialog( "option", "autoIncrement", autoIncrement );	
		$( "#editOSDialog" ).dialog( "open" );
	});	
}

function ShowDelOSDialog()
{	
	$( "#delOsDialog" ).dialog( "option", "title", 'Delete Object Store' );	
	$( "#delOsDialog" ).dialog( "open" );	
}


async function editOSDialog_Save(OSName, OSKeypath, OSAutoInc)
{
	let curDBConnect = await getDBConnection(DBTools.curDBSelected, DBTools.curDBVersion);	
	let OSData = await objectStoreGetAll(curDBConnect, OSName);
	curDBConnect.close();	
	await updateObjectStore(OSName, OSKeypath, OSAutoInc, OSData);	
}


async function editIndexDialog_GetIndexInfos(callback)
{
	let curDBConnect = await getDBConnection(DBTools.curDBSelected, DBTools.curDBVersion);
	
	const transaction = curDBConnect.transaction([DBTools.curStoreClicked], "readonly");
	const objectStore = transaction.objectStore(DBTools.curStoreClicked);
	const myIndex = objectStore.index(DBTools.curIndexClicked);console.log(myIndex);
	
	transaction.oncomplete = function(event) 
	{	
		if (callback && typeof callback === "function")
		{
			callback(myIndex.keyPath, myIndex.unique);					
		}
		console.log(myIndex.keyPath, myIndex.unique);
		curDBConnect.close();
	}
}

