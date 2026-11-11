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
    pgm.createType('product_price_types', ['retail', 'wholesale', 'dealer']);
    pgm.createTable('product_prices', {
        prices_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        product_unit_id: {
            type: 'uuid',
            notNull: true,
        },
        price_type: {
            type: 'product_price_types',
            notNull: true,
            default: 'retail',
        },
        currency_code: {
            type: 'char(3)',
            notNull: true,
            default: 'NPR',
        },
        selling_price: {
            type: 'numeric(14, 2)',
            not: true,
            check: 'selling_price > 0',
        },
        valid_from: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
        valid_until: {
            type: 'timestamptz',
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
    pgm.addConstraint('product_prices', "fk_product_prices_unit", {
        foreignKeys: {
            columns: 'product_unit_id',
            references: 'product_units(product_unit_id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    });
    pgm.addConstraint('product_prices', 'chk_price_validity', {
        check: 'valid_until IS NULL OR valid_until > valid_from',
    });
    pgm.addConstraint('product_prices', 'exclude_product_price_period', {
        exclude: `USING gist (
            product_unit_id WITH =,
            price_type WITH =,
            currency_code WITH =,
            tstzrange(valid_from, valid_until, '[)') WITH &&
        ) WHERE (is_active = TRUE)`
    });
    pgm.createIndex('product_prices', ['product_unit_id', 'price_type', { name: 'valid_from', sort: 'DESC' },], {
        name: 'idx_product_prices_lookup',
        where: 'is_active = TRUE',
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropIndex('product_prices',
        [
        'product_unit_id',
        'price_type',
        { name: 'valid_from', sort: 'DESC' },
        ],
        {
        name: 'idx_product_prices_lookup',
        where: 'is_active = TRUE',
        }
    );
    pgm.dropConstraint('product_prices', 'exclude_product_price_period');
    pgm.dropConstraint('product_prices', 'chk_price_validity');
    pgm.dropTable('product_prices');
    pgm.dropType('product_price_types');
};
