/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = (pgm) => {
    pgm.addIndex('products', 'category_id', {
        name: 'idx_products_category',
    });
    pgm.addIndex('product_units', 'product_id', {
        name: 'idx_product_units_product',
    });
    pgm.createIndex('product_units', 'product_id', {
        name: 'idx_product_units_sellable',
        where: 'is_sellable = TRUE AND is_active = TRUE',
    });
    pgm.createIndex('product_unit_conversions', 'product_id', {
        name: 'idx_conversions_product',
        where: 'is_active = TRUE',
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropIndex('products', 'category_id', {
    name: 'idx_products_category',
  });

  pgm.dropIndex('product_units', 'product_id', {
    name: 'idx_product_units_product',
  });

  pgm.dropIndex('product_units', 'product_id', {
    name: 'idx_product_units_sellable',
  });

  pgm.dropIndex('product_unit_conversions', 'product_id', {
    name: 'idx_conversions_product',
  });
};
