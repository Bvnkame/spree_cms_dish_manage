Deface::Override.new(:virtual_path => 'spree/admin/shared/_product_tabs',
  :name => 'modify_product_tabs',
  :replace => "ul",
  :text => "
    <ul data-hook='admin_product_tabs'>
      <%= content_tag :li, :class => ('active' if current == 'Product Details') do %>
        <%= link_to_with_icon 'edit', Spree.t(:product_details), edit_admin_product_url(@product) %>
      <% end if can?(:admin, Spree::Product) %>
      <%= content_tag :li, :class => ('active' if current == 'Images') do %>
        <%= link_to_with_icon 'picture-o', Spree.t(:images), admin_product_images_url(@product) %>
      <% end if can?(:admin, Spree::Image) %>
    </ul>
  ")