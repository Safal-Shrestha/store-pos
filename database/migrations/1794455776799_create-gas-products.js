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
    pgm.createType('fill_level_types', ['full', 'half', 'other']);
    pgm.createTable('gas_products', {
        product_id: {
            type: 'uuid',
            primaryKey: true,
        },
        cylinder_type_id: {
            type: 'uuid',
            notNull: true,
        },
        fill_quantity_kg: {
            type: 'numeric(10, 3)',
            notNull: true,
            check: 'fill_quantity_kg > 0',
        },
        fill_level: {
            type: 'fill_level_types',
            notNull: true,
        },
        is_active: {
            type: 'boolean',
            notNull: true,
            default: true,
        },
    });
    pgm.addConstraint('gas_products', 'fk_gas_product', {
        foreignKeys: {
            columns: 'product_id',
            references: 'products(product_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    });
    pgm.addConstraint('gas_products', 'fk_gas_product_type', {
        foreignKeys: {
            columns: 'cylinder_type_id',
            references: 'cylinder_types(cylinder_type_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    });
    pgm.sql(
        `CREATE OR REPLACE FUNCTION validate_gas_product()
        RETURNS TRIGGER LANGUAGE plpgsql AS $$
        DECLARE
            v_product_type TEXT;
        BEGIN
            SELECT product_type INTO v_product_type
            FROM products WHERE id = NEW.product_id;

            IF NOT FOUND OR v_product_type <> 'GOODS' THEN
                RAISE EXCEPTION 'Gas refill products must reference an existing GOODS product';
            END IF;

            RETURN NEW;
        END;
        $$;

        CREATE TRIGGER trg_validate_gas_product
        BEFORE INSERT OR UPDATE ON gas_products
        FOR EACH ROW EXECUTE FUNCTION validate_gas_product();`
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.sql(
        `DROP TRIGGER IF EXISTS trg_validate_gas_product ON gas_products;
        DROP FUNCTION IF EXISTS validate_gas_product();`
    );
    pgm.dropConstraint('gas_products', 'fk_gas_product_type');
    pgm.dropConstraint('gas_products', 'fk_gas_product');
    pgm.dropTable('gas_products');
    pgm.dropType('fill_level_types');
};
