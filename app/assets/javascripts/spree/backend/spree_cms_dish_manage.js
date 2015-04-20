// Placeholder manifest file.
// the installer will append this file to the app vendored assets here: vendor/assets/javascripts/spree/backend/all.js'

//= require_tree .

Spree.routes.ingredients_api = Spree.pathFor('api/ingredients')
Spree.routes.whatneeds_api = Spree.pathFor('api/whatneeds')
Spree.routes.nutritions_api = Spree.pathFor('api/nutritions')

Spree.routes.date_delivery_api = Spree.pathFor('api/date_deliveries')
Spree.routes.date_delivery_duration_api = Spree.pathFor('api/products_duration')