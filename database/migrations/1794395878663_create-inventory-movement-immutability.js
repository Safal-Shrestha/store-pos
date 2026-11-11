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
    pgm.sql(
        `CREATE OR REPLACE FUNCTION prevent_inventory_movement_mutation()
        RETURNS TRIGGER LANGUAGE plpgsql AS $$
        BEGIN
            RAISE EXCEPTION 'Inventory movements are immutable; create a compensating movement';
        END;
        $$;

        CREATE TRIGGER trg_inventory_movement_immutable
        BEFORE UPDATE OR DELETE ON inventory_movements
        FOR EACH ROW EXECUTE FUNCTION prevent_inventory_movement_mutation();`
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(
        `DROP TRIGGER IF EXISTS trg_inventory_movement_immutable ON inventory_movements;
        DROP FUNCTION IF EXISTS prevent_inventory_movement_mutation();`
    );
};
