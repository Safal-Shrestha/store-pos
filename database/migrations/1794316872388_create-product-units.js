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
    pgm.createTable('product_units', {
        product_unit_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        product_id: {
            type: 'uuid',
            notNull: true,
        },
        unit_id: {
            type: 'uuid',
            notNull: true,
        },
        name: {
            type: 'varchar(100)',
            notNull: true,
        },
        base_quantity: {
            type: 'numeric(20, 6)',
            notNull: true,
            check: 'base_quantity > 0',
        },
        barcode: {
            type: 'varchar(100)',
        },
        is_sellable: {
            type: 'boolean',
            notNull: true,
            default: true,
        },
        is_purchasable: {
            type: 'boolean',
            notNull: true,
            default: true,
        },
        is_stockable: {
            type: 'boolean',
            notNull: true,
            default: true,
        },
        is_default_sale_unit: {
            type: 'boolean',
            notNull: true,
            default: false,
        },
        is_active: {
            type: 'boolean',
            notNull: true,
            default: true,
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        updated_at: {  
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
    });
    pgm.addConstraint('product_units', 'unique_product_unit_name', {
        unique: ['product_id', 'name'],
    });
    pgm.addConstraint('product_units', 'unique_product_unit_id_product', {
        unique: ['product_unit_id', 'product_id'],
    });
    pgm.addConstraint('product_units', 'fk_product_product_unit', {
        foreignKeys: {
            columns: 'product_id',
            references: 'products(product_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    });
    pgm.addConstraint('product_units', 'fk_product_units_uom', {
        foreignKeys: {
            columns: 'unit_id',
            references: 'units_of_measure(measure_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    });
    pgm.createIndex('product_units', 'product_id', {
        name: 'unique_product_default_sale_unit',
        unique: true,
        where: 'is_default_sale_unit = TRUE',
    });

    pgm.createIndex('product_units', 'barcode', {
        name: 'unique_product_unit_barcode',
        unique: true,
        where: 'barcode IS NOT NULL',
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('product_units', 'fk_product_units_uom');
    pgm.dropConstraint('product_units', 'fk_product_product_unit');
    pgm.dropConstraint('product_units', 'unique_product_unit_id_product');
    pgm.dropConstraint('product_units', 'unique_product_unit_name');
    pgm.dropTable('product_units');
};
