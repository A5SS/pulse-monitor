"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AlertRuleType = exports.ServiceStatus = exports.UserRole = void 0;
var UserRole;
(function (UserRole) {
    UserRole["ADMIN"] = "ADMIN";
    UserRole["MEMBER"] = "MEMBER";
})(UserRole || (exports.UserRole = UserRole = {}));
var ServiceStatus;
(function (ServiceStatus) {
    ServiceStatus["UP"] = "UP";
    ServiceStatus["DOWN"] = "DOWN";
})(ServiceStatus || (exports.ServiceStatus = ServiceStatus = {}));
var AlertRuleType;
(function (AlertRuleType) {
    AlertRuleType["CONSECUTIVE_FAILS"] = "CONSECUTIVE_FAILS";
})(AlertRuleType || (exports.AlertRuleType = AlertRuleType = {}));
//# sourceMappingURL=types.js.map