# Bootstrap Checklist

Transforms bootstrap dropdown menus into checklists that accept multiple selections simultaneously.

## Getting Started

Initializing a checklist or multiple checklists is easy, just start with a basic Bootstrap `dropdown-menu`.

```
$('ul.dropdown-menu').checklist();
```

### Prerequisites

The only thing you'll need is jQuery and Twitter Bootstrap. That's it!

### Installing

You only need two files. Feel free to change styling in the `bootstrap-checklist.css` file.

```
bootstrap-checklist.js -- contains framework for the .checklist() plugin
bootstrap-checklist.css -- contains styling for the checked items in checklists
```

To include them in your project:


    <script type="text/javascript" src="../dir/to/bootstrap-checklist.js"></script>
    <link rel="stylesheet" href="../dir/to/bootstrap-checklist.css" />


That's it!

## Deployment

Bootstrap Checklist comes with a few basic options. 

    $('#my-checklist').checklist({
      min: 3,
      max: 5,
      callbacks: { 
        '.alert-values': function(e, self, dd) { 
          // create a callback for the `Alert values` option
          alert(dd.checklist('value')); 
          // You can fetch the current value of any checklist with $(selector).checklist('value')
        }
      }
    });


For a full playground with all available options, check out [this fiddle](https://jsfiddle.net/fbvwcj6o/).

## Built With

* [jQuery](http://api.jquery.com/) - Javascript framework required for Bootstrap
* [Twitter Bootstrap](https://bootstrapdocs.com/) - Based on Bootstrap's `dropdown-menu`

## Authors

* **Dan Lindsey** - *Initial work* - [SISYN](http://sisyn.com)

## License

This project is licensed under GPLv3 - see the [LICENSE](LICENSE) file for details
