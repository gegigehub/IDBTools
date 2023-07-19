
"use strict";

async function openIndexedDB(dbName, dbVersion) 
{
    return new Promise((resolve, reject) => 
	{    
		var openRequest;
	
		if( dbVersion === null )
		{
			openRequest = indexedDB.open(dbName);
		}
		else
		{
			openRequest = indexedDB.open(dbName, dbVersion);	
		}
        
        openRequest.onerror = event => {
            var errmsg = dbName + " " + event.srcElement.error.message;
			ShowErrorDialog(errmsg, "openIndexedDB : " + event.srcElement.error.name);
        }
        
        /*openRequest.onupgradeneeded = event => 
		{
            console.log('idb onupgradeneeded firing');

            let db = event.target.result;

            //let objectStore = db.createObjectStore('contacts', { keyPath: 'id', autoIncrement:true });
            //objectStore.createIndex('lastname', 'lastname', { unique: false });
        };*/
        
        openRequest.onsuccess = event => {		
			//DBTools.openIndexedDB.push(event.target.result);			
            resolve(event.target.result);
        };
    });
}


