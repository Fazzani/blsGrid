#BlsGrid
========
###Default options structure
____________________________
>```var defaultOptions = {
    multiSelection: true,
    autoSaveReorderColumns: true,
    search: {
        searchText: '',
        searchClass: 'form-control'
    },
    pagination: {
        pageLength: 5,
        pageIndex: 1,
        pager: {
            nextTitle: 'Suivant',
            perviousTitle: 'Précédent',
            maxSize: 3
        },
        itemsPerPage: {
            prefixStorage: 'ipp_', //itemsPerPage storage prefix 
            selected: 10,
            range: [10, 20]
        }
    }
};```

>#####simple example 
____________________
```
<bls-grid id="ngGrid1" 
		ng-model="fakeData" 
		options="options"  
		grid-class="table table-hover table-striped table-bordered" 
		>
</bls-grid>```

###Ràf
______
* Ajax loading function (init and by page)
* Tree (http://www.bootply.com/GGAMvot45f)
* Pager buttons name
* Col def (sortOn , filterOn, classCss, action buttons)
* Add toolbar 
    - Search => ok  
    - Reset user settings => ok
    - Pagination (itemsPerPage + message for indexPage and count)
    - Refresh (reload data) => ok
    - Show hide columns (list checkbox)
* Allow customize
    - Header's class 
    - Spinner css
* Create services for differents Features (Reorder, Sort, etc )
* Add onSeletedItem Event and send the current element and data row
* Add checkbox header for selectAll
* ToolTip hover (option)
* Add library _underscore (http://stackoverflow.com/questions/14968297/use-underscore-inside-angular-controllers)

>####reorder from config:
* Tester la cas de plusieurs BlsGrid dans la mm page et dans des pages différentes
* Tester sans la colonne Actions

