
function toolBarEnable(gridName, arrayOfItemsNumber)
{
	for(var j=0; j<arrayOfItemsNumber.length; j++)
	{
		w2ui[gridName]['toolbar']['items'][arrayOfItemsNumber[j]].disabled = false;
	}
	w2ui[gridName]['toolbar'].refresh();
}


function toolBarDisable(gridName, arrayOfItemsNumber)
{
	for(var j=0; j<arrayOfItemsNumber.length; j++)
	{
		w2ui[gridName]['toolbar']['items'][arrayOfItemsNumber[j]].disabled = true;
	}
	w2ui[gridName]['toolbar'].refresh();
}


