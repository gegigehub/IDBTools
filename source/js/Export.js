
/* EXPORT */
async function exportCurrentDB(curDBConnect, fileToSave)
{
	var serializedData;
	var blob;
	var saveAs = window.saveAs;
	var objectStoreArray = [];
	var combined = [];
	
	if( DBTools.arrayOfPageObject[IndexedDB].active )
	{
		await saveObjectStores(curDBConnect);	
		serializedData = JSON.stringify(DBTools.storeObjectsArray);
		blob = new Blob([serializedData], {type: "application/json"});
		saveAs(blob, fileToSave);
	}
	else if( DBTools.arrayOfPageObject[localForage].active )
	{
		objectStoreArray = await getForageData(DBTools.curDBSelected);
		
		for(var i=0; i<objectStoreArray[0].data.length; i++)
		{
			combined = combined.concat(objectStoreArray[0].data[i]);
		}
		
		serializedData = JSON.stringify(combined);
		blob = new Blob([serializedData], {type: "application/json"});
		saveAs(blob, fileToSave);
	}
}


async function getForageData(DBName)
{
	return new Promise((resolve, reject) => 
	{
		var objectStoreArray = [];
		var myForageArray = [];
		
		var myForage = localforage.createInstance({
			name: DBName
		});
						
		myForage.iterate(function(value, key, iterationNumber)
		{
			myForageArray.push([key, value]);
		})
		.then(function()
		{
			if( DEBUG ) console.log('Iteration has completed');
							
			storeObject = 
			{
				name:DBName,
				DBType:"localForage",
				data:myForageArray
			}
			objectStoreArray.push(storeObject);	
			resolve(objectStoreArray);	
		})
		.catch(function(err) {
			// This code runs if there were any errors
			console.log(err);
		});		
	});
}


async function saveObjectStores(curDBConnect)
{
	var storeObject;
	var storeObjectsArray = [];
	var objectStoreName;
	
	for(var i=0; i<curDBConnect.objectStoreNames.length; i++) 
	{	
		objectStoreName = curDBConnect.objectStoreNames[i];
		var transaction = curDBConnect.transaction(objectStoreName, "readonly");
		var objectStore = transaction.objectStore(objectStoreName);
		var getData = await objectStoreGetAll(curDBConnect, objectStoreName);
		
		storeObject = 
		{
			index:i,
			name:objectStoreName,
			keyPath: objectStore.keyPath,
			autoIncrement: objectStore.autoIncrement,
			data:getData			
		}				
		storeObjectsArray.push(storeObject);
	}
	DBTools.storeObjectsArray = storeObjectsArray;
}


