"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;
var _lodash = _interopRequireDefault(require("lodash"));
var _util = require("util");
function _interopRequireDefault(e) { return e && e.__esModule ? e : { "default": e }; }
function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function _readOnlyError(r) { throw new TypeError('"' + r + '" is read-only'); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
function _classCallCheck(a, n) { if (!(a instanceof n)) throw new TypeError("Cannot call a class as a function"); }
function _defineProperties(e, r) { for (var t = 0; t < r.length; t++) { var o = r[t]; o.enumerable = o.enumerable || !1, o.configurable = !0, "value" in o && (o.writable = !0), Object.defineProperty(e, _toPropertyKey(o.key), o); } }
function _createClass(e, r, t) { return r && _defineProperties(e.prototype, r), t && _defineProperties(e, t), Object.defineProperty(e, "prototype", { writable: !1 }), e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
var keys = _lodash["default"].keys;
var compact = function compact(o) {
  return _lodash["default"].filter(_lodash["default"].compact(o), function (p) {
    if (p == null) {
      return false;
    }
    return p.toString().length;
  });
};
var fail = function fail(type, node) {
  throw new Error((0, _util.format)('Unhandled %s node: %s', type, JSON.stringify(node)));
};
var parens = function parens(string) {
  return '(' + string + ')';
};
var indent = function indent(text) {
  var count = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 1;
  return text;
};
var Deparser = exports["default"] = /*#__PURE__*/function () {
  function Deparser(tree) {
    _classCallCheck(this, Deparser);
    this.tree = tree;
  }
  return _createClass(Deparser, [{
    key: "deparseQuery",
    value: function deparseQuery() {
      var _this = this;
      return this.tree.map(function (node) {
        return _this.deparse(node);
      }).join('\n\n');
    }
  }, {
    key: "deparseNodes",
    value: function deparseNodes(nodes, context) {
      var _this2 = this;
      return nodes.map(function (node) {
        return _this2.deparse(node, context);
      });
    }
  }, {
    key: "list",
    value: function list(nodes) {
      var separator = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : ', ';
      if (!nodes) {
        return '';
      }
      return this.deparseNodes(nodes).join(separator);
    }
  }, {
    key: "quote",
    value: function quote(value) {
      var _this3 = this;
      if (value == null) {
        return null;
      }
      if (_lodash["default"].isArray(value)) {
        return value.map(function (o) {
          return _this3.quote(o);
        });
      }
      return '"' + value + '"';
    }

    // SELECT encode(E'''123\\000\\001', 'base64')
  }, {
    key: "escape",
    value: function escape(literal) {
      return "'" + literal.replace(/'/g, "''") + "'";
    }
  }, {
    key: "convertTypeName",
    value: function convertTypeName(typeName, size) {
      switch (typeName) {
        case 'bpchar':
          if (size != null) {
            return 'char';
          }
          // return `pg_catalog.bpchar` below so that the following is symmetric
          // SELECT char 'c' = char 'c' AS true
          return 'pg_catalog.bpchar';
        case 'varchar':
          return 'varchar';
        case 'numeric':
          return 'numeric';
        case 'bool':
          return 'boolean';
        case 'int2':
          return 'smallint';
        case 'int4':
          return 'int';
        case 'int8':
          return 'bigint';
        case 'real':
        case 'float4':
          return 'real';
        case 'float8':
          return 'pg_catalog.float8';
        case 'text':
          // SELECT EXTRACT(CENTURY FROM CURRENT_DATE)>=21 AS True
          return 'pg_catalog.text';
        case 'date':
          return 'pg_catalog.date';
        case 'time':
          return 'time';
        case 'timetz':
          return 'pg_catalog.timetz';
        case 'timestamp':
          return 'timestamp';
        case 'timestamptz':
          return 'pg_catalog.timestamptz';
        case 'interval':
          return 'interval';
        case 'bit':
          return 'bit';
        default:
          throw new Error((0, _util.format)('Unhandled data type: %s', typeName));
      }
    }
  }, {
    key: "type",
    value: function type(names, args) {
      var _this4 = this;
      var _names$map = names.map(function (name) {
          return _this4.deparse(name);
        }),
        _names$map2 = _slicedToArray(_names$map, 2),
        catalog = _names$map2[0],
        type = _names$map2[1];
      var mods = function mods(name, size) {
        if (size != null) {
          return name + '(' + size + ')';
        }
        return name;
      };

      // handle the special "char" (in quotes) type
      if (names[0].String.str === 'char') {
        names[0].String.str = '"char"';
      }
      if (catalog !== 'pg_catalog') {
        return mods(this.list(names, '.'), args);
      }
      var res = this.convertTypeName(type, args);
      return mods(res, args);
    }
  }, {
    key: "deparse",
    value: function deparse(item, context) {
      if (item == null) {
        return null;
      }
      if (_lodash["default"].isNumber(item)) {
        return item;
      }
      var type = keys(item)[0];
      var node = _lodash["default"].values(item)[0];
      if (this[type] == null) {
        throw new Error(type + ' is not implemented');
      }
      return this[type](node, context);
    }
  }, {
    key: 'A_Expr',
    value: function A_Expr(node, context) {
      var output = [];
      switch (node.kind) {
        case 0:
          // AEXPR_OP
          if (node.lexpr) {
            output.push(parens(this.deparse(node.lexpr)));
          }
          if (node.name.length > 1) {
            var schema = this.deparse(node.name[0]);
            var operator = this.deparse(node.name[1]);
            output.push("OPERATOR(".concat(schema, ".").concat(operator, ")"));
          } else {
            output.push(this.deparse(node.name[0]));
          }
          if (node.rexpr) {
            output.push(parens(this.deparse(node.rexpr)));
          }
          if (output.length === 2) {
            return parens(output.join(''));
          }
          return parens(output.join(' '));
        case 1:
          // AEXPR_OP_ANY
          output.push(this.deparse(node.lexpr));
          output.push((0, _util.format)('ANY (%s)', this.deparse(node.rexpr)));
          return output.join(" ".concat(this.deparse(node.name[0]), " "));
        case 2:
          // AEXPR_OP_ALL
          output.push(this.deparse(node.lexpr));
          output.push((0, _util.format)('ALL (%s)', this.deparse(node.rexpr)));
          return output.join(" ".concat(this.deparse(node.name[0]), " "));
        case 3:
          // AEXPR_DISTINCT
          return (0, _util.format)('%s IS DISTINCT FROM %s', this.deparse(node.lexpr), this.deparse(node.rexpr));
        case 4:
          // AEXPR_NULLIF
          return (0, _util.format)('NULLIF(%s, %s)', this.deparse(node.lexpr), this.deparse(node.rexpr));
        case 5:
          {
            // AEXPR_OF
            var op = node.name[0].String.str === '=' ? 'IS OF' : 'IS NOT OF';
            return (0, _util.format)('%s %s (%s)', this.deparse(node.lexpr), op, this.list(node.rexpr));
          }
        case 6:
          {
            // AEXPR_IN
            var _operator = node.name[0].String.str === '=' ? 'IN' : 'NOT IN';
            return (0, _util.format)('%s %s (%s)', this.deparse(node.lexpr), _operator, this.list(node.rexpr));
          }
        case 7:
          // AEXPR_LIKE
          output.push(this.deparse(node.lexpr));
          if (node.name[0].String.str === '!~~') {
            output.push((0, _util.format)('NOT LIKE (%s)', this.deparse(node.rexpr)));
          } else {
            output.push((0, _util.format)('LIKE (%s)', this.deparse(node.rexpr)));
          }
          return output.join(' ');
        case 8:
          // AEXPR_ILIKE
          output.push(this.deparse(node.lexpr));
          if (node.name[0].String.str === '!~~*') {
            output.push((0, _util.format)('NOT ILIKE (%s)', this.deparse(node.rexpr)));
          } else {
            output.push((0, _util.format)('ILIKE (%s)', this.deparse(node.rexpr)));
          }
          return output.join(' ');
        case 9:
          // AEXPR_SIMILAR
          // SIMILAR TO emits a similar_escape FuncCall node with the first argument
          output.push(this.deparse(node.lexpr));
          if (this.deparse(node.rexpr.FuncCall.args[1].Null)) {
            output.push((0, _util.format)('SIMILAR TO %s', this.deparse(node.rexpr.FuncCall.args[0])));
          } else {
            output.push((0, _util.format)('SIMILAR TO %s ESCAPE %s', this.deparse(node.rexpr.FuncCall.args[0]), this.deparse(node.rexpr.FuncCall.args[1])));
          }
          return output.join(' ');
        case 10:
          // AEXPR_BETWEEN TODO(zhm) untested
          output.push(this.deparse(node.lexpr));
          output.push((0, _util.format)('BETWEEN %s AND %s', this.deparse(node.rexpr[0]), this.deparse(node.rexpr[1])));
          return output.join(' ');
        case 11:
          // AEXPR_NOT_BETWEEN TODO(zhm) untested
          output.push(this.deparse(node.lexpr));
          output.push((0, _util.format)('NOT BETWEEN %s AND %s', this.deparse(node.rexpr[0]), this.deparse(node.rexpr[1])));
          return output.join(' ');
        default:
          return fail('A_Expr', node);
      }
    }
  }, {
    key: 'Alias',
    value: function Alias(node, context) {
      var name = node.aliasname;
      var output = ['AS'];
      if (node.colnames) {
        output.push(name + parens(this.list(node.colnames)));
      } else {
        output.push(this.quote(name));
      }
      return output.join(' ');
    }
  }, {
    key: 'A_ArrayExpr',
    value: function A_ArrayExpr(node) {
      return (0, _util.format)('ARRAY[%s]', this.list(node.elements));
    }
  }, {
    key: 'A_Const',
    value: function A_Const(node, context) {
      if (node.val.String) {
        return this.escape(this.deparse(node.val, context));
      }
      return this.deparse(node.val, context);
    }
  }, {
    key: 'A_Indices',
    value: function A_Indices(node) {
      if (node.lidx) {
        return (0, _util.format)('[%s:%s]', this.deparse(node.lidx), this.deparse(node.uidx));
      }
      return (0, _util.format)('[%s]', this.deparse(node.uidx));
    }
  }, {
    key: 'A_Indirection',
    value: function A_Indirection(node) {
      var output = ["(".concat(this.deparse(node.arg), ")")];

      // TODO(zhm) figure out the actual rules for when a '.' is needed
      //
      // select a.b[0] from a;
      // select (select row(1)).*
      // select c2[2].f2 from comptable
      // select c2.a[2].f2[1].f3[0].a1 from comptable

      for (var i = 0; i < node.indirection.length; i++) {
        var subnode = node.indirection[i];
        if (subnode.String || subnode.A_Star) {
          var value = subnode.A_Star ? '*' : this.quote(subnode.String.str);
          output.push(".".concat(value));
        } else {
          output.push(this.deparse(subnode));
        }
      }
      return output.join('');
    }
  }, {
    key: 'A_Star',
    value: function A_Star(node, context) {
      return '*';
    }
  }, {
    key: 'BitString',
    value: function BitString(node) {
      var prefix = node.str[0];
      return "".concat(prefix, "'").concat(node.str.substring(1), "'");
    }
  }, {
    key: 'BoolExpr',
    value: function BoolExpr(node) {
      switch (node.boolop) {
        case 0:
          return parens(this.list(node.args, ' AND '));
        case 1:
          return parens(this.list(node.args, ' OR '));
        case 2:
          return (0, _util.format)('NOT (%s)', this.deparse(node.args[0]));
        default:
          return fail('BoolExpr', node);
      }
    }
  }, {
    key: 'BooleanTest',
    value: function BooleanTest(node) {
      var output = [];
      output.push(this.deparse(node.arg));
      var tests = ['IS TRUE', 'IS NOT TRUE', 'IS FALSE', 'IS NOT FALSE', 'IS UNKNOWN', 'IS NOT UNKNOWN'];
      output.push(tests[node.booltesttype]);
      return output.join(' ');
    }
  }, {
    key: 'CaseExpr',
    value: function CaseExpr(node) {
      var output = ['CASE'];
      if (node.arg) {
        output.push(this.deparse(node.arg));
      }
      for (var i = 0; i < node.args.length; i++) {
        output.push(this.deparse(node.args[i]));
      }
      if (node.defresult) {
        output.push('ELSE');
        output.push(this.deparse(node.defresult));
      }
      output.push('END');
      return output.join(' ');
    }
  }, {
    key: 'CoalesceExpr',
    value: function CoalesceExpr(node) {
      return (0, _util.format)('COALESCE(%s)', this.list(node.args));
    }
  }, {
    key: 'CollateClause',
    value: function CollateClause(node) {
      var output = [];
      if (node.arg) {
        output.push(this.deparse(node.arg));
      }
      output.push('COLLATE');
      if (node.collname) {
        output.push(this.quote(this.deparseNodes(node.collname)));
      }
      return output.join(' ');
    }
  }, {
    key: 'ColumnDef',
    value: function ColumnDef(node) {
      var output = [this.quote(node.colname)];
      output.push(this.deparse(node.typeName));
      if (node.raw_default) {
        output.push('USING');
        output.push(this.deparse(node.raw_default));
      }
      if (node.constraints) {
        output.push(this.list(node.constraints, ' '));
      }
      return _lodash["default"].compact(output).join(' ');
    }
  }, {
    key: 'ColumnRef',
    value: function ColumnRef(node) {
      var _this5 = this;
      var fields = node.fields.map(function (field) {
        if (field.String) {
          return _this5.quote(_this5.deparse(field));
        }
        return _this5.deparse(field);
      });
      return fields.join('.');
    }
  }, {
    key: 'CommonTableExpr',
    value: function CommonTableExpr(node) {
      var output = [];
      output.push(node.ctename);
      if (node.aliascolnames) {
        output.push((0, _util.format)('(%s)', this.quote(this.deparseNodes(node.aliascolnames))));
      }
      output.push((0, _util.format)('AS (%s)', this.deparse(node.ctequery)));
      return output.join(' ');
    }
  }, {
    key: 'DefElem',
    value: function DefElem(node) {
      if (node.defname === 'transaction_isolation') {
        return (0, _util.format)('ISOLATION LEVEL %s', node.arg.A_Const.val.String.str.toUpperCase());
      }
      if (node.defname === 'transaction_read_only') {
        return node.arg.A_Const.val.Integer.ival === 0 ? 'READ WRITE' : 'READ ONLY';
      }
      if (node.defname === 'transaction_deferrable') {
        return node.arg.A_Const.val.Integer.ival === 0 ? 'NOT DEFERRABLE' : 'DEFERRABLE';
      }
    }
  }, {
    key: 'Float',
    value: function Float(node) {
      // wrap negative numbers in parens, SELECT (-2147483648)::int4 * (-1)::int4
      if (node.str[0] === '-') {
        return "(".concat(node.str, ")");
      }
      return node.str;
    }
  }, {
    key: 'FuncCall',
    value: function FuncCall(node, context) {
      var _this6 = this;
      var output = [];
      var params = [];
      if (node.args) {
        params = node.args.map(function (item) {
          return _this6.deparse(item);
        });
      }

      // COUNT(*)
      if (node.agg_star) {
        params.push('*');
      }
      var name = this.list(node.funcname, '.');
      var order = [];
      var withinGroup = node.agg_within_group;
      if (node.agg_order) {
        order.push('ORDER BY');
        order.push(this.list(node.agg_order, ', '));
      }
      var call = [];
      call.push(name + '(');
      if (node.agg_distinct) {
        call.push('DISTINCT ');
      }

      // prepend variadic before the last parameter
      // SELECT CONCAT('|', VARIADIC ARRAY['1','2','3'])
      if (node.func_variadic) {
        params[params.length - 1] = 'VARIADIC ' + params[params.length - 1];
      }
      call.push(params.join(', '));
      if (order.length && !withinGroup) {
        call.push(' ');
        call.push(order.join(' '));
      }
      call.push(')');
      output.push(compact(call).join(''));
      if (order.length && withinGroup) {
        output.push('WITHIN GROUP');
        output.push(parens(order.join(' ')));
      }
      if (node.agg_filter != null) {
        output.push((0, _util.format)('FILTER (WHERE %s)', this.deparse(node.agg_filter)));
      }
      if (node.over != null) {
        output.push((0, _util.format)('OVER %s', this.deparse(node.over)));
      }
      return output.join(' ');
    }
  }, {
    key: 'GroupingFunc',
    value: function GroupingFunc(node) {
      return 'GROUPING(' + this.list(node.args) + ')';
    }
  }, {
    key: 'GroupingSet',
    value: function GroupingSet(node) {
      switch (node.kind) {
        case 0:
          // GROUPING_SET_EMPTY
          return '()';
        case 1:
          // GROUPING_SET_SIMPLE
          return fail('GroupingSet', node);
        case 2:
          // GROUPING_SET_ROLLUP
          return 'ROLLUP (' + this.list(node.content) + ')';
        case 3:
          // GROUPING_SET_CUBE
          return 'CUBE (' + this.list(node.content) + ')';
        case 4:
          // GROUPING_SET_SETS
          return 'GROUPING SETS (' + this.list(node.content) + ')';
        default:
          return fail('GroupingSet', node);
      }
    }
  }, {
    key: 'Integer',
    value: function Integer(node, context) {
      if (node.ival < 0 && context !== 'simple') {
        return "(".concat(node.ival, ")");
      }
      return node.ival.toString();
    }
  }, {
    key: 'IntoClause',
    value: function IntoClause(node) {
      return this.deparse(node.rel);
    }
  }, {
    key: 'JoinExpr',
    value: function JoinExpr(node, context) {
      var output = [];
      output.push(this.deparse(node.larg));
      if (node.isNatural) {
        output.push('NATURAL');
      }
      var join = null;
      switch (true) {
        case node.jointype === 0 && node.quals != null:
          join = 'INNER JOIN';
          break;
        case node.jointype === 0 && !node.isNatural && !(node.quals != null) && !(node.usingClause != null):
          join = 'CROSS JOIN';
          break;
        case node.jointype === 0:
          join = 'JOIN';
          break;
        case node.jointype === 1:
          join = 'LEFT OUTER JOIN';
          break;
        case node.jointype === 2:
          join = 'FULL OUTER JOIN';
          break;
        case node.jointype === 3:
          join = 'RIGHT OUTER JOIN';
          break;
        default:
          fail('JoinExpr', node);
          break;
      }
      output.push(join);
      if (node.rarg) {
        // wrap nested join expressions in parens to make the following symmetric:
        // select * from int8_tbl x cross join (int4_tbl x cross join lateral (select x.f1) ss)
        if (node.rarg.JoinExpr != null && !(node.rarg.JoinExpr.alias != null)) {
          output.push("(".concat(this.deparse(node.rarg), ")"));
        } else {
          output.push(this.deparse(node.rarg));
        }
      }
      if (node.quals) {
        output.push("ON ".concat(this.deparse(node.quals)));
      }
      if (node.usingClause) {
        var using = this.quote(this.deparseNodes(node.usingClause)).join(', ');
        output.push("USING (".concat(using, ")"));
      }
      var wrapped = node.rarg.JoinExpr != null || node.alias ? '(' + output.join(' ') + ')' : output.join(' ');
      if (node.alias) {
        return wrapped + ' ' + this.deparse(node.alias);
      }
      return wrapped;
    }
  }, {
    key: 'LockingClause',
    value: function LockingClause(node) {
      var strengths = ['NONE',
      // LCS_NONE
      'FOR KEY SHARE', 'FOR SHARE', 'FOR NO KEY UPDATE', 'FOR UPDATE'];
      var output = [];
      output.push(strengths[node.strength]);
      if (node.lockedRels) {
        output.push('OF');
        output.push(this.list(node.lockedRels));
      }
      return output.join(' ');
    }
  }, {
    key: 'MinMaxExpr',
    value: function MinMaxExpr(node) {
      var output = [];
      if (node.op === 0) {
        output.push('GREATEST');
      } else {
        output.push('LEAST');
      }
      output.push(parens(this.list(node.args)));
      return output.join('');
    }
  }, {
    key: 'NamedArgExpr',
    value: function NamedArgExpr(node) {
      var output = [];
      output.push(node.name);
      output.push(':=');
      output.push(this.deparse(node.arg));
      return output.join(' ');
    }
  }, {
    key: 'Null',
    value: function Null(node) {
      return 'NULL';
    }
  }, {
    key: 'NullTest',
    value: function NullTest(node) {
      var output = [this.deparse(node.arg)];
      if (node.nulltesttype === 0) {
        output.push('IS NULL');
      } else if (node.nulltesttype === 1) {
        output.push('IS NOT NULL');
      }
      return output.join(' ');
    }
  }, {
    key: 'ParamRef',
    value: function ParamRef(node) {
      if (node.number >= 0) {
        return ['$', node.number].join('');
      }
      return '?';
    }
  }, {
    key: 'RangeFunction',
    value: function RangeFunction(node) {
      var output = [];
      if (node.lateral) {
        output.push('LATERAL');
      }
      var funcs = [];
      for (var i = 0; i < node.functions.length; i++) {
        var funcCall = node.functions[i];
        var call = [this.deparse(funcCall[0])];
        if (funcCall[1] && funcCall[1].length) {
          call.push((0, _util.format)('AS (%s)', this.list(funcCall[1])));
        }
        funcs.push(call.join(' '));
      }
      var calls = funcs.join(', ');
      if (node.is_rowsfrom) {
        output.push("ROWS FROM (".concat(calls, ")"));
      } else {
        output.push(calls);
      }
      if (node.ordinality) {
        output.push('WITH ORDINALITY');
      }
      if (node.alias) {
        output.push(this.deparse(node.alias));
      }
      if (node.coldeflist) {
        var defList = this.list(node.coldeflist);
        if (!node.alias) {
          output.push(" AS (".concat(defList, ")"));
        } else {
          output.push("(".concat(defList, ")"));
        }
      }
      return output.join(' ');
    }
  }, {
    key: 'RangeSubselect',
    value: function RangeSubselect(node, context) {
      var output = '';
      if (node.lateral) {
        output += 'LATERAL ';
      }
      output += parens(this.deparse(node.subquery));
      if (node.alias) {
        return output + ' ' + this.deparse(node.alias);
      }
      return output;
    }
  }, {
    key: 'RangeTableSample',
    value: function RangeTableSample(node) {
      var output = [];
      output.push(this.deparse(node.relation));
      output.push('TABLESAMPLE');
      output.push(this.deparse(node.method[0]));
      if (node.args) {
        output.push(parens(this.list(node.args)));
      }
      if (node.repeatable) {
        output.push('REPEATABLE(' + this.deparse(node.repeatable) + ')');
      }
      return output.join(' ');
    }
  }, {
    key: 'RangeVar',
    value: function RangeVar(node, context) {
      var output = [];
      if (node.inhOpt === 0) {
        output.push('ONLY');
      }
      if (node.relpersistence === 'u') {
        output.push('UNLOGGED');
      }
      if (node.relpersistence === 't') {
        output.push('TEMPORARY');
      }
      if (node.schemaname != null) {
        output.push(this.quote(node.schemaname));
        output.push('.');
      }
      output.push(this.quote(node.relname));
      if (node.alias) {
        output.push(this.deparse(node.alias));
      }
      return output.join(' ');
    }
  }, {
    key: 'ResTarget',
    value: function ResTarget(node, context) {
      if (context === 'select') {
        return compact([this.deparse(node.val), this.quote(node.name)]).join(' AS ');
      } else if (context === 'update') {
        return compact([node.name, this.deparse(node.val)]).join(' = ');
      } else if (!(node.val != null)) {
        return this.quote(node.name);
      }
      return fail('ResTarget', node);
    }
  }, {
    key: 'RowExpr',
    value: function RowExpr(node) {
      if (node.row_format === 2) {
        return parens(this.list(node.args));
      }
      return (0, _util.format)('ROW(%s)', this.list(node.args));
    }
  }, {
    key: 'SelectStmt',
    value: function SelectStmt(node, context) {
      var _this7 = this;
      var output = [];
      if (node.withClause) {
        output.push(this.deparse(node.withClause));
      }
      if (node.op === 0) {
        // VALUES select's don't get SELECT
        if (node.valuesLists == null) {
          output.push('SELECT');
        }
      } else {
        output.push(parens(this.deparse(node.larg)));
        var sets = ['NONE', 'UNION', 'INTERSECT', 'EXCEPT'];
        output.push(sets[node.op]);
        if (node.all) {
          output.push('ALL');
        }
        output.push(parens(this.deparse(node.rarg)));
      }
      if (node.distinctClause) {
        if (node.distinctClause[0] != null) {
          output.push('DISTINCT ON');
          var clause = node.distinctClause.map(function (e) {
            return _this7.deparse(e, 'select');
          }).join(',\n');
          output.push("(".concat(clause, ")"));
        } else {
          output.push('DISTINCT');
        }
      }
      if (node.targetList) {
        output.push(indent(node.targetList.map(function (e) {
          return _this7.deparse(e, 'select');
        }).join(',\n')));
      }
      if (node.intoClause) {
        output.push('INTO');
        output.push(indent(this.deparse(node.intoClause)));
      }
      if (node.fromClause) {
        output.push('FROM');
        output.push(indent(node.fromClause.map(function (e) {
          return _this7.deparse(e, 'from');
        }).join(',\n')));
      }
      if (node.whereClause) {
        output.push('WHERE');
        output.push(indent(this.deparse(node.whereClause)));
      }
      if (node.valuesLists) {
        output.push('VALUES');
        var lists = node.valuesLists.map(function (list) {
          return "(".concat(list.map(function (v) {
            return _this7.deparse(v);
          }).join(', '), ")");
        });
        output.push(lists.join(', '));
      }
      if (node.groupClause) {
        output.push('GROUP BY');
        output.push(indent(node.groupClause.map(function (e) {
          return _this7.deparse(e, 'group');
        }).join(',\n')));
      }
      if (node.havingClause) {
        output.push('HAVING');
        output.push(indent(this.deparse(node.havingClause)));
      }
      if (node.windowClause) {
        output.push('WINDOW');
        var windows = [];
        for (var i = 0; i < node.windowClause.length; i++) {
          var w = node.windowClause[i];
          var window = [];
          if (w.WindowDef.name) {
            window.push(this.quote(w.WindowDef.name) + ' AS');
          }
          window.push(parens(this.deparse(w, 'window')));
          windows.push(window.join(' '));
        }
        output.push(windows.join(', '));
      }
      if (node.sortClause) {
        output.push('ORDER BY');
        output.push(indent(node.sortClause.map(function (e) {
          return _this7.deparse(e, 'sort');
        }).join(',\n')));
      }
      if (node.limitCount) {
        output.push('LIMIT');
        output.push(indent(this.deparse(node.limitCount)));
      }
      if (node.limitOffset) {
        output.push('OFFSET');
        output.push(indent(this.deparse(node.limitOffset)));
      }
      if (node.lockingClause) {
        node.lockingClause.forEach(function (item) {
          return output.push(_this7.deparse(item));
        });
      }
      return output.join(' ');
    }
  }, {
    key: 'SortBy',
    value: function SortBy(node) {
      var output = [];
      output.push(this.deparse(node.node));
      if (node.sortby_dir === 1) {
        output.push('ASC');
      }
      if (node.sortby_dir === 2) {
        output.push('DESC');
      }
      if (node.sortby_dir === 3) {
        output.push("USING ".concat(this.deparseNodes(node.useOp)));
      }
      if (node.sortby_nulls === 1) {
        output.push('NULLS FIRST');
      }
      if (node.sortby_nulls === 2) {
        output.push('NULLS LAST');
      }
      return output.join(' ');
    }
  }, {
    key: 'String',
    value: function String(node) {
      return node.str;
    }
  }, {
    key: 'SubLink',
    value: function SubLink(node) {
      switch (true) {
        case node.subLinkType === 0:
          return (0, _util.format)('EXISTS (%s)', this.deparse(node.subselect));
        case node.subLinkType === 1:
          return (0, _util.format)('%s %s ALL (%s)', this.deparse(node.testexpr), this.deparse(node.operName[0]), this.deparse(node.subselect));
        case node.subLinkType === 2 && !(node.operName != null):
          return (0, _util.format)('%s IN (%s)', this.deparse(node.testexpr), this.deparse(node.subselect));
        case node.subLinkType === 2:
          return (0, _util.format)('%s %s ANY (%s)', this.deparse(node.testexpr), this.deparse(node.operName[0]), this.deparse(node.subselect));
        case node.subLinkType === 3:
          return (0, _util.format)('%s %s (%s)', this.deparse(node.testexpr), this.deparse(node.operName[0]), this.deparse(node.subselect));
        case node.subLinkType === 4:
          return (0, _util.format)('(%s)', this.deparse(node.subselect));
        case node.subLinkType === 5:
          // TODO(zhm) what is this?
          return fail('SubLink', node);
        // MULTIEXPR_SUBLINK
        // format('(%s)', @deparse(node.subselect))
        case node.subLinkType === 6:
          return (0, _util.format)('ARRAY (%s)', this.deparse(node.subselect));
        default:
          return fail('SubLink', node);
      }
    }
  }, {
    key: 'TypeCast',
    value: function TypeCast(node) {
      return this.deparse(node.arg) + '::' + this.deparse(node.typeName);
    }
  }, {
    key: 'TypeName',
    value: function TypeName(node) {
      var _this8 = this;
      if (_lodash["default"].last(node.names).String.str === 'interval') {
        return this.deparseInterval(node);
      }
      var output = [];
      if (node.setof) {
        output.push('SETOF');
      }
      var args = null;
      if (node.typmods != null) {
        args = node.typmods.map(function (item) {
          return _this8.deparse(item);
        });
      }
      var type = [];
      type.push(this.type(node.names, args && args.join(', ')));
      if (node.arrayBounds != null) {
        type.push('[]');
      }
      output.push(type.join(''));
      return output.join(' ');
    }
  }, {
    key: 'CaseWhen',
    value: function CaseWhen(node) {
      var output = ['WHEN'];
      output.push(this.deparse(node.expr));
      output.push('THEN');
      output.push(this.deparse(node.result));
      return output.join(' ');
    }
  }, {
    key: 'VariableSetStmt',
    value: function VariableSetStmt(node) {
      if (node.kind === 4) {
        return (0, _util.format)('RESET %s', node.name);
      }
      if (node.kind === 3) {
        var name = {
          'TRANSACTION': 'TRANSACTION',
          'SESSION CHARACTERISTICS': 'SESSION CHARACTERISTICS AS TRANSACTION'
        }[node.name];
        return (0, _util.format)('SET %s %s', name, this.deparseNodes(node.args, 'simple').join(', '));
      }
      if (node.kind === 1) {
        return (0, _util.format)('SET %s TO DEFAULT', node.name);
      }
      return (0, _util.format)('SET %s%s = %s', node.is_local ? 'LOCAL ' : '', node.name, this.deparseNodes(node.args, 'simple').join(', '));
    }
  }, {
    key: 'VariableShowStmt',
    value: function VariableShowStmt(node) {
      return (0, _util.format)('SHOW %s', node.name);
    }
  }, {
    key: 'WindowDef',
    value: function WindowDef(node, context) {
      var _this9 = this;
      var output = [];
      if (context !== 'window') {
        if (node.name) {
          output.push(node.name);
        }
      }
      var empty = !(node.partitionClause != null) && !(node.orderClause != null);
      var frameOptions = this.deparseFrameOptions(node.frameOptions, node.refname, node.startOffset, node.endOffset);
      if (empty && context !== 'window' && !(node.name != null) && frameOptions.length === 0) {
        return '()';
      }
      var windowParts = [];
      var useParens = false;
      if (node.partitionClause) {
        var partition = ['PARTITION BY'];
        var clause = node.partitionClause.map(function (item) {
          return _this9.deparse(item);
        });
        partition.push(clause.join(', '));
        windowParts.push(partition.join(' '));
        useParens = true;
      }
      if (node.orderClause) {
        windowParts.push('ORDER BY');
        var orders = node.orderClause.map(function (item) {
          return _this9.deparse(item);
        });
        windowParts.push(orders.join(', '));
        useParens = true;
      }
      if (frameOptions.length) {
        useParens = true;
        windowParts.push(frameOptions);
      }
      if (useParens && context !== 'window') {
        return output.join(' ') + ' (' + windowParts.join(' ') + ')';
      }
      return output.join(' ') + windowParts.join(' ');
    }
  }, {
    key: 'WithClause',
    value: function WithClause(node) {
      var output = ['WITH'];
      if (node.recursive) {
        output.push('RECURSIVE');
      }
      output.push(this.list(node.ctes));
      return output.join(' ');
    }
  }, {
    key: "deparseFrameOptions",
    value: function deparseFrameOptions(options, refName, startOffset, endOffset) {
      var FRAMEOPTION_NONDEFAULT = 0x00001; // any specified?
      var FRAMEOPTION_RANGE = 0x00002; // RANGE behavior
      var FRAMEOPTION_ROWS = 0x00004; // ROWS behavior
      var FRAMEOPTION_BETWEEN = 0x00008; // BETWEEN given?
      var FRAMEOPTION_START_UNBOUNDED_PRECEDING = 0x00010; // start is U. P.
      var FRAMEOPTION_END_UNBOUNDED_PRECEDING = 0x00020; // (disallowed)
      var FRAMEOPTION_START_UNBOUNDED_FOLLOWING = 0x00040; // (disallowed)
      var FRAMEOPTION_END_UNBOUNDED_FOLLOWING = 0x00080; // end is U. F.
      var FRAMEOPTION_START_CURRENT_ROW = 0x00100; // start is C. R.
      var FRAMEOPTION_END_CURRENT_ROW = 0x00200; // end is C. R.
      var FRAMEOPTION_START_VALUE_PRECEDING = 0x00400; // start is V. P.
      var FRAMEOPTION_END_VALUE_PRECEDING = 0x00800; // end is V. P.
      var FRAMEOPTION_START_VALUE_FOLLOWING = 0x01000; // start is V. F.
      var FRAMEOPTION_END_VALUE_FOLLOWING = 0x02000; // end is V. F.

      if (!(options & FRAMEOPTION_NONDEFAULT)) {
        return '';
      }
      var output = [];
      if (refName != null) {
        output.push(refName);
      }
      if (options & FRAMEOPTION_RANGE) {
        output.push('RANGE');
      }
      if (options & FRAMEOPTION_ROWS) {
        output.push('ROWS');
      }
      var between = options & FRAMEOPTION_BETWEEN;
      if (between) {
        output.push('BETWEEN');
      }
      if (options & FRAMEOPTION_START_UNBOUNDED_PRECEDING) {
        output.push('UNBOUNDED PRECEDING');
      }
      if (options & FRAMEOPTION_START_UNBOUNDED_FOLLOWING) {
        output.push('UNBOUNDED FOLLOWING');
      }
      if (options & FRAMEOPTION_START_CURRENT_ROW) {
        output.push('CURRENT ROW');
      }
      if (options & FRAMEOPTION_START_VALUE_PRECEDING) {
        output.push(this.deparse(startOffset) + ' PRECEDING');
      }
      if (options & FRAMEOPTION_START_VALUE_FOLLOWING) {
        output.push(this.deparse(startOffset) + ' FOLLOWING');
      }
      if (between) {
        output.push('AND');
        if (options & FRAMEOPTION_END_UNBOUNDED_PRECEDING) {
          output.push('UNBOUNDED PRECEDING');
        }
        if (options & FRAMEOPTION_END_UNBOUNDED_FOLLOWING) {
          output.push('UNBOUNDED FOLLOWING');
        }
        if (options & FRAMEOPTION_END_CURRENT_ROW) {
          output.push('CURRENT ROW');
        }
        if (options & FRAMEOPTION_END_VALUE_PRECEDING) {
          output.push(this.deparse(endOffset) + ' PRECEDING');
        }
        if (options & FRAMEOPTION_END_VALUE_FOLLOWING) {
          output.push(this.deparse(endOffset) + ' FOLLOWING');
        }
      }
      return output.join(' ');
    }
  }, {
    key: "deparseInterval",
    value: function deparseInterval(node) {
      var _this10 = this;
      var type = ['interval'];
      if (node.arrayBounds != null) {
        type.push('[]');
      }
      if (node.typmods) {
        var typmods = node.typmods.map(function (item) {
          return _this10.deparse(item);
        });
        var intervals = this.interval(typmods[0]);

        // SELECT interval(0) '1 day 01:23:45.6789'
        if (node.typmods[0] && node.typmods[0].A_Const && node.typmods[0].A_Const.val.Integer.ival === 32767 && node.typmods[1] && node.typmods[1].A_Const != null) {
          intervals = ["(".concat(node.typmods[1].A_Const.val.Integer.ival, ")")];
        } else {
          intervals = intervals.map(function (part) {
            if (part === 'second' && typmods.length === 2) {
              return 'second(' + _lodash["default"].last(typmods) + ')';
            }
            return part;
          });
        }
        type.push(intervals.join(' to '));
      }
      return type.join(' ');
    }
  }, {
    key: "interval",
    value: function interval(mask) {
      // ported from https://github.com/lfittl/pg_query/blob/master/lib/pg_query/deparse/interval.rb
      if (this.MASKS == null) {
        this.MASKS = {
          0: 'RESERV',
          1: 'MONTH',
          2: 'YEAR',
          3: 'DAY',
          4: 'JULIAN',
          5: 'TZ',
          6: 'DTZ',
          7: 'DYNTZ',
          8: 'IGNORE_DTF',
          9: 'AMPM',
          10: 'HOUR',
          11: 'MINUTE',
          12: 'SECOND',
          13: 'MILLISECOND',
          14: 'MICROSECOND',
          15: 'DOY',
          16: 'DOW',
          17: 'UNITS',
          18: 'ADBC',
          19: 'AGO',
          20: 'ABS_BEFORE',
          21: 'ABS_AFTER',
          22: 'ISODATE',
          23: 'ISOTIME',
          24: 'WEEK',
          25: 'DECADE',
          26: 'CENTURY',
          27: 'MILLENNIUM',
          28: 'DTZMOD'
        };
      }
      if (this.BITS == null) {
        this.BITS = _lodash["default"].invert(this.MASKS);
      }
      if (this.INTERVALS == null) {
        this.INTERVALS = {};
        this.INTERVALS[1 << this.BITS.YEAR] = ['year'];
        this.INTERVALS[1 << this.BITS.MONTH] = ['month'];
        this.INTERVALS[1 << this.BITS.DAY] = ['day'];
        this.INTERVALS[1 << this.BITS.HOUR] = ['hour'];
        this.INTERVALS[1 << this.BITS.MINUTE] = ['minute'];
        this.INTERVALS[1 << this.BITS.SECOND] = ['second'];
        this.INTERVALS[1 << this.BITS.YEAR | 1 << this.BITS.MONTH] = ['year', 'month'];
        this.INTERVALS[1 << this.BITS.DAY | 1 << this.BITS.HOUR] = ['day', 'hour'];
        this.INTERVALS[1 << this.BITS.DAY | 1 << this.BITS.HOUR | 1 << this.BITS.MINUTE] = ['day', 'minute'];
        this.INTERVALS[1 << this.BITS.DAY | 1 << this.BITS.HOUR | 1 << this.BITS.MINUTE | 1 << this.BITS.SECOND] = ['day', 'second'];
        this.INTERVALS[1 << this.BITS.HOUR | 1 << this.BITS.MINUTE] = ['hour', 'minute'];
        this.INTERVALS[1 << this.BITS.HOUR | 1 << this.BITS.MINUTE | 1 << this.BITS.SECOND] = ['hour', 'second'];
        this.INTERVALS[1 << this.BITS.MINUTE | 1 << this.BITS.SECOND] = ['minute', 'second'];

        // utils/timestamp.h
        // #define INTERVAL_FULL_RANGE (0x7FFF)
        this.INTERVALS[this.INTERVAL_FULL_RANGE = '32767'] = [];
      }
      return this.INTERVALS[mask.toString()];
    }
  }], [{
    key: "deparse",
    value: function deparse(query) {
      return new Deparser(query).deparseQuery();
    }
  }]);
}();
//# sourceMappingURL=index.js.map