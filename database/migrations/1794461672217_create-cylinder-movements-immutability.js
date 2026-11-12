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
        `CREATE OR REPLACE FUNCTION prevent_cylinder_movement_mutation()
        RETURNS TRIGGER LANGUAGE plpgsql AS $$
        BEGIN
            RAISE EXCEPTION 'Cylinder movements are immutable; create a compensating movement';
        END;
        $$;

        CREATE TRIGGER trg_cylinder_movement_immutable
        BEFORE UPDATE OR DELETE ON cylinder_inventory_movements
        FOR EACH ROW EXECUTE FUNCTION prevent_cylinder_movement_mutation();`
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(
        `DROP TRIGGER IF EXISTS trg_cylinder_movement_immutable ON cylinder_inventory_movements;
        DROP FUNCTION IF EXISTS prevent_cylinder_movement_mutation();`
    );
};
