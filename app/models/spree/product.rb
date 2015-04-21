module Spree
  class Product < Spree::Base
    extend FriendlyId
    friendly_id :slug_candidates, use: :history

    acts_as_paranoid

    has_many :classifications, dependent: :delete_all, inverse_of: :product

    has_and_belongs_to_many :promotion_rules, join_table: :spree_products_promotion_rules

    has_many :line_items, through: :variants_including_master
    has_many :orders, through: :line_items

    # delegate :images, to: :master, prefix: true
    # alias_method :images, :master_images
    has_one :master,
      -> { where is_master: true },
      inverse_of: :product,
      class_name: 'Spree::Variant'

    has_many :variants_including_master,
      -> { order("#{::Spree::Variant.quoted_table_name}.position ASC") },
      inverse_of: :product,
      class_name: 'Spree::Variant',
      dependent: :destroy

    has_many :variants,
      -> { where(is_master: false).order("#{::Spree::Variant.quoted_table_name}.position ASC") },
      inverse_of: :product,
      class_name: 'Spree::Variant'


    has_many :variant_images, -> { order(:position) }, source: :images, through: :variants_including_master

    after_destroy :punch_slug

    after_save :run_touch_callbacks, if: :anything_changed?
    after_save :reset_nested_changes
    after_save :save_master
    after_initialize :ensure_master

    before_validation :normalize_slug, on: :update
    validates :name, presence: true
    validates :slug, length: { minimum: 3 }, uniqueness: { allow_blank: true }

    def ensure_master
      return unless new_record?
      self.master ||= build_master
    end

    def save_master
      if master && (master.changed? || master.new_record? || (master.default_price && (master.default_price.changed? || master.default_price.new_record?)))
        master.save!
        @nested_changes = true
      end
    end

    def has_variants?
      variants.any?
    end

    def duplicate
      duplicator = ProductDuplicator.new(self)
      duplicator.duplicate
    end

    def deleted?
      !!deleted_at
    end

    def available?
      !(available_on.nil? || available_on.future?) && !deleted?
    end


    def self.like_any(fields, values)
      where fields.map { |field|
        values.map { |value|
          arel_table[field].matches("%#{value}%")
        }.inject(:or)
      }.inject(:or)
    end

    def possible_promotions
      promotion_ids = promotion_rules.map(&:promotion_id).uniq
      Spree::Promotion.advertised.where(id: promotion_ids).reject(&:expired?)
    end

    private

    def normalize_slug
      self.slug = normalize_friendly_id(slug)
    end

    def punch_slug
      update_column :slug, "#{Time.now.to_i}_#{slug}" # punch slug with date prefix to allow reuse of original
    end

    def anything_changed?
      changed? || @nested_changes
    end

    def reset_nested_changes
      @nested_changes = false
    end

    # Try building a slug based on the following fields in increasing order of specificity.
    def slug_candidates
      [
        :name
      ]
    end

    def run_touch_callbacks
      run_callbacks(:touch)
    end

  end
end

require_dependency 'spree/product/scopes'
