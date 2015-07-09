Default options structure : 
===========================
var defaultOptions = {
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
};

simple example :
================

<hf-grid id="ngGrid1" 
			ng-model="fakeData" 
			options="options"  
			grid-class="table table-hover table-striped table-bordered" 
			>
		</hr-grid>

Ràf :
=====
- Ajax loading function (init and by page)
- Sort on all data
- Tree
- Save col position in localStorage
- Pager buttons name
- Col def (sortOn , filterOn, classCss, action buttons)


