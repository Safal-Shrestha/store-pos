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
        `CREATE OR REPLACE FUNCTION validate_product_unit()
        RETURNS TRIGGER LANGUAGE plpgsql AS $$
        DECLARE
            v_product_type TEXT;
        BEGIN
            SELECT product_type INTO v_product_type
            FROM products WHERE id = NEW.product_id;

            IF NOT FOUND THEN
                RAISE EXCEPTION 'Product % does not exist', NEW.product_id;
            END IF;

            IF v_product_type = 'SERVICE' AND NEW.is_stockable THEN
                RAISE EXCEPTION 'Service product units cannot be stockable';
            END IF;

            RETURN NEW;
        END;
        $$;

        CREATE TRIGGER trg_validate_product_unit
        BEFORE INSERT OR UPDATE ON product_units
        FOR EACH ROW EXECUTE FUNCTION validate_product_unit()`
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(
        `DROP TRIGGER IF EXISTS trg_validate_product_unit ON product_units;
        DROP FUNCTION IF EXISTS validate_product_unit();`
    );
};
