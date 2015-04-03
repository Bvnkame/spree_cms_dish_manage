Deface::Override.new(:virtual_path => 'spree/admin/shared/_product_sub_menu',
  :name => 'add_menu_tabs',
  :replace => "ul",
  :text => "
   <ul id='sub_nav' data-hook='admin_product_sub_tabs' class='inline-menu'>
    <%= tab :products, :match_path => '/products' %>
    <%= tab :dish_types %>
    <%= tab :day_deliveries %>
    <%= tab :ingredients %>
    <%= tab :what_you_needs %>
    <%= tab :experts %>
    <%= tab :nutritions %>
  </ul>
  ")