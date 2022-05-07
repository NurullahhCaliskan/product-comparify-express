"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const database_service_1 = require("../database.service");
class UserWebsitesRelationRepository {
    /**
     * get User websites relations
     * @return unique website list
     */
    getUserWebsitesRelations() {
        return __awaiter(this, void 0, void 0, function* () {
            // @ts-ignore
            return yield database_service_1.collections.userWebsitesRelationModel.find({}).toArray();
        });
    }
}
exports.default = UserWebsitesRelationRepository;
