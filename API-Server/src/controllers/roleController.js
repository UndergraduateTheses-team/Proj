import Role from "../models/roles.js";
import roleSchema from "../validations/roleValid.js";

export const getall = async (req, res) => {
    try {
        const role = await Role.find();
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
        return res.status(500).json({
            message: "Loi sever",
        });
    }

};

export const getDetail = async (req, res) => {
    try {
        const role = await Role.findById(req.params.id);
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
        return res.status(500).json({
            message: "loi sever",
        });
    }
};

export const create = async (req, res) => {
    try {
        const { error } = roleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
                datas: [],
            });
        }
        const role = await Role.create(req.body);
        if (!role) {
            return res.status(400).json({
                message: " them role moi khong thanh cong!",
            });
        }
        return res.status(200).json({
            message: " Them thanh cong role",
            datas: role,
        });
    } catch (error) {
        return res.status(500).json({
            message: "loi sever",
        });
    }
};

export const update = async (req, res) => {
    try {
        const { error } = roleSchema.validate(req.body);
        if (error) {
            return res.status(400).json({
                message: error.details[0].message,
                datas: [],
            });
        }
        const role = await Role.findByIdAndUpdate(req.params.id, req.body);
        if (!role) {
            return res.status(400).json({
                message: "Cap nhat khong thanh cong!",
            });
        }
        return res.status(200).json({
            message: "Cap nhat thanh cong",
            datas: role,
        });
    } catch (error) {
        return res.status(500).json({
            message: "loi sever",
        });
    }
};

export const remove = async (req, res) => {
    try {

        const role = await Role.findByIdAndDelete(req.params.id);
        if (!role) {
            return res.status(400).json({
                message: "Xoa khong thanh cong!",
            });
        }
        return res.status(200).json({
            message: " Xoa thanh cong",
        });
    } catch (error) {
        return res.status(500).json({
            message: "loi sever",
        });
    }
}; 