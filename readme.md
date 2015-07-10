#BlsGrid
========
###Default options structure
___________________________
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
_________________
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
* Sort on all data
* Tree (http://www.bootply.com/GGAMvot45f)
* Save col position in localStorage
* Pager buttons name
* Col def (sortOn , filterOn, classCss, action buttons)
* Reset user settings (remove data from the localStorage)
* Fix initial loading (spinner)
* Fix ItemsPerPage change
* Show hide columns
* Add toolbar 
    - Search
    - Reset user settings
    - Pagination 
* Allow customize
    - Header's class 
    - Spinner css


>####auto reorder save:
1- load data
2- load reorder config from localStorage
3- apply config to columns
>####detect column reorder event:
1- update view 
2- apply config

>####reorder from config:
le fichier de config contient une keyValue (original index, index, column Title)[0 : {index, title}]
suivant l'index original on recupère la colonne à déplacer ensuite on la switch avec la colonne qui tient sa place
