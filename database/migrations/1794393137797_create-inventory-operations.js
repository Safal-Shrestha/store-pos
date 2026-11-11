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
    pgm.createType('inventory_operation_type', ['purchase', 'sale', 'conversion', 'adjustment', 'return', 'damange', 'consumption', 'opening_balance']);
    pgm.createTable('inventory_operations', {
        inventory_operations_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        operation_type: {
            type: 'inventory_operation_type',
            notNull: true,
        },
        reference_type: {
            type: 'varchar(40)',
        },
        reference_id: {
            type: 'uuid',
        },
        notes: {
            type: 'text',
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: 'now()',
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('inventory_operations');
    pgm.dropType('inventory_operation_type');
};
