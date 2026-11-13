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
    pgm.createType('operation_status_type', ['draft', 'posted', 'reversed']);
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
        status: {
            type: 'operation_status_type',
            notNull: true,
            default: 'posted',
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: 'now()',
        },
    });
    pgm.createIndex('inventory_operations', ['reference_type', 'reference_id'], {
        name: 'unique_inventory_operation_reference',
        unique: true,
        where: 'reference_type IS NOT NULL AND reference_id IS NOT NULL',
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropIndex('inventory_operations', ['reference_type', 'reference_id'], {
        name: 'uq_inventory_operation_reference',
        ifExists: true,
    });
    pgm.dropTable('inventory_operations');
    pgm.dropType('operation_status_type');
    pgm.dropType('inventory_operation_type');
};
