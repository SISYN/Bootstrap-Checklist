/*************************************************************
 * jQuery + Bootstrap Checklist
 * Last updated January 22, 2017 2:45pm EST
 * Version 0.0.1 : Created January 21, 2017
 * Developed by Dan Lindsey @ SISYN.COM
 *************************************************************/
/*************************************************************
 * Upcoming Features
 ** no new features requested or planned
 *************************************************************/
/*************************************************************
 * Table of Contents
 * 1. Class & element references
 * 2. Plugin definition
 * 3. Option handling
 * 4. Click handling for `li` elements
 * 5. Plugin defaults
 * 6. Preliminary check for auto-init instances
 *************************************************************/


/*************************************************************
 * 1. Class & element references
 *************************************************************/
var ChecklistParentDropdownSelector, ChecklistActiveClassName, ChecklistStyleClassName, ChecklistValueSeparator;

ChecklistParentDropdownSelector = 'ul.dropdown-menu';
ChecklistStyleClassName = ''; // custom class name for the base `ul` element if you wish to use your own CSS rules
ChecklistActiveClassName = 'checked'; // must match the default (checked) or your style rules
ChecklistValueSeparator = ','; // comma by default, can be anything you like

/*************************************************************
 * 2. Plugin definition
 *************************************************************/
(function($) {
    $.fn.checklist = function(SuppliedOptions) {
        var self = this;

        // Determine if we need to add custom class name to the `ul` parent element for custom styling rules
        if ( typeof ChecklistStyleClassName != typeof undefined && ChecklistStyleClassName.length > 0 )
            $(this).addClass(ChecklistStyleClassName);

        /*************************************************************
         * 3. Option handling
         *************************************************************/
        // Check if supplied options is a method name instead
        if (typeof SuppliedOptions == typeof 'str') {
            var values = CompileChecklist();

            if (SuppliedOptions.toLowerCase().trim() == 'value' || SuppliedOptions.toLowerCase().trim() == 'json')
                return values.json;
            if (SuppliedOptions.toLowerCase().trim() == 'list')
                return values.list;
            if (SuppliedOptions.toLowerCase().trim() == 'destroy')
                return true; // figure out how to remove on click events

            throw new Error('Unknown plugin method `' + SuppliedOptions + '` for jquery-bootstrap-checklist.js');
        }

        // Extend our default options with those provided
        // Note that the first argument to extend is an empty object – this is to keep from overriding our "defaults" object
        var Options = $.extend({}, $.fn.checklist.defaults, SuppliedOptions);



        /*************************************************************
         * 4. Click handling for `li` elements
         *************************************************************/
        $(document).on('click', this.selector + ' > li', function(e) {
            /*************************************************************
             * 4-1. Prevent default on `a` elements - MOVE BELOW 4.2 ??
             *************************************************************/
            e.preventDefault();


            /*************************************************************
             * 4-2. Allow dd/select to close if element is in exceptions
             *************************************************************/
            // We also check for child `a` elements for exceptions so that you can
            // attach exception classes to either the `li` or the subsequent `a` element
            if (Options['exceptions'].length > 0 && $(this).is(Options['exceptions']))
                return;


            /*************************************************************
             * 4-3. Stop propagation to prevent dd/select from closing
             *************************************************************/
            if (Options['stay']) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                $(self).toggleClass('open'); // Force the dd/select open via the `open` class
            }

            /*************************************************************
             * 4.4 Toggle item
             *************************************************************/
            if ( Options['check'] )
                ToggleChecklistItem($(this));

            /*************************************************************
             * 4.5 Check for callbacks
             *************************************************************/
            for (var selector in Options['callbacks']) {
                if (Options['callbacks'].hasOwnProperty(selector)) {
                    if ($(this).is(selector) || $(this).children('a').is(selector)) // do callback and provide (e,self,dd) params
                        Options['callbacks'][selector](e, this, self);
                }
            }


        });



        function ToggleChecklistItem(ListItemObj) {
            if (ListItemObj.hasClass(ChecklistActiveClassName))
                RemoveItemFromChecklist(ListItemObj);
            else
                AddItemToChecklist(ListItemObj);
        }

        function AddItemToChecklist(ListItemObj) {
            // Check if this item should be added to list
            if ( typeof ListItemObj.attr('data-value') == typeof undefined )
                return; // Do not add to list if it does not have value
            // Check if max is relevant
            if ( typeof Options['max'] != typeof undefined && Options['max'] > 0  && Options['max'] <= $(self).children('li.'+ChecklistActiveClassName).length )
                return; // Max reached, cannot add this item
            ListItemObj.addClass(ChecklistActiveClassName);
        }

        function RemoveItemFromChecklist(ListItemObj) {
            // Check if min is relevant
            if ( typeof Options['min'] != typeof undefined && Options['min'] > 0  && Options['min'] >= $(self).children('li.'+ChecklistActiveClassName).length )
                return; // Min reached, cannot remove this item
            ListItemObj.removeClass(ChecklistActiveClassName);
        }

        function CompileChecklist() {
            var ChecklistValues = [];
            // loop through all checked items and add their value to the list
            $(self).children('li.'+ChecklistActiveClassName).each(function() {
                ChecklistValues[ChecklistValues.length] = $(this).attr('data-value');
            });

            // Now take the array of values and store it in hidden inputs with the appropriate names
            var BasicList, JSONList;
            BasicList = ChecklistValues.join(ChecklistValueSeparator);
            JSONList = JSON.stringify(ChecklistValues);

            return {
                json: JSONList,
                list: BasicList
            };

        }


        return this;


    };


    /*************************************************************
     * 5. Plugin defaults
     *************************************************************/
    // Plugin defaults – added as a property on our plugin function.
    $.fn.checklist.defaults = {
        stay: true, // keep dropdown menu open after selections are made
        check: true, // add `checked` class to selected items and store their value
        min: 1, // min # of items that must be selected
        max: 0, // max # of items that can be selected - setting max to 0 turns max off
        exceptions: '.dd-close', // exception selectors for `stay` checklists allow the checklist to close when specified selector is clicked
        callbacks: { // associative list of callbacks with selectors as indexes/keys - if selector is clicked, do callback
            '.dd-close': function(e, self, dd) { // another way to handle the .dd-close exception
                dd.dropdown("toggle");
            }
        }
    };



})(jQuery);


/*************************************************************
 * 6. Preliminary check for auto-init instances
 *************************************************************/
$(function() {
    $('ul.dropdown-menu.checklist').checklist();
});
