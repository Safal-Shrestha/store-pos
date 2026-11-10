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
    pgm.createType('unit_category_type', ['count', 'mass', 'volume', 'length', 'time', 'service']);
    pgm.createTable('units_of_measure', {
        measure_id: {
            type: 'uuid',
            primaryKey: true,
            default: pgm.func('gen_random_uuid()'),
        },
        name: {
            type: 'varchar(60)',
            notNull: true,
        },
        abbreviation: {
            type: 'varchar(0)',
            notNull: true,
            unique: true,
        },
        unit_category: {
            type: 'unit_category_type',
            notNull: true
        },
        is_active: {
            type: 'boolean',
            notNull: true,
            default: true
        },
        created_at: {
            type: 'timestamptz',
            notNull: true,
            default: 'now()',
        },
    });
    pgm.addConstraint('units_of_measure', 'unique_units_name_category', {
        unique: ['name', 'unit_category'],
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropConstraint('units_of_measure', 'unique_units_name_category');
    pgm.dropTable('units_of_measure');
    pgm.dropType('unit_category_type');
};
