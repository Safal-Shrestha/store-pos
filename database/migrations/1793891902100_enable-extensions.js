/**
 * @type {import('node-pg-migrate').ColumnDefinitions | undefined}
 */
export const shorthands = undefined;

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const up = async (pgm) => {
    pgm.createSchema('extensions', {ifNotExists: true});

    pgm.createExtension('pgcrypto', {
        ifNotExists: true,
        schema: 'extensions',
    });
    pgm.createExtension('btree_gist', {
        ifNotExists: true,
        schema: 'extensions',
    });

    const [{ current_user: currentUser }] = await pgm.db.select('SELECT current_user;');
    pgm.sql(
        `ALTER ROLE "${currentUser}" SET search_path TO "$user", public, extensions;`
    );
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = async (pgm) => {
    const [{ current_user: currentUser }] = await pgm.db.select('SELECT current_user;');
    pgm.sql(
        `ALTER ROLE "${currentUser}" SET search_path TO "$user", public`
    );

    pgm.dropExtension('btree_gist', {
        ifExists: true,
        cascade: true,
    });
    pgm.dropExtension('pgcrypto', {
        ifExists: true,
        cascade: true,
    });

    pgm.dropSchema('extensions', {
        ifExists: true,
        cascade: true,
    });
};
