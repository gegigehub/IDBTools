
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
			
	// On renvoie dans le tableau d'objets 'allDB' les noms et version de toutes les bases de données indexées enregistrées dans le menu 'Appli - Bases de données indexées'
	// Cela comprend IndexedDB et localForage.
	getAllDB(function(allDB)		
	{
		allDB.forEach(async function(value, index)
		{
			// On doit ouvrir une à une les bases de données pour déterminer si c'est IndexedDB ou localForage, en effet à priori seules les BD localForage possèdent un 'objectStore' nommé 'local-forage-detect-blob-support'.
			// Cela dit il est possible de renommer les Objectstores même sur une base localForage, ce n'est donc pas un test fiable à 100%.
			// Via une 'promise' on obtient une variable 'curDBConnect' qui permet de travailler avec la base de données (Transactions, ObjectStores...)
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


