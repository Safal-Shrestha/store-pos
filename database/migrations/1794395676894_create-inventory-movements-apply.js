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
        `CREATE OR REPLACE FUNCTION apply_inventory_movement()
        RETURNS TRIGGER LANGUAGE plpgsql AS $$
        DECLARE
            v_stockable BOOLEAN;
        BEGIN
            SELECT is_stockable INTO v_stockable
            FROM product_units WHERE id = NEW.product_unit_id;

            IF NOT FOUND OR NOT v_stockable THEN
                RAISE EXCEPTION 'Inventory movements require a stockable product unit';
            END IF;

            INSERT INTO inventory_balances(product_unit_id, quantity_on_hand, updated_at)
            VALUES (NEW.product_unit_id, NEW.quantity_delta, NOW())
            ON CONFLICT (product_unit_id)
            DO UPDATE SET
                quantity_on_hand = inventory_balances.quantity_on_hand + EXCLUDED.quantity_on_hand,
                updated_at = NOW();

            RETURN NEW;
        END;
        $$;

        CREATE TRIGGER trg_apply_inventory_movement
        AFTER INSERT ON inventory_movements
        FOR EACH ROW EXECUTE FUNCTION apply_inventory_movement();`
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(
        `DROP TRIGGER IF EXISTS trg_apply_inventory_movement ON inventory_movements;
        DROP FUNCTION IF EXISTS apply_inventory_movement();`
    )
};
