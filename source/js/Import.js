
/* Importer une base de données IndexedDB */
function handleDBFiles(files)
{
	findDB(files[0].name, function(foundDB)
	{
		if( foundDB === undefined )
		{
			DBTools.importedDBFile = files[0];
			DBTools.curDBSelected = files[0].name;
			$('.ui-dialog-buttonpane').find('button:contains("Import")').attr("disabled", false);						
		}
		else
		{
			ShowErrorDialog('A database with the specified name already exists.Please specify a unique name or delete the existing database.', files[0].name);	
			DBTools.importedDBFile = "";
			$("#importDbFileInput").val("");
		}
	});				
}

function dbGetAsText(fileToRead)
{
	var reader = new FileReader();
	reader.onload = dbLoadHandler;
	reader.onerror = dbErrorHandler;
	// Read file into memory as UTF-8
	reader.readAsText(fileToRead);
}

function dbLoadHandler(event)
{
	var OSObject;
	var importData = event.target.result;
	var DBObjectStores = JSON.parse(importData);console.log(DBObjectStores);

	if( DBTools.arrayOfPageObject[IndexedDB].active )
	{
		$.each(DBObjectStores, function(index, value)
		{
			if( value.OSKeypath ) var keyPath = value.OSKeypath === "" ? null : value.OSKeypath;
			if( value.OSAutoInc ) var autoInc = value.OSKeypath === "" || value.OSKeypath === null && value.OSAutoInc === false ? true : value.OSAutoInc;
			if( !value.OSKeypath && !value.OSAutoInc ) autoInc = true;
			
			OSObject = 
			{
				DBName: DBTools.curDBSelected,
				index: index,
				type: "IndexedDB",
				name: value.name,
				data: value.data,
				keypath: keyPath,	
				autoInc: autoInc				
			}
			DBTools.importedDBObjectStores.push(OSObject);	
		});
	}
	else if( DBTools.arrayOfPageObject[localForage].active )
	{
		myForage.config({
			name: DBTools.curDBSelected
		});
						
		var storeName;
		
		for(var i=0; i<DBObjectStores.length; i++)
		{
			if( Array.isArray(DBObjectStores[i]) )
			{
				myForage.setItem(storeName, DBObjectStores[i]);
			}
			else
			{
				storeName = DBObjectStores[i];
			}					
		}			
	}	
}

function dbErrorHandler(evt)
{
	var errmsg = "";
	ShowErrorDialog(errmsg, "dbErrorHandler : " + evt.target.error.name);
}


async function importJSONToIDB(curDBConnect, importedDBObjectStores)
{
	var objectStoreNameArray = [];
	var objectStoreDataArray = [];
	var DBName = curDBConnect.name;
	var DBVersion = curDBConnect.version;
	curDBConnect.close();
	
	$.each(importedDBObjectStores, function(index, value)
	{
		objectStoreNameArray.push(value.name);
		objectStoreDataArray.push(value.data);		
	});
	
	curDBConnect = await createDBObjectStores(DBName, DBVersion, importedDBObjectStores);
		
	for(var j=0; j<objectStoreNameArray.length; j++)
	{
		await dbAddItems(curDBConnect, objectStoreDataArray[j], objectStoreNameArray[j]);
	}	
}


async function dbAddItems(curDBConnect, dataArray, storeName)
{
	return new Promise((resolve, reject) => 
	{
		if( curDBConnect.objectStoreNames.contains(storeName) )
		{
			var transaction = curDBConnect.transaction(storeName, "readwrite");
			var objectStore = transaction.objectStore(storeName);

			while(dataArray.length)
			{
				objectStore.add(dataArray[0]).onsuccess = function (event)
				{
					console.log(storeName + ' : items added');
				};
				dataArray.shift();
			}
			
			transaction.oncomplete = event => 
			{
				resolve();
			};
			transaction.onerror = event => 
			{
				reject(event);
			};
        };
	});
}


