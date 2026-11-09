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
    pgm.createTable('suppliers', {
        supplier_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        supplier_name: {
            type: 'varchar(100)',
            notNull: true,
        },
        category_id: {
            type: 'uuid',
            notNull: true,
        },
        tax_id: {
            type: 'varchar(9)',
            notNull: true,
            unique: true,
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
    pgm.addConstraint('suppliers', 'fk_supplier_category', {
        foreignKeys: {
            columns: 'category_id',
            references: 'supplier_category(supplier_category_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    });
    pgm.addConstraint('suppliers', 'chk_vat_num_length', {
        check: "tax_id ~ '^[0-9]{9}$'",
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('suppliers', 'chk_vat_num_length');
    pgm.dropConstraint('suppliers', 'fk_supplier_category');
    pgm.dropTable('suppliers');
};
