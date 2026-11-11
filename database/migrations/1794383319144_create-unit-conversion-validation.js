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
        `CREATE OR REPLACE FUNCTION validate_product_unit_conversion()
        RETURNS TRIGGER LANGUAGE plpgsql AS $$
        DECLARE
            v_from_base NUMERIC(20, 6);
            v_to_base   NUMERIC(20, 6);
        BEGIN
            SELECT base_quantity INTO v_from_base
            FROM product_units
            WHERE id = NEW.from_product_unit_id AND product_id = NEW.product_id;

            SELECT base_quantity INTO v_to_base
            FROM product_units
            WHERE id = NEW.to_product_unit_id AND product_id = NEW.product_id;

            IF v_from_base IS NULL OR v_to_base IS NULL THEN
                RAISE EXCEPTION 'Conversion units must belong to the selected product';
            END IF;

            IF ABS(v_from_base - (NEW.conversion_factor * v_to_base)) > 0.000001 THEN
                RAISE EXCEPTION
                    'Conversion factor % is inconsistent: source base quantity %, destination base quantity %',
                    NEW.conversion_factor, v_from_base, v_to_base;
            END IF;

            RETURN NEW;
        END;
        $$;

        CREATE TRIGGER trg_validate_product_unit_conversion
        BEFORE INSERT OR UPDATE ON product_unit_conversions
        FOR EACH ROW EXECUTE FUNCTION validate_product_unit_conversion();`
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(
        `DROP TRIGGER IF EXISTS trg_validate_product_unit_conversion ON product_unit_conversions; 
        DROP FUNCTION IF EXISTS validate_product_unit_conversion();`
    );
};
