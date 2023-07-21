
$( document ).ready(function() 
{
	if( requiredFeaturesSupported() )
	{
		DBTools.arrayOfPageObject.push({active:true, name:'IndexedDB', gridName:'gridIDB'});
		DBTools.arrayOfPageObject.push({active:false, name:'localForage', gridName:'gridForage'});
    	
		setDialogs();
		initDBTools();		
		toolBarDisable('gridObjectStore', [0, 1]);
		toolBarDisable('gridIndex', [0, 1]);

		$( "#editOSDialog-selectKeypath" ).autocomplete({minLength: 0});
		$( "#editOSDialog .butKeyPath" ).button({icons: { primary: "ui-icon-triangle-1-s" }, text:false});
		$( "#editOSDialog .butKeyPath" ).click(function(event)
		{
			$( "#editOSDialog-selectKeypath" ).focus();
			$( "#editOSDialog-selectKeypath" ).autocomplete( "search", "" );
		});	

		$( "#addIndexDialog-selectKeypath" ).autocomplete({minLength: 0});
		$( "#addIndexDialog .butKeyPath" ).button({icons: { primary: "ui-icon-triangle-1-s" }, text:false});
		$( "#addIndexDialog .butKeyPath" ).click(function(event)
		{
			$( "#addIndexDialog-selectKeypath" ).focus();
			$( "#addIndexDialog-selectKeypath" ).autocomplete( "search", "" );
		});	
		
		$( "#editIndexDialog-selectKeypath" ).autocomplete({minLength: 0});
		$( "#editIndexDialog .butKeyPath" ).button({icons: { primary: "ui-icon-triangle-1-s" }, text:false});
		$( "#editIndexDialog .butKeyPath" ).click(function(event)
		{
			$( "#editIndexDialog-selectKeypath" ).focus();
			$( "#editIndexDialog-selectKeypath" ).autocomplete( "search", "" );
		});
	}
});				
	
	
function requiredFeaturesSupported() 
{
	if (!window.File || !window.FileReader || !window.FileList || !window.Blob) 
	{
		consoleLog('The File APIs are not fully supported in this browser.');
		return false;
	}	
	if( !"indexedDB" in window ) 
	{
		consoleLog('IndexedDB is not supported in this browser.');
		return false;
	}	
	if(typeof(Storage) == "undefined")
	{
		consoleLog("Sorry! No Web Storage support..");
		return false;
	}	
	return true; 
}


function initDBTools()	
{
	var indexedDBIndex = 0;
	var indexedDBObject;
	var localForageIndex = 0;
	var localForageObject;
			
	// In the 'allDB' object array, we return the names and versions of all indexed databases registered in the 'Appli - Indexed databases' menu.
	// This includes IndexedDB and, in my case, localForage (IndexedDB driver).
	getAllDB(function(allDB)		
	{
		allDB.forEach(async function(value, index)
		{
			// 	You need to open the databases one by one to determine whether it's IndexedDB or localForage, because a priori only localForage databases have an 'objectStore' named 'local-forage-detect-blob-support'.
			//	That said, it is possible to rename Objectstores even on a localForage database, so it's not a 100% reliable test, but it works pretty well.
			//	Via a 'promise', we obtain a 'curDBConnect' variable which allows us to work with the database (Transactions, ObjectStores...).
			let curDBConnect = await openIndexedDB(value.name, value.version);
			
			if( curDBConnect.objectStoreNames.contains('local-forage-detect-blob-support') )
			{
				localForageObject =
				{
					recid:localForageIndex++,
					name:value.name,
					version:value.version
				}							
				DBTools.ArrayOfLocalForageObject.push(localForageObject);				
			}
			else
			{
				indexedDBObject =
				{
					recid: indexedDBIndex++,
					name: value.name,
					version: value.version					
				}							
				DBTools.ArrayOfIndexedDBObject.push(indexedDBObject);					
			}			
			curDBConnect.close();
			curDBConnect = null;	
		});		
	});		
}


