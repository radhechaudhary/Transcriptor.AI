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
    pgm.createTable('users', {
        gmail: {
            type: "varchar(50)",
            primaryKey: true
        },
        name: {
            type: "varchar(50)",
            notNull: true
        },
        password: {
            type: "varchar",
            notNull: true
        },
        meetings: {
            type: "integer",
            default: 0
        },
        queries: {
            type: "integer",
            default: 0
        }
    });
    pgm.createTable('meetings', {
        meeting_id: {
            type: "varchar(100)",
            primaryKey: true
        },
        gmail: {
            type: "varchar(50)",
            primaryKey: true
        },
        name: {
            type: "varchar",
        },
        queries: {
            type: "integer",
            default: 0
        },
        duration: {
            type: "integer",
            notNull: true
        },
        date_time: {
            type: "varchar",
            notNull: true
        }
    });
    pgm.createTable('meeting_info', {
        meeting_id: {
            type: "varchar(100)",
            primaryKey: true
        },
        gmail: {
            type: "varchar(50)",
            primaryKey: true,
        },
        insights: {
            type: "varchar[]",
            notNull: true
        },
        topic: {
            type: "varchar[]",
            notNull: true
        },
        decisions_made: {
            type: "varchar[]",
            notNull: true,
        },
        summary: {
            type: "varchar",
            notNull: true,
            default: ""
        }
    });
    pgm.createTable('chunk_summaries', {
        meeting_id: {
            type: "varchar(100)",
            primaryKey: true
        },
        seuence_number: {
            type: 'integer',
            primaryKey: true
        },
        summary: {
            type: 'text',
            notNull: true
        },
        start_chunk_id: {
            type: 'varchar',
        },
        end_chunk_id: {
            type: 'varchar',
        },
        created_at: {
            type: 'timestamp',
            default: pgm.func("now()")
        }
    });
};

/**
 * @param pgm {import('node-pg-migrate').MigrationBuilder}
 * @param run {() => void | undefined}
 * @returns {Promise<void> | void}
 */
export const down = (pgm) => {
    pgm.dropTable('chunk_summaries');
    pgm.dropTable('meeting_info');
    pgm.dropTable('meetings');
    pgm.dropTable('users');
};
