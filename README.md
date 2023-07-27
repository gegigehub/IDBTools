# IDBTools
 Some integrated tools to work with IndexedDB and localForage databases.
 At first it was only for IndexedDB, but as localForage is in my case driven via IndexedDB, most of the functions works for both.
 So we begin by getting in the 'allDB' object array, names and versions of all indexed databases registered in the 'Appli - Indexed databases' menu. (in the Chrome console)
 Then we try to distinguish between localForage and IndexedDB, but it's not easy, the way I've found is not perfect (check for 'local-forage-detect-blob-support')
 but if anybody have a better idea I'll be glad to know about.
 Click on the Open Popup button, the Popup open and if you have any Indexed database registered in the 'Appli - Indexed databases' menu (in the Chrome console),
 they will be listed under the tab 'IndexedDB' or 'localForage'.
 If not, check with your console.If you really don't have any Indexed database installed, create one.
 CREATING A NEW DATABASE :
 Click the Add button on the database toolbar, the Add dialog appear, name the new DB then click the green Add button on the dialog.
 The new DB is created and selected, but has no object stores yet. 
 CREATING A NEW OBJECTSTORE :
 Click on the '+' icon on the ObjectStore toolbar.
 The 'Add Object Store' dialog appear, name a new Object Store then click the green Add button on the dialog.
 The new Object Store is created and selected.
 On clicking on the edit Button in the ObjectStore toolbar you get an 'Edit Object Store Dialog', here you can change the behaviour of the object store.
 1. createObjectStore("notes", {autoIncrement:true})
	no keyPath and autoIncrement = true :
	the primary key (displayed in the 'key' column of the console) will be created (starting from 1) and incremented with each new record, with no duplicates.
 2.	createObjectStore("people", {keyPath:"email", autoIncrement:false})
	Let's say you have an email field, select it via the keyPath selector and uncheck the autoIncrement checkbox, the primary key will be the value of 'email',
	it can be null but cannot be duplicated, in which case the record will fail (without warning).
 3. createObjectStore("logs", {keyPath:"id", autoIncrement:true})
	keyPath not null and autoIncrement = true :
	In this case, autoIncrement plays its normal role, the keyPath becomes the primary key and, in addition, a field named 'id' (in this example) will be added to the record,
	and its value will be that of autoIncrement.
 CREATING AN INDEX :
 Only for IndexedDB because localForage does not use Indexes.
 If you have a Database and an ObjectStore selected, click on the '+' icon on the Index toolbar.
 The 'Add Index' dialog appear, name a new Object Store then click the green Add button on the dialog.