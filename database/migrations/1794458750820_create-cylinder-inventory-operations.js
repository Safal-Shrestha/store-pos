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
    pgm.createType('gas_operation_types', ['purchase', 'sale', 'exhange', 'return', 'dealer_transfer', 'adjustment']);
    pgm.createTable('cylinder_inventory_operations', {
        cylinder_inventory_operation_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        operation_type: {
            type: 'gas_operation_types',
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
            default: pgm.func('now()'),
        },
    });
    pgm.createIndex('cylinder_inventory_operations', ['reference_type', 'reference_id'], {
        name: 'unique_cylinder_operation_reference',
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
    pgm.dropIndex('cylinder_inventory_operations', ['reference_type', 'reference_id'], {
        name: 'uq_cylinder_operation_reference',
        ifExists: true,
    });
    pgm.dropTable('cylinder_inventory_operations');
    pgm.dropType('gas_operation_types');
};
