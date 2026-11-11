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
    pgm.createType('product_type', ['goods', 'service', 'gas']);
    pgm.createTable('products', {
        product_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        category_id: {
            type: 'uuid',
            notNull: true,
        },
        name: {
            type: 'varchar(150)',
            notNull: true,
        },
        description: {
            type: 'text',
        },
        product_type: {
            type: 'product_type',
            notNull: true,
            default: 'goods',
        },
        base_uom_id: {
            type: 'uuid',
            notNull: true,
        },
        auto_conversion_enabled: {
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
    pgm.addConstraint('products', 'fk_product_category', {
        foreignKeys: {
            columns: 'category_id',
            references: 'product_category(product_category_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    });
    pgm.addConstraint('products', 'fk_product_unit_of_measurement', {
        foreignKeys: {
            columns: 'base_uom_id',
            references: 'units_of_measure(measure_id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('products', 'fk_product_unit_of_measurement');
    pgm.dropConstraint('products', 'fk_product_category');
    pgm.dropTable('products');
    pgm.dropType('product_type');
};
