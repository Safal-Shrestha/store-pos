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
    pgm.createTable('cylinder_types', {
        cylinder_type_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        brand: {
            type: 'varchar(100)',
            notNull: true,
        },
        name: {
            type: 'varchar(100)',
            notNull: true,
        },
        capacity_kg: {
            type: 'numeric (10, 3)',
            notNull: true,
            check: 'capacity_kg > 0',
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
    pgm.addConstraint('cylinder_types', 'unique_cylinder_type', {
        unique: ['brand', 'name', 'capacity_kg'],
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('cylinder_types', 'unique_cylinder_type');
    pgm.dropTable('cylinder_types');
};
