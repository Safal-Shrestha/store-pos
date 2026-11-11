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
    pgm.createTable('inventory_movements', {
        inventory_movements_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        operation_id: {
            type: 'uuid',
            notNull: true,
        },
        product_unit_id: {
            type: 'uuid',
            notNull: true,
        },
        quantity_delta: {
            type: 'numeric(20, 6)',
            notNull: true,
            check: 'quantity_delta <> 0',
        },
        unit_cost: {
            type: 'numeric(14, 4)',
            check: 'unit_cost IS NULL OR unit_cost >= 0',
        },
        notes: {
            type: 'text',
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
    });
    pgm.addConstraint('inventory_movements', 'fk_inventory_movements_operation', {
        foreignKeys: {
            columns: 'operation_id',
            references: 'inventory_operations(inventory_operations_id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    });
    pgm.addConstraint('inventory_movements', 'fk_inventory_movements_product_unit', {
        foreignKeys: {
            columns: 'product_unit_id',
            references: 'product_units(product_unit_id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    });
    pgm.addIndex('inventory_movements', ['product_unit_id', { name: 'created_at', sort: 'DESC' },], {
        name: 'idx_inventory_movements_unit_date',
    });
    pgm.addIndex('inventory_movements', 'operation_id', {
        name: 'idx_inventory_movements_operation',
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropIndex('inventory_movements', 'operation_id', {
        name: 'idx_inventory_movements_operation',
    });
    pgm.dropIndex('inventory_movements', ['product_unit_id', { name: 'created_at', sort: 'DESC' },], {
        name: 'idx_inventory_movements_unit_date',
    });
    pgm.dropConstraint('inventory_movements', 'fk_inventory_movements_product_unit');
    pgm.dropTable('inventory_movements');
};
