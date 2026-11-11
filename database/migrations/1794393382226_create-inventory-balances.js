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
    pgm.createTable('inventory_balances', {
        product_unit_id: {
            type: 'uuid',
            primaryKey: true,
        },
        quantity_on_hand: {
            type: 'numeric(20, 6)',
            notNull: true,
            default: 0,
            check: 'quantity_on_hand >= 0',
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        }
    });
    pgm.addConstraint('inventory_balances', 'fk_inventory_operations_product_units', {
        foreignKeys: {
            columns: 'product_unit_id',
            references: 'product_units(product_unit_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('inventory_balances', 'fk_inventory_operations_product_units');
    pgm.dropTable('inventory_balances');
};
