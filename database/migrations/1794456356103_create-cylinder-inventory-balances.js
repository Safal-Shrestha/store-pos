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
    pgm.createType('cylinder_status_types', ['empty', 'filled', 'damaged', 'with_dealer']);
    pgm.createTable('cylinder_inventory_balances', {
        cylinder_type_id: {
            type: 'uuid',
            notNull: true,
        },
        cylinder_status: {
            type: 'cylinder_status_types',
            notNull: true,
        },
        quantity_on_hand: {
            type: 'numeric(14, 3)',
            notNull: true,
            default: 0,
            check: 'quantity_on_hand >= 0',
        },
        updated_at: {
            type: 'timestamptz',
            notNull: true,
            default: 'now()',
        },
    });
    pgm.createConstraint('cylinder_inventory_balances', 'fk_cylinder_inventory_type', {
        foreignKeys: {
            columns: 'cylinder_type_id',
            references: 'cylinder_types(cylinder_type_id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    });
    pgm.createConstraint('cylinder_inventory_balances', 'pk_cylinder_inventory_balances', {
        primaryKey: ['cylinder_type_id', 'cylinder_status'],
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('cylinder_inventory_balances', 'pk_cylinder_inventory_balances');
    pgm.dropConstraint('cylinder_inventory_balances', 'fk_cylinder_inventory_type');
    pgm.dropTable('cylinder_inventory_balances');
    pgm.dropType('cylinder_status_types', {cascade: true});
};
