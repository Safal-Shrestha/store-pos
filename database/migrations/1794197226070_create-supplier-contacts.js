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
    pgm.createTable('supplier_contacts', {
        supplier_contact_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        supplier_id: {
            type: 'uuid',
            notNull: true,
        },
        name: {
            type: 'varchar(100)',
            notNull: true,
        },
        role: {
            type: 'text',
        },
        description: {
            type: 'text',
        },
        phone_number: {
            type: 'text',
            notNull: true,
            unique: true
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
    pgm.addConstraint('supplier_contacts', 'chk_phone_e164_format', {
        check: "phone_number ~ '^\\+?[1-9]\\d{3,14}$'",
    });
    pgm.addConstraint('supplier_contacts', 'chk_phone_secondary_e164_format', {
        check: "phone_number_secondary ~ '^\\+?[1-9]\\d{3,14}$'",
    });
    pgm.addConstraint('supplier_contacts', 'fk_supplier_contacts', {
        foreignKeys: {
            columns: 'supplier_id',
            references: 'suppliers(supplier_id)',
            onDelete: 'CASCADE',
            onUpdate: 'CASCADE',
        },
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('supplier_contacts', 'fk_supplier_contacts');
    pgm.dropConstraint('supplier_contacts', 'chk_phone_e164_format');
    pgm.dropConstraint('supplier_contacts', 'chk_phone_secondary_e164_format');
    pgm.dropTable('supplier_contacts');
};
