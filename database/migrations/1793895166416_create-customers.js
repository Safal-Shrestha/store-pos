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
    pgm.createTable('customers', {
        customer_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        name: {
            type: 'varchar(100)',
            notNull: true,
        },
        phone_number: {
            type: 'text',
            notNull: true,
            unique: true,
        },
        phone_number_secondary: {
            type: 'text',
            unique: true,
        },
        is_active: {
            type: 'boolean',
            notNull: true,
            default: true,
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: pgm.func('now()'),
        },
    });
    pgm.addConstraint('customers', 'chk_phone_e164_format', {
        check: "phone_number ~ '^\\+?[1-9]\\d{3,14}$'",
    });
    pgm.addConstraint('customers', 'chk_phone_secondary_e164_format', {
        check: "phone_number_secondary ~ '^\\+?[1-9]\\d{3,14}$'",
    });
    pgm.addConstraint('customers', 'unique_customer_name_contact', {
        unique: ['name', 'phone_number', 'phone_number_secondary'],
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('customers');
    pgm.dropConstraint('customers', 'chk_phone_e164_format');
    pgm.dropConstraint('customer', 'chk_phone_secondary_e164_format');
    pgm.dropConstraint('customers', 'unique_customer_name_contact');
};
