
function showObjectStore(arrayOfObjectStores, toSelect)
{
	w2ui['gridObjectStore'].clear();
	w2ui['gridIndex'].clear();
	
	for(var i=0, x = DBTools.arrayOfObjectStores.length; i<x; i++)
	{
		w2ui['gridObjectStore'].add(DBTools.arrayOfObjectStores[i]);
		if( DBTools.arrayOfObjectStores[i].name === toSelect )
		{
			w2ui['gridObjectStore'].select(DBTools.arrayOfObjectStores[i].recid);
		}
	}	
}


async function getStoreFields(callback)
{
	var fieldsArray = [];
		
	let curDBConnect = await openIndexedDB(DBTools.curDBSelected, null);	
	var transaction = curDBConnect.transaction(DBTools.curStoreClicked, "readonly");
	var objectStore = transaction.objectStore(DBTools.curStoreClicked);

	var objCursor = objectStore.openCursor();
	objCursor.onsuccess = function(evt)
	{
		var cursor = evt.target.result;
		if(cursor)
		{
			for(var field in cursor.value)
			{
				fieldsArray.push(field);
			}
		}										
	}
	transaction.oncomplete = function(event) 
	{
		if (callback && typeof callback === "function")
		{
			callback( fieldsArray );					
		}
		curDBConnect.close();
	}
}


async function getStoreEditInfos(callback)
{
	var fieldsArray = [];
	var keyPath = "";
	var	autoIncrement = false;
	
	let curDBConnect = await openIndexedDB(DBTools.curDBSelected, null);	
	var transaction = curDBConnect.transaction(DBTools.curStoreClicked, "readonly");
	var objectStore = transaction.objectStore(DBTools.curStoreClicked);

	var objCursor = objectStore.openCursor();
	objCursor.onsuccess = function(evt)
	{
		var cursor = evt.target.result;
		if(cursor)
		{
			for(var field in cursor.value)
			{
				fieldsArray.push(field);
			}
		}										
	}	
	transaction.oncomplete = function(event) 
	{
		keyPath = objectStore.keyPath;
		autoIncrement = objectStore.autoIncrement;
		
		if (callback && typeof callback === "function")
		{
			callback(fieldsArray, keyPath, autoIncrement);					
		}
		curDBConnect.close();
	}
}


async function populateOSGrid( gridName )
{
	var objectStoreObject;
	
	if( gridName == "gridIDB" || gridName == "gridForage" )
	{		
		DBTools.arrayOfObjectStores = [];
		var objectStoreIndex = 0;
			
		let curDBConnect = await openIndexedDB(DBTools.curDBSelected, null);console.log(curDBConnect);
			
		for (const objectStoreName of curDBConnect.objectStoreNames)
		{
			objectStoreObject = 
			{
				recid: objectStoreIndex++,
				name: objectStoreName
			}
			DBTools.arrayOfObjectStores.push(objectStoreObject);			
		}
					
		showObjectStore(DBTools.arrayOfObjectStores);
		
		if (curDBConnect)
		{
			curDBConnect.close();
			curDBConnect = null;
		}
	}	
}


async function updateObjectStore(OSName, OSKeypath, autoInc, OSData)
{
	return new Promise((resolve, reject) => 
	{
		getDBVersion(DBTools.curDBSelected, function(curDBVersion)
		{
			DBTools.curDBVersion =  curDBVersion + 1;
		});
		
		let DB;
		let openRequest = indexedDB.open(DBTools.curDBSelected, DBTools.curDBVersion);
			
		openRequest.onupgradeneeded = event =>
		{
			DB = event.target.result;
			
			if( DB.objectStoreNames.contains(OSName) )
			{
				DB.deleteObjectStore(OSName);				
			}
			if( !DB.objectStoreNames.contains(OSName) ) 
			{
				let objectStore = DB.createObjectStore(OSName, { keyPath: OSKeypath, autoIncrement: autoInc });
				console.log("Created ObjectStore : " + OSName);
			}		
		}
		openRequest.onsuccess = event =>
		{
			setTimeout(function()
			{	
				dbAddItems(DB, OSData, OSName);	
			}, 50);			
			
			updateDBVersion(DBTools.curDBSelected);						
			updatearrayOfObjectStores(OSName);
			
			//showObjectStore(DBTools.arrayOfObjectStores);
			resolve(event.target.result);
		}
		openRequest.onerror = event =>
		{
			var errmsg = event.srcElement.error.message;
			ShowErrorDialog(errmsg, "addObjectStore : " + event.srcElement.error.name);		
		}
	});
}


async function addObjectStore(OSName)
{
	return new Promise((resolve, reject) => 
	{
		let DB;
		
		getDBVersion(DBTools.curDBSelected, function(curDBVersion)
		{
			DBTools.curDBVersion = curDBVersion + 1;
		});
		
		let openRequest = indexedDB.open(DBTools.curDBSelected, DBTools.curDBVersion);
			
		openRequest.onupgradeneeded = event =>
		{
			DB = event.target.result;
			
			if( DB.objectStoreNames.contains(OSName) )
			{
				DB.deleteObjectStore(OSName);				
			}
			if( !DB.objectStoreNames.contains(OSName) ) 
			{
				let objectStore = DB.createObjectStore(OSName, { autoIncrement: true });
				console.log("Created ObjectStore : " + OSName);
			}		
		}
		openRequest.onsuccess = event =>
		{
			updateDBVersion(DBTools.curDBSelected);
			updatearrayOfObjectStores(OSName);
			showObjectStore(DBTools.arrayOfObjectStores, OSName);			
			resolve(event.target.result);
			DB.close();
		}
		openRequest.onerror = event =>
		{
			var errmsg = event.srcElement.error.message;
			ShowErrorDialog(errmsg, "addObjectStore : " + event.srcElement.error.name);		
		}
	});
}


/*async function objectStoreGetAll(curDBConnect, index, OSName)
{
	return new Promise((resolve, reject) => 
	{
		var storeObject;
		//var storeObjectsArray = [];
		let transaction = curDBConnect.transaction(OSName, 'readonly');
        
		transaction.onerror = event => {
			reject(event);
		};
			
		let store = transaction.objectStore(OSName);
		store.getAll().onsuccess = event => 
		{
			storeObject = 
			{
				index:index,
				name:curDBConnect.objectStoreNames[index],
				keyPath: store.keyPath,
				autoIncrement: store.autoIncrement,
				data:event.target.result			
			}					
			//storeObjectsArray.push(storeObject);
			resolve(storeObject);
		};            
    });	
}*/

async function objectStoreGetAll(curDBConnect, OSName)
{
	return new Promise((resolve, reject) => 
	{
		let transaction = curDBConnect.transaction(OSName, 'readonly');
        
		transaction.onerror = event => {
			reject(event);
		};
			
		let store = transaction.objectStore(OSName);
		store.getAll().onsuccess = event => 
		{
			resolve(event.target.result);
		};            
    });	
}


function delete_ObjectStore(storeName)
{
	let db;
	getDBVersion(DBTools.curDBSelected, function(curDBVersion)
	{
		DBTools.curDBVersion = curDBVersion + 1;
	});
	//DBTools.curDBVersion += 1;
	let openRequest = indexedDB.open(DBTools.curDBSelected, DBTools.curDBVersion);
					
	openRequest.onupgradeneeded = event => {
		db = event.target.result;
		db.deleteObjectStore(storeName);										
	}
	openRequest.onsuccess = event => {
		updateDBVersion(DBTools.curDBSelected);		
	}
	openRequest.onerror = event => {
		var errmsg = event.srcElement.error.message;
		ShowErrorDialog(errmsg, "createIndexedDB : " + event.srcElement.error.name);		
	}
	
}


/*async function delete_ObjectStore(storeName)
{
	return new Promise((resolve, reject) => {
		DBTools.curDBVersion += 1;
		let openRequest = indexedDB.open(DBTools.curDBSelected, DBTools.curDBVersion);
					
		openRequest.onupgradeneeded = event => {
			let db = event.target.result;
			db.deleteObjectStore(storeName);										
		}
		openRequest.onsuccess = event => {
			updateDBVersion(DBTools.curDBSelected);
			resolve(event.target.result);	
		}
		openRequest.onerror = event => {
			var errmsg = event.srcElement.error.message;
			ShowErrorDialog(errmsg, "createIndexedDB : " + event.srcElement.error.name);		
		}
	});
}*/


async function createDBObjectStores(DBName, DBVersion, importedDBObjectStores)
{
	return new Promise((resolve, reject) =>
	{
		var thisDB;
		var objectStore;
		getDBVersion(DBTools.curDBSelected, function(curDBVersion)
		{
			DBTools.curDBVersion = curDBVersion + 1;
		});
		var openRequest = indexedDB.open(DBName, DBTools.curDBVersion);
			
		openRequest.onupgradeneeded = function(event)
		{
			console.log("Upgrading...");
			thisDB = event.target.result;
					
			for(var j=0; j<importedDBObjectStores.length; j++)
			{
				if( !thisDB.objectStoreNames.contains(importedDBObjectStores[j].name) )
				{
					objectStore = thisDB.createObjectStore(importedDBObjectStores[j].name, { autoIncrement: importedDBObjectStores[j].autoInc, keyPath: importedDBObjectStores[j].keypath });
					console.log("Created ObjectStore : " + importedDBObjectStores[j].name);
				}
			}
		}
		openRequest.onsuccess = function(event)
		{
			updateDBVersion(DBTools.curDBSelected);
			console.log("DB '" + openRequest.result.name + "' Version: " + openRequest.result.version + " Opened Successfully");
			//thisDB.close();
			resolve(event.target.result);			
		}
		openRequest.onerror = function(event) 
		{
			var errmsg = event.srcElement.error.message;
			ShowErrorDialog(errmsg, "createDBObjectStores : " + event.srcElement.error.name);
		}
		openRequest.onblocked = function(event)
		{
			console.log("blocked", event);
		};
	});
}


function renameObjectStore(dbName, dbVersion, ObjectStoreOldName, ObjectStoreNewName)
{
	getDBVersion(DBTools.curDBSelected, function(curDBVersion)
	{
		DBTools.curDBVersion = curDBVersion + 1;
	});
	
	var store;
	var openRequest = indexedDB.open(dbName, DBTools.curDBVersion);
	openRequest.onupgradeneeded = function(event)
	{
		var txn = event.target.transaction;
		store = txn.objectStore(ObjectStoreOldName);
		store.name = ObjectStoreNewName;		
	}
	openRequest.onsuccess = function(event)
	{
		DBTools.curStoreClicked = ObjectStoreNewName;
		updatearrayOfObjectStores(ObjectStoreOldName, ObjectStoreNewName)
		w2ui['gridObjectStore'].refreshRow(0);
		updateDBVersion(DBTools.curDBSelected);
		
		let DB = event.target.result;
		DB.close();				
	}
	openRequest.onerror = function(event) 
	{
		var errmsg = event.srcElement.error.message;
		ShowErrorDialog(errmsg, "renameObjectStore : " + event.srcElement.error.name);
	}
	openRequest.onblocked = function(event)
	{
		console.log("blocked");
	}
}


function findOS(curOS_Selected, OSArray, callback)
{
	var foundOS;
	
	if( DBTools.arrayOfPageObject[IndexedDB].active )
	{
		foundOS = OSArray.find((OS) => {
			return OS.name === curOS_Selected			
		});
	}
	else if( DBTools.arrayOfPageObject[localForage].active )
	{
		foundOS = OSArray.find((OS) => {
			return OS.name === curOS_Selected					
		});
	}
	
	if (callback && typeof callback === "function")
	{
		callback(foundOS);
	}	
}

