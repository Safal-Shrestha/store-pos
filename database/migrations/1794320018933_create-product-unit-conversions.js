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
    pgm.createTable('product_unit_conversions', {
        conversion_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        product_id: {
            type: 'uuid',
            notNull: true,
        },
        from_product_unit_id: {
            type: 'uuid',
            notNull: true,
        },
        to_product_unit_id: {
            type: 'uuid',
            notNull: true,
        },
        conversion_factor: {
            type: 'numeric(20, 6)',
            notNull: true,
            check: 'conversion_factor > 0',
        },
        enabled_for_manual: {
            type: 'boolean',
            notNull: true,
            default: true,
        },
        enabled_for_automatic: {
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
    });
    pgm.addConstraint('product_unit_conversions', 'fk_unit_conversion', {
        foreignKeys: {
            columns: 'product_id',
            references: 'products(product_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    });
    pgm.addConstraint('product_unit_conversions', 'fk_conversion_from', {
        foreignKeys: {
            columns: ['from_product_unit_id', 'product_id'],
            references: 'product_units(product_unit_id, product_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    });
    pgm.addConstraint('product_unit_conversions', 'fk_conversion_to', {
        foreignKeys: {
            columns: ['to_product_unit_id', 'product_id'],
            references: 'product_units(product_unit_id, product_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    });
    pgm.addConstraint('product_unit_conversions', 'chk_conversion_units_differ', {
        check: 'from_product_unit_id <> to_product_unit_id',
    });
    pgm.addConstraint('product_unit_conversions', 'unique_product_conversion', {
        unique: ['from_product_unit_id', 'to_product_unit_id'],
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('product_unit_conversions', 'unique_product_conversion');
    pgm.dropConstraint('product_unit_conversions', 'chk_conversion_units_differ');
    pgm.dropConstraint('product_unit_conversions', 'fk_conversion_to');
    pgm.dropConstraint('product_unit_conversions', 'fk_conversion_from');
    pgm.dropConstraint('product_unit_conversions', 'fk_unit_conversion');
    pgm.dropTable('product_unit_conversions');
};
