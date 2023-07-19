
function showIndex(indexNames, toSelect)
{
	w2ui['gridIndex'].clear();
	var indexName;
	
	$.each(indexNames, function(index, value)
	{
		indexName = 
		{
			recid:index,
			name:value
		}
		w2ui['gridIndex'].add(indexName);
		if( value === toSelect )
		{
			w2ui['gridIndex'].select(indexName.recid);
		}
	});
}


async function populateIndexGrid()
{
	let curDBConnect = await openIndexedDB(DBTools.curDBSelected, null);		
	transaction = curDBConnect.transaction(DBTools.curStoreClicked, "readonly");
	objectStore = transaction.objectStore(DBTools.curStoreClicked);
						
	transaction.oncomplete = (event) => 
	{
		showIndex(objectStore.indexNames);
			
		curDBConnect.close();
		curDBConnect = null;
	};	
}


async function objectStoreAddIndex(indexName, indexKeypath, CBUniqueChecked)
{
	getDBVersion(DBTools.curDBSelected, function(curDBVersion)
	{
		DBTools.curDBVersion =  curDBVersion + 1;
	});
	var objectStore;
	var openRequest = await indexedDB.open(DBTools.curDBSelected, DBTools.curDBVersion);
				
	openRequest.onupgradeneeded = function(e)
	{
		// On récupère un pointeur sur l'ObjectStore auquel on veut rajouter un index.
		objectStore = e.currentTarget.transaction.objectStore(DBTools.curStoreClicked);
					
		// Le premier argument de la fonction createIndex est le nom de l'index tel qu'il apparaitra dans la console, le second DOIT ÊTRE UN CHAMP DE L'OBJECTSTORE récupéré précédemmant.
		// C'est ce qu'on nomme en anglais KeyPath, en français chemin de la clé.
		objectStore.createIndex(indexName, indexKeypath, { unique: CBUniqueChecked });										
	}
	openRequest.onsuccess = function(event)
	{
		showIndex(objectStore.indexNames, indexName);
		updateDBVersion(DBTools.curDBSelected);	
		let db = event.target.result;
		db.close();
	}
	openRequest.onerror = function(event)
	{
		var errmsg = event.srcElement.error.message + " Check if an index with the specified name already exists.";
		ShowErrorDialog(errmsg, "createIndexedDB : " + event.srcElement.error.name);		
	}	
}


async function objectStoreEditIndex(indexName, indexKeypath, CBUniqueChecked)
{
	getDBVersion(DBTools.curDBSelected, function(curDBVersion)
	{
		DBTools.curDBVersion =  curDBVersion + 1;
	});
	//console.log(DBTools.curDBVersion);
	//DBTools.curDBVersion += 1;console.log(DBTools.curDBVersion);
	var db;
	var objectStore;
	var openRequest = await indexedDB.open(DBTools.curDBSelected, DBTools.curDBVersion);
				
	openRequest.onupgradeneeded = function(event)
	{
		var request = event.target;
		db = request.result;	console.log(db);
		var txn = request.transaction;
		objectStore = txn.objectStore(DBTools.curStoreClicked);
		console.log('existing index names in store', objectStore.indexNames);
		// On récupère un pointeur sur l'ObjectStore duquel on veut supprimer un index
		//objectStore = event.currentTarget.transaction.objectStore(DBTools.curStoreClicked);					
		//objectStore.deleteIndex(DBTools.curIndexClicked);
		//objectStore.createIndex(indexName, indexKeypath, { unique: CBUniqueChecked });	
	}
	openRequest.onsuccess = function(event)
	{
		//let db = event.target.result;
		//showIndex(objectStore.indexNames);
		//console.log(objectStore.indexNames);
		updateDBVersion(DBTools.curDBSelected);
		
		//let db = event.target.result;
		db.close();			
	}
	openRequest.onerror = function(event)
	{
		var errmsg = event.srcElement.error.message;
		ShowErrorDialog(errmsg, "Edit Index : " + event.srcElement.error.name);		
	}						
}


async function objectStoreDelIndex()
{
	getDBVersion(DBTools.curDBSelected, function(curDBVersion)
	{
		DBTools.curDBVersion =  curDBVersion + 1;
	});
	
	var objectStore;
	var openRequest = indexedDB.open(DBTools.curDBSelected, DBTools.curDBVersion);
				
	openRequest.onupgradeneeded = function(event)
	{
		// On récupère un pointeur sur l'ObjectStore duquel on veut supprimer un index
		objectStore = event.currentTarget.transaction.objectStore(DBTools.curStoreClicked);	console.log(objectStore);				
		objectStore.deleteIndex(DBTools.curIndexClicked); 										
	}
	openRequest.onsuccess = function(event)
	{
		showIndex(objectStore.indexNames);
		updateDBVersion(DBTools.curDBSelected);
		let db = event.target.result;
		db.close();		
	}
	openRequest.onerror = function(event)
	{
		var errmsg = event.srcElement.error.message;
		ShowErrorDialog(errmsg, "Delete Index : " + event.srcElement.error.name);		
	}	
}


function renameIndex(dbName, dbVersion, indexOldName, indexNewName)
{
	getDBVersion(DBTools.curDBSelected, function(curDBVersion)
	{
		DBTools.curDBVersion =  curDBVersion + 1;
	});	
		
	var store;	
	var openRequest = indexedDB.open(dbName, dbVersion);
	openRequest.onupgradeneeded = function(event)
	{
		var txn = event.target.transaction;
		store = txn.objectStore(DBTools.curStoreClicked);
		let index = store.index(indexOldName);
		index.name = indexNewName;		
	}
	openRequest.onsuccess = function(event)
	{
		
		showIndex(store.indexNames);
		updateDBVersion(DBTools.curDBSelected);
		//showDB("gridIDB");
		let DB = event.target.result;
		DB.close();				
	}
	openRequest.onerror = function(event) 
	{
		var errmsg = event.srcElement.error.message;
		ShowErrorDialog(errmsg, "Rename Index : " + event.srcElement.error.name);
	}
	openRequest.onblocked = function(event)
	{
		console.log(event);
		console.log("blocked");
	}
}

