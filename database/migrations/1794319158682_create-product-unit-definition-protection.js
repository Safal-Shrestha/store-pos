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
        `CREATE OR REPLACE FUNCTION protect_product_unit_definition()
        RETURNS TRIGGER LANGUAGE plpgsql AS $$
        BEGIN
            IF NEW.product_id IS DISTINCT FROM OLD.product_id
            OR NEW.base_quantity IS DISTINCT FROM OLD.base_quantity THEN
                IF EXISTS (
                    SELECT 1 FROM inventory_movements
                    WHERE product_unit_id = OLD.id
                ) OR EXISTS (
                    SELECT 1 FROM product_unit_conversions
                    WHERE from_product_unit_id = OLD.id
                    OR to_product_unit_id = OLD.id
                ) THEN
                    RAISE EXCEPTION
                        'Product unit % is already referenced by inventory or conversions; deactivate it and create a new unit',
                        OLD.id;
                END IF;
            END IF;
            RETURN NEW;
        END;
        $$;

        CREATE TRIGGER trg_protect_product_unit_definition
        BEFORE UPDATE ON product_units
        FOR EACH ROW EXECUTE FUNCTION protect_product_unit_definition();`
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(
        `DROP TRIGGER IF EXISTS trg_protect_product_unit_definition ON product_units;
        DROP FUNCTION IF EXISTS protect_product_unit_definition();`
    );
};
