import Role from "../models/roles.js";
import roleSchema from "../validations/roleValid.js";
import { logger } from "../../utils/logger.js"

export const getall = async (req, res) => {
    let role
    try {
        role = await Role.find();
        if (role.length === 0) {
            return res.status(400).json({
                message: " khong ton tai role nao!",
            });
        }
        return res.status(200).json({
            message: " Tim thanh cong tat ca cac role!",
            datas: role,
        });
    } catch (error) {
        logger.error({error, role},"server not getting all role")
        return res.status(500).json({
            message: "Loi sever",
        });
    }

};

export const getDetail = async (req, res) => {
    let role
    try {
        role = await Role.findById(req.params.id);
        if (!role) {
            return res.status(400).json({
                message: " khong ton tai role nao!",
            });
        }
        return res.status(200).json({
            message: " Tim thanh cong Role",
            datas: role,
        });
    } catch (error) {
        logger.error({error, role},"server not getting detail role")
        return res.status(500).json({
            message: "loi sever",
        });
    }
};

export const create = async (req, res) => {
    let role
    try {
        const { error } = roleSchema.validate(req.body);
        if (error) {
            logger.warn({error, body: req.body},"Create role failed due to validation.")
            return res.status(400).json({
                message: error.details[0].message,
                datas: [],
            });
        }
        role = await Role.create(req.body);
        if (!role) {
            logger.warn({body: req.body},"Create role failed to add to database.")
            return res.status(400).json({
                message: " them role moi khong thanh cong!",
            });
        }
        logger.info({body: req.body},"Create role successfully.")
        return res.status(200).json({
            message: " Them thanh cong role",
            datas: role,
        });
    } catch (error) {
        logger.error({error, role},"server not creating a role")
        return res.status(500).json({
            message: "loi sever",
        });
    }
};

export const update = async (req, res) => {
    let role
    try {
        const { error } = roleSchema.validate(req.body);
        if (error) {
            logger.warn({error, body: req.body},"Update role failed to validate.")
            return res.status(400).json({
                message: error.details[0].message,
                datas: [],
            });
        }
        role = await Role.findByIdAndUpdate(req.params.id, req.body);
        if (!role) {
            logger.warn({body: req.body},"update role failed to update on DB.")
            return res.status(400).json({
                message: "Cap nhat khong thanh cong!",
            });
        }
        logger.info({body: req.body},"Update role successfully .")
        return res.status(200).json({
            message: "Cap nhat thanh cong",
            datas: role,
        });
    } catch (error) {
        logger.error({error, role},"server not updating role")
        return res.status(500).json({
            message: "loi sever",
        });
    }
};

export const remove = async (req, res) => {
    let role
    try {

        role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            logger.warn({roleid: req.params.id},"Delete role failed due to not found .")
            return res.status(400).json({
                message: "Xoa khong thanh cong!",
            });
        }
        logger.info({roleid: req.params.id},"Delete role successfully .")
        return res.status(200).json({
            message: " Xoa thanh cong",
        });
    } catch (error) {
        logger.error({error, role},"server not removing role")
        return res.status(500).json({
            message: "loi sever",
        });
    }
}; 