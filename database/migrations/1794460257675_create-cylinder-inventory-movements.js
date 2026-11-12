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
    pgm.createTable('cylinder_inventory_movements', {
        cylinder_inventory_movement_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        operation_id: {
            type: 'uuid',
            notNull: true,
        },
        cylinder_type_id: {
            type: 'uuid',
            notNull: true,
        },
        cylinder_status: {
            type: 'cylinder_status_types',
            notNull: true,
        },
        quantity_delta: {
            type: 'numeric(14, 3)',
            notNull: true,
            check: 'quantity_delta <> 0',
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
    });
    pgm.addConstraint('cylinder_inventory_movements', 'fk_gas_movements_operation', {
        foreignKeys: {
            columns: 'operation_id',
            references: 'cylinder_inventory_operations(cylinder_inventory_operation_id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    });
    pgm.addConstraint('cylinder_inventory_movements', 'fk_cylinder_type_movement', {
        foreignKeys: {
            columns: 'cylinder_type_id',
            references: 'cylinder_types(cylinder_type_id)',
            onDelete: 'SET NULL',
            onUpdate: 'CASCADE',
        },
    });
    pgm.sql(
        `CREATE OR REPLACE FUNCTION apply_cylinder_inventory_movement()
        RETURNS TRIGGER LANGUAGE plpgsql AS $$
        BEGIN
            INSERT INTO cylinder_inventory_balances(
                cylinder_type_id, cylinder_status, quantity_on_hand, updated_at
            )
            VALUES (
                NEW.cylinder_type_id, NEW.cylinder_status, NEW.quantity_delta, NOW()
            )
            ON CONFLICT (cylinder_type_id, cylinder_status)
            DO UPDATE SET
                quantity_on_hand =
                    cylinder_inventory_balances.quantity_on_hand + EXCLUDED.quantity_on_hand,
                updated_at = NOW();

            RETURN NEW;
        END;
        $$;

        CREATE TRIGGER trg_apply_cylinder_inventory_movement
        AFTER INSERT ON cylinder_inventory_movements
        FOR EACH ROW EXECUTE FUNCTION apply_cylinder_inventory_movement();`
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(
        `DROP TRIGGER IF EXISTS trg_apply_cylinder_inventory_movement ON cylinder_inventory_movements;
        DROP FUNCTION IF EXISTS apply_cylinder_inventory_movement();`
    );
    pgm.dropConstraint('cylinder_inventory_movements', 'fk_cylinder_type_movement');
    pgm.dropConstraint('cylinder_inventory_movements', 'fk_gas_movements_operation');
    pgm.dropTable('cylinder_inventory_movements');
};
