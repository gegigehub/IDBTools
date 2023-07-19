
const IndexedDB = 0;
const localForage = 1;

const itemDBAdd = 0;
const itemDBDelete = 1;
const itemDBLoad = 2;
const itemDBSave = 3;
const itemDBSaveAs = 4;

var DEBUG = true;

var IDBTools = localforage.createInstance({
	name: "IDBTools"
});

var myForage = localforage.createInstance({
	name: "myForage"
});


var DBTools = 
{
	arrayOfPageObject: [],
	ArrayOfIndexedDBObject: [],
	ArrayOfLocalForageObject: [],
	arrayOfObjectStores: [],
	importedDBObjectStores: [],
	storeObjectsArray: [],
	curDBSelected: "",
	curDBVersion: null,
	curStoreClicked: "",
	curIndexClicked: "",
	dbFileToRead: "",
	importedDBFile: ""	
};


function updateArrayOfIndexedDB(dbName, callback)
{	
	var openRequest = indexedDB.open(dbName);
		
	openRequest.onsuccess = event =>
	{
		var curDBConnect = openRequest.result;
			
		var indexedDBObject =
		{
			recid: DBTools.ArrayOfIndexedDBObject.length,
			name: curDBConnect.name,
			version: curDBConnect.version
		};				
		DBTools.ArrayOfIndexedDBObject.push(indexedDBObject);
				
		/*for(var i=0; i<DBTools.ArrayOfIndexedDBObject.length; i++)
		{		
			DBTools.ArrayOfIndexedDBObject[i].recid = i;						
		}*/
		
		if (callback && typeof callback === "function")
		{
			callback(curDBConnect, indexedDBObject.recid);					
		}		
	};
}


function updateArrayOfLocalForage(dbName, callback)
{	
	var openRequest = indexedDB.open(dbName);
		
	openRequest.onsuccess = event =>
	{
		var curDBConnect = openRequest.result;
			
		var localForageObject =
		{
			recid: DBTools.ArrayOfLocalForageObject.length,
			name: curDBConnect.name,
			version: curDBConnect.version
		};				
		DBTools.ArrayOfLocalForageObject.push(localForageObject);
				
		if (callback && typeof callback === "function")
		{
			callback(curDBConnect, localForageObject.recid);					
		}		
	};
}


function updatearrayOfObjectStores(OS_oldName, OS_newName)
{
	var objectStoreObject;
	
	if( !OS_newName )
	{	
		findOS(OS_oldName, DBTools.arrayOfObjectStores, function(foundOS)
		{
			if( foundOS === undefined )
			{
				objectStoreObject =
				{
					recid: DBTools.arrayOfObjectStores.length,
					name: OS_oldName
				}
				DBTools.arrayOfObjectStores.push(objectStoreObject);
			}
		});
	}
	else
	{
		findOS(OS_oldName, DBTools.arrayOfObjectStores, function(foundOS)
		{
			DBTools.arrayOfObjectStores[foundOS.recid].name = OS_newName;
		});
	}
}
