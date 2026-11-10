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
    pgm.createTable('product_category', {
        product_category_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        parent_id: {
            type: 'uuid',
            default: null,
            references: 'product_category(product_category_id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
        category_name: {
            type: 'varchar(50)',
            notNull: true,
            unique: true,
        },
        category_description: {
            type: 'text',
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
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('product_category');
};
