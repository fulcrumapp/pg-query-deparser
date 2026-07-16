import assert from 'assert';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Deparser } from '../src/index.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const fixturesDir = path.join(__dirname, 'fixtures', 'modern-parse');

const loadFixture = (name) => {
  const raw = fs.readFileSync(path.join(fixturesDir, `${name}.json`), 'utf8');
  return JSON.parse(raw);
};

const deparseStmt = (stmt) => Deparser.deparse([stmt]);

const normalizeSql = (sql) => sql.replace(/\s+/g, ' ').trim();

const deparseLockingClause = ({ strength, waitPolicy, op = 0 }) => {
  return normalizeSql(Deparser.deparse([
    {
      SelectStmt: {
        targetList: [
          {
            ResTarget: {
              val: {
                A_Star: {},
              },
            },
          },
        ],
        fromClause: [
          {
            RangeVar: {
              relname: 't',
            },
          },
        ],
        lockingClause: [
          {
            LockingClause: {
              strength,
              waitPolicy,
            },
          },
        ],
        op,
      },
    },
  ]));
};

describe('modern parse AST compatibility', () => {
  it('deparses simple select from modern parse fixture', () => {
    const { stmt } = loadFixture('select-simple');
    assert.strictEqual(normalizeSql(deparseStmt(stmt)), 'SELECT "a" FROM "t"');
  });

  it('deparses column aliases from modern parse fixture', () => {
    const { stmt } = loadFixture('select-column-alias');
    assert.strictEqual(normalizeSql(deparseStmt(stmt)), 'SELECT "a" AS "x" FROM "t"');
  });

  it('deparses bare table aliases from modern parse fixture', () => {
    const { stmt } = loadFixture('select-table-alias');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, 'SELECT "a" FROM "t" AS "tbl"');
  });

  it('deparses ORDER BY DESC NULLS LAST with string enums', () => {
    const { stmt } = loadFixture('select-order-desc-nulls-last');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, 'SELECT "a" FROM "t" ORDER BY "a" DESC NULLS LAST');
  });

  it('deparses ORDER BY ASC NULLS FIRST with string enums', () => {
    const { stmt } = loadFixture('select-order-asc-nulls-first');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, 'SELECT "a" FROM "t" ORDER BY "a" ASC NULLS FIRST');
  });

  it('deparses LIMIT/OFFSET from modern parse fixture', () => {
    const { stmt } = loadFixture('select-limit-offset');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, 'SELECT "a" FROM "t" LIMIT 10 OFFSET 5');
  });

  it('deparses UNION with string set-op enum', () => {
    const { stmt } = loadFixture('select-union');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, '(SELECT "a" FROM "t") UNION (SELECT "b" FROM "u")');
  });

  it('deparses UNION ALL with string set-op enum', () => {
    const { stmt } = loadFixture('select-union-all');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, '(SELECT "a" FROM "t") UNION ALL (SELECT "b" FROM "u")');
  });

  it('deparses INTERSECT with string set-op enum', () => {
    const { stmt } = loadFixture('select-intersect');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, '(SELECT "a" FROM "t") INTERSECT (SELECT "b" FROM "u")');
  });

  it('deparses EXCEPT with string set-op enum', () => {
    const { stmt } = loadFixture('select-except');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, '(SELECT "a" FROM "t") EXCEPT (SELECT "b" FROM "u")');
  });

  it('deparses EXCEPT ALL with string set-op enum', () => {
    const { stmt } = loadFixture('select-except-all');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, '(SELECT "a" FROM "t") EXCEPT ALL (SELECT "b" FROM "u")');
  });

  it('deparses bare subselect aliases from modern parse fixture', () => {
    const { stmt } = loadFixture('select-subselect-alias');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, 'SELECT * FROM (SELECT "a" FROM "t") AS "sub"');
  });

  it('deparses IS NULL with string nulltesttype', () => {
    const { stmt } = loadFixture('select-is-null');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, 'SELECT "a" FROM "t" WHERE "a" IS NULL');
  });

  it('deparses IS NOT NULL with string nulltesttype', () => {
    const { stmt } = loadFixture('select-is-not-null');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, 'SELECT "a" FROM "t" WHERE "a" IS NOT NULL');
  });

  it('deparses GREATEST/LEAST with string MinMaxExpr op', () => {
    const { stmt } = loadFixture('select-greatest-least');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, 'SELECT GREATEST(1, 2), LEAST(3, 4)');
  });

  it('rejects unknown MinMaxExpr enum values', () => {
    assert.throws(() => {
      Deparser.deparse([
        {
          SelectStmt: {
            targetList: [
              {
                ResTarget: {
                  val: {
                    MinMaxExpr: {
                      op: 'IS_NOT_A_REAL_ENUM',
                      args: [
                        { A_Const: { val: { Integer: { ival: 1 } } } },
                        { A_Const: { val: { Integer: { ival: 2 } } } },
                      ],
                    },
                  },
                },
              },
            ],
            op: 0,
          },
        },
      ]);
    }, /Unhandled enum value/);
  });

  it('rejects MinMaxExpr when op is missing', () => {
    assert.throws(() => {
      Deparser.deparse([
        {
          SelectStmt: {
            targetList: [
              {
                ResTarget: {
                  val: {
                    MinMaxExpr: {
                      args: [
                        { A_Const: { val: { Integer: { ival: 1 } } } },
                        { A_Const: { val: { Integer: { ival: 2 } } } },
                      ],
                    },
                  },
                },
              },
            ],
            op: 0,
          },
        },
      ]);
    }, /Unhandled MinMaxExpr node/);
  });

  it('rejects unknown NullTest enum values', () => {
    assert.throws(() => {
      Deparser.deparse([
        {
          SelectStmt: {
            targetList: [
              {
                ResTarget: {
                  val: {
                    ColumnRef: {
                      fields: [{ String: { str: 'a' } }],
                    },
                  },
                },
              },
            ],
            whereClause: {
              NullTest: {
                arg: {
                  ColumnRef: {
                    fields: [{ String: { str: 'a' } }],
                  },
                },
                nulltesttype: 'NOPE',
              },
            },
            fromClause: [
              {
                RangeVar: {
                  relname: 't',
                },
              },
            ],
            op: 0,
          },
        },
      ]);
    }, /Unhandled enum value/);
  });

  it('rejects unknown set operation enum values', () => {
    assert.throws(() => {
      Deparser.deparse([
        {
          SelectStmt: {
            op: 'NOT_A_SET_OP',
            larg: {
              SelectStmt: {
                targetList: [
                  {
                    ResTarget: {
                      val: {
                        ColumnRef: {
                          fields: [{ String: { str: 'a' } }],
                        },
                      },
                    },
                  },
                ],
                fromClause: [
                  {
                    RangeVar: {
                      relname: 't',
                    },
                  },
                ],
                op: 0,
              },
            },
            rarg: {
              SelectStmt: {
                targetList: [
                  {
                    ResTarget: {
                      val: {
                        ColumnRef: {
                          fields: [{ String: { str: 'b' } }],
                        },
                      },
                    },
                  },
                ],
                fromClause: [
                  {
                    RangeVar: {
                      relname: 'u',
                    },
                  },
                ],
                op: 0,
              },
            },
          },
        },
      ]);
    }, /Unhandled enum value/);
  });

  it('deparses FOR UPDATE with string lock strength', () => {
    const { stmt } = loadFixture('select-for-update');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, 'SELECT * FROM "t" FOR UPDATE');
  });

  [
    {
      name: 'deparses SKIP LOCKED with string waitPolicy',
      input: { strength: 'LCS_FORUPDATE', waitPolicy: 'LockWaitSkip', op: 'SETOP_NONE' },
      expected: 'SELECT * FROM "t" FOR UPDATE SKIP LOCKED',
    },
    {
      name: 'deparses NOWAIT with numeric waitPolicy',
      input: { strength: 4, waitPolicy: 2, op: 0 },
      expected: 'SELECT * FROM "t" FOR UPDATE NOWAIT',
    },
  ].forEach(({ name, input, expected }) => {
    it(name, () => {
      assert.strictEqual(deparseLockingClause(input), expected);
    });
  });

  [
    {
      name: 'rejects LockingClause with numeric NONE strength',
      strength: 0,
    },
    {
      name: 'rejects LockingClause with string NONE strength',
      strength: 'LCS_NONE',
    },
    {
      name: 'rejects LockingClause with inherited toString strength',
      strength: 'toString',
    },
    {
      name: 'rejects LockingClause with inherited constructor strength',
      strength: 'constructor',
    },
  ].forEach(({ name, strength }) => {
    it(name, () => {
      assert.throws(() => {
        deparseLockingClause({ strength });
      }, /Unhandled LockingClause node/);
    });
  });

  it('deparses EXISTS with string subLinkType', () => {
    const { stmt } = loadFixture('select-exists');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, 'SELECT "a" FROM "t" WHERE EXISTS (SELECT 1 FROM "u")');
  });

  it('deparses IN subquery with string ANY_SUBLINK', () => {
    const { stmt } = loadFixture('select-in-subquery');
    const sql = normalizeSql(deparseStmt(stmt));
    assert.strictEqual(sql, 'SELECT "a" FROM "t" WHERE "a" IN (SELECT "b" FROM "u")');
  });

  it('still deparses legacy numeric enums and wrapped Alias nodes', () => {
    const legacy = {
      SelectStmt: {
        targetList: [
          {
            ResTarget: {
              val: {
                ColumnRef: {
                  fields: [{ String: { str: 'a' } }],
                },
              },
            },
          },
        ],
        fromClause: [
          {
            RangeVar: {
              relname: 't',
              alias: {
                Alias: {
                  aliasname: 'tbl',
                },
              },
            },
          },
        ],
        sortClause: [
          {
            SortBy: {
              node: {
                ColumnRef: {
                  fields: [{ String: { str: 'a' } }],
                },
              },
              sortby_dir: 2,
              sortby_nulls: 2,
            },
          },
        ],
        op: 0,
      },
    };

    const sql = normalizeSql(deparseStmt(legacy));
    assert.strictEqual(sql, 'SELECT "a" FROM "t" AS "tbl" ORDER BY "a" DESC NULLS LAST');
  });

  it('still deparses legacy wrapped SelectStmt set-op arms', () => {
    const legacy = {
      SelectStmt: {
        op: 1,
        larg: {
          SelectStmt: {
            targetList: [
              {
                ResTarget: {
                  val: {
                    ColumnRef: {
                      fields: [{ String: { str: 'a' } }],
                    },
                  },
                },
              },
            ],
            fromClause: [
              {
                RangeVar: {
                  relname: 't',
                },
              },
            ],
            op: 0,
          },
        },
        rarg: {
          SelectStmt: {
            targetList: [
              {
                ResTarget: {
                  val: {
                    ColumnRef: {
                      fields: [{ String: { str: 'b' } }],
                    },
                  },
                },
              },
            ],
            fromClause: [
              {
                RangeVar: {
                  relname: 'u',
                },
              },
            ],
            op: 0,
          },
        },
      },
    };

    const sql = normalizeSql(deparseStmt(legacy));
    assert.strictEqual(sql, '(SELECT "a" FROM "t") UNION (SELECT "b" FROM "u")');
  });

  it('rejects adversarial non-alias objects without crashing into Alias path', () => {
    assert.throws(() => {
      Deparser.deparse([{ NotARealNode: { foo: 1 } }]);
    }, /NotARealNode is not implemented/);
  });

  it('does not treat objects with extra keys as bare aliases', () => {
    assert.throws(() => {
      Deparser.deparse([
        {
          SelectStmt: {
            targetList: [
              {
                ResTarget: {
                  val: {
                    ColumnRef: {
                      fields: [{ String: { str: 'a' } }],
                    },
                  },
                },
              },
            ],
            fromClause: [
              {
                RangeVar: {
                  relname: 't',
                  // extra key should prevent bare-alias detection if deparsed as root item;
                  // here we ensure RangeVar still requires a real Alias wrapper or bare alias only.
                  alias: {
                    aliasname: 'tbl',
                    unexpected: true,
                  },
                },
              },
            ],
            op: 0,
          },
        },
      ]);
    }, /is not implemented|Unhandled/);
  });

  it('does not treat typed single-key nodes as bare SelectStmt bodies', () => {
    assert.throws(() => {
      Deparser.deparse([{ NotARealNode: { targetList: [] } }]);
    }, /NotARealNode is not implemented/);
  });

  it('does not treat targetList-only plain objects as bare SelectStmt bodies', () => {
    assert.throws(() => {
      Deparser.deparse([{ targetList: [] }]);
    }, /targetList is not implemented/);
  });
});
