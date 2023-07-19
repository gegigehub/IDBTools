
function showDB(gridName, recid)
{
	w2ui[gridName].clear();
	w2ui['gridObjectStore'].clear();
	w2ui['gridIndex'].clear();
	
	toolBarDisable('gridObjectStore', [3]);
	toolBarDisable('gridIndex', [0, 3]);
	
	if( gridName == 'gridIDB' )
	{
		for(var i=0, x = DBTools.ArrayOfIndexedDBObject.length; i<x; i++)
		{
			w2ui[gridName].add(DBTools.ArrayOfIndexedDBObject[i]);	
		}
		if( recid )
		{
			toolBarEnable('gridIDB', [1, 4]);
			toolBarDisable('gridIDB', [0, 2, 3]);
			w2ui['gridIDB'].select(recid);	
		}		
		
		DBTools.arrayOfPageObject[IndexedDB].active = true;
		DBTools.arrayOfPageObject[localForage].active = false;		
	}
	else if( gridName == 'gridForage' )
	{
		for(var i=0, x = DBTools.ArrayOfLocalForageObject.length; i<x; i++)
		{
			w2ui[gridName].add(DBTools.ArrayOfLocalForageObject[i]);	
		}
		if( recid )
		{
			toolBarEnable('gridForage', [1, 4]);
			toolBarDisable('gridForage', [0, 2, 3]);
			w2ui['gridForage'].select(recid);	
		}		
		
		DBTools.arrayOfPageObject[localForage].active = true;
		DBTools.arrayOfPageObject[IndexedDB].active = false;		
	}
}


function getAllDB(callback)
{
	const promise = indexedDB.databases(); 
	promise.then((databases) => 
	{
		if (callback && typeof callback === "function")
		{
			callback(databases);
		}
	})	
}

function addIndexedDB(DBName)
{
	var db;
	
	findDB(DBName, function(foundDB)
	{
		if( foundDB === undefined )
		{
			var openRequest = indexedDB.open(DBName);
				
			openRequest.onupgradeneeded = function(e)
			{
				db = openRequest.result;					
			};
			openRequest.onsuccess = function(e)
			{
				var indexedDBObject =
				{
					recid:DBTools.ArrayOfIndexedDBObject.length,
					name:DBName,
					version:openRequest.result.version
				}				
				DBTools.ArrayOfIndexedDBObject.push(indexedDBObject);				
				showDB('gridIDB', indexedDBObject.recid);
				//w2ui['gridIDB'].select([indexedDBObject.recid]);	
				db.close();	
			}			
		}
		else
		{
			ShowErrorDialog('A database with the specified name already exists. Please specify a unique name.', DBName);	
		}
	});	
}

function addForageDB(DBName, storeName)
{
	var db;
	
	findDB(DBName, function(foundDB)
	{
		if( foundDB === undefined )
		{
			var openRequest = indexedDB.open(DBName);
				
			openRequest.onupgradeneeded = function(e)
			{
				db = openRequest.result;					
			};
			openRequest.onsuccess = function(e)
			{
				var localForageObject =
				{
					recid:DBTools.ArrayOfLocalForageObject.length,
					name:DBName,
					version:openRequest.result.version
				}				
				DBTools.ArrayOfLocalForageObject.push(localForageObject);				
				showDB('gridForage', localForageObject.recid);
				db.close();
				
				myForage.config({
					name: DBName,
					storeName: "storeName"
				});
				myForage.setItem("dummyKey", "dummyValue");
			}
		}
		else
		{
			ShowErrorDialog('A database with the specified name already exists. Please specify a unique name.', DBName);	
		}
	});
}


async function getDBConnection(DBName, DBVersion)
{
	return new Promise((resolve, reject) => 
	{
		let request = indexedDB.open(DBName);
		//let request = indexedDB.open(DBName, DBVersion);		
		
		request.onerror = event => 
		{            
            console.error(event);
			var errmsg = event.srcElement.error.message;
			ShowErrorDialog(errmsg, "getDBConnection : " + event.srcElement.error.name);	
        }
		
		request.onsuccess = event => 
		{
			resolve(event.target.result);
        };		
	});
}


async function exportDB(DBName)
{
	let curDBConnect = await openIndexedDB(DBName, null);
	exportCurrentDB(curDBConnect, DBName);	
}


/*async function saveDB(DBName)
{
	let curDBConnect = await openIndexedDB(DBName, null);
	exportCurrentDB(curDBConnect, DBName);	
}*/

async function saveAsDB(oldName, newName)
{
	let curDBConnect = await openIndexedDB(oldName, null);
	exportCurrentDB(curDBConnect, newName);	
}

/*async function saveForage(DBName)
{
	let curDBConnect = await openIndexedDB(DBName, null);
	doForageExport(curDBConnect, DBName);	
}*/


function getDBName(gridName, recid, callback)
{
	var DBName = "";
	for( var i=0; i<w2ui[gridName].records.length; i++ )
	{
		//var recid = parseInt( event.recid );
		if( w2ui[gridName].records[i].recid === recid)
		{			
			DBName = w2ui[gridName].records[i].name;
			break;
		}
	}
	if (callback && typeof callback === "function")
	{
		callback(DBName);
	}
}


function getDBVersion(curDBSelected, callback)
{
	findDB(curDBSelected, function(foundDB)
	{
		var version = foundDB.version;		
			
		if (callback && typeof callback === "function")
		{
			callback(version);
		}
	});	
}

function updateDBVersion(curDBSelected, callback)
{
	findDB(curDBSelected, function(foundDB)
	{
		var recid = foundDB.recid;
		var version = foundDB.version + 1;		
		
		if( DBTools.arrayOfPageObject[IndexedDB].active )
		{
			DBTools.ArrayOfIndexedDBObject[recid].version = version;
			//w2ui['gridIDB'].refreshRow(recid);
		}
		else if( DBTools.arrayOfPageObject[localForage].active )
		{
			DBTools.ArrayOfLocalForageObject[recid].version = version;	
		}		
		
		if (callback && typeof callback === "function")
		{
			callback(version);
		}
	});
}


function findDB(curDBSelected, callback)
{
	var foundDB;
	
	if( DBTools.arrayOfPageObject[IndexedDB].active )
	{
		foundDB = DBTools.ArrayOfIndexedDBObject.find((DB) => {
			return DB.name === curDBSelected
		});
	}
	else if( DBTools.arrayOfPageObject[localForage].active )
	{
		foundDB = DBTools.ArrayOfLocalForageObject.find((DB) => {
			return DB.name === curDBSelected
		});
	}
	
	if (callback && typeof callback === "function")
	{
		callback(foundDB);
	}	
}

function filterDB(curDBClicked, callback)
{
	var newArray;
	
	if( DBTools.arrayOfPageObject[IndexedDB].active )
	{
		newArray = DBTools.ArrayOfIndexedDBObject.filter((DB) => {
			return DB.name !== curDBClicked
		});
	}
	else if( DBTools.arrayOfPageObject[localForage].active )
	{
		newArray = DBTools.ArrayOfLocalForageObject.filter((DB) => {
			return DB.name !== curDBClicked
		});
	}
	
	if (callback && typeof callback === "function")
	{
		callback(newArray);
	}	
}

function deleteDB(DBName)
{
	if( DBTools.arrayOfPageObject[IndexedDB].active )
	{
		deleteIndexedDB(DBName);
		filterDB(DBName, function(newArray)
		{
			DBTools.ArrayOfIndexedDBObject = newArray;
			showDB('gridIDB');	
		});
	}
	else if( DBTools.arrayOfPageObject[localForage].active )
	{
		deleteIndexedDB(DBName);
		filterDB(DBName, function(newArray)
		{
			DBTools.ArrayOfLocalForageObject = newArray;
			showDB('gridForage');	
		});					
	}	
}

function deleteIndexedDB(databaseName)
{
	var req = indexedDB.deleteDatabase(databaseName);
	req.onsuccess = function () 
	{
		console.log("Deleted database successfully");
	};
	req.onerror = function () 
	{
		console.log("Couldn't delete database");
	};
	req.onblocked = function () 
	{
		console.log("Couldn't delete database due to the operation being blocked");
	};
}

