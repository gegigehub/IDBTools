
function gridEventsOnSelectCB(gridName, event)
{
	var selectedCount = w2ui[gridName].getSelection().length;
	
	getDBName(gridName, parseInt(event.recid), function(DBName)
	{
		if( selectedCount === 1 )
		{
			DBTools.curDBSelected = DBName;
			getDBVersion(DBName, function(DBVersion)
			{
				DBTools.curDBVersion = DBVersion;
			});	
								
			populateOSGrid( gridName );
								
			toolBarEnable(gridName, [1, 4]);
			toolBarDisable(gridName, [0, 2, 3]);
			toolBarEnable('gridObjectStore', [0]);	
		}
		else if( selectedCount > 1 )
		{
			toolBarEnable(gridName, [3]);
			toolBarDisable(gridName, [0, 1, 2, 4]);
			toolBarDisable('gridObjectStore', [0]);
			w2ui['gridObjectStore'].clear();
			w2ui['gridIndex'].clear();	
		}	
	});		
}


function gridEventsOnSelectRow(gridName, event)
{
	getDBName(gridName, parseInt(event.recid), function(DBName)
	{
		DBTools.curDBSelected = DBName;
		getDBVersion(DBName, function(DBVersion)
		{
			DBTools.curDBVersion = DBVersion;
		});	
							
		populateOSGrid( gridName );
		
		toolBarEnable(gridName, [1, 4]);
		toolBarDisable(gridName, [0, 2, 3]);
		toolBarEnable('gridObjectStore', [0]);
		toolBarDisable('gridObjectStore', [1, 2, 3]);
	});
}


/*function gridEventsOnUnselect(gridName, event)
{	
	if( event.column && event.column === null )
	{
		if( w2ui[gridName].getSelection().length === 1 )
		{
			toolBarEnable(gridName, [1, 4]);
			toolBarDisable(gridName, [0, 2, 3]);	
		}
		else
		{
			toolBarEnable(gridName, [0, 2]);
			toolBarDisable(gridName, [1, 3, 4]);
			toolBarDisable('gridObjectStore', [0, 3]);
			toolBarDisable('gridIndex', [0]);	
			w2ui['gridObjectStore'].clear();
			w2ui['gridIndex'].clear();
		}
	}
	else
	{
		if( w2ui[gridName].getSelection().length <= 1 )
		{
			toolBarEnable(gridName, [0, 2]);
			toolBarDisable(gridName, [1, 3, 4]);
			toolBarDisable('gridObjectStore', [0, 3]);
			toolBarDisable('gridIndex', [0]);
			w2ui['gridObjectStore'].clear();
			w2ui['gridIndex'].clear();
		}
		else
		{
			toolBarEnable(gridName, [3]);
			toolBarDisable(gridName, [0, 1, 2, 4]);	
		}
	}
}*/


/*async function gridEventsOnClick(gridName)
{
	var transaction;
	var objectStore;
	
	if( gridName == "gridIDB" || gridName == "gridForage" )
	{		
		DBTools.arrayOfObjectStores = [];
		var objectStoreIndex = 0;
			
		let curDBConnect = await openIndexedDB(DBTools.curDBSelected, null);
			
		for (const objectStoreName of curDBConnect.objectStoreNames)
		{
			objectStore = 
			{
				recid: objectStoreIndex++,
				name: objectStoreName
			}
			DBTools.arrayOfObjectStores.push(objectStore);			
		}
					
		showObjectStore(DBTools.arrayOfObjectStores);
		
		if (curDBConnect)
		{
			curDBConnect.close();
			curDBConnect = null;
		}
	}
	else if( gridName == "gridObjectStore" )
	{
		let curDBConnect = await openIndexedDB(DBTools.curDBSelected, null);		
		transaction = curDBConnect.transaction(DBTools.curStoreClicked, "readonly");
		objectStore = transaction.objectStore(DBTools.curStoreClicked);
						
		transaction.oncomplete = (event) => 
		{
			showIndex(objectStore.indexNames);
			
			if (curDBConnect)
			{
				curDBConnect.close();
				curDBConnect = null;
			}
		};		
	}
}*/


