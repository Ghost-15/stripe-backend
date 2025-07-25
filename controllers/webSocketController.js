const asyncHandler = require("express-async-handler");
const { v4: uuidv4 } = require("uuid");
const Transaction = require("../models/Transaction");


const startWebSocket = (io) => {
    const pay = asyncHandler(async (req, res) => {
        const { description, total, userId } = req.body;
        const randomCode = uuidv4();

        if (!description || !total || !userId) {
            return res.status(422).json({ message: "All fields are required" });
        }

        const transactionObject = {
            userId: userId,
            description: description,
            amount: total,
            code: randomCode
        };

        const transaction = await Transaction.create(transactionObject);

        if (transaction) {
            io.to(userId).emit("payment_status", {
                status: "confirmed",
                amount: total,
                userId: userId,
                message: "Paiement confirmé"
            });


            return res.json({ message: "Paiement en cours", status: "pending" });

        } else {
            return res.status(400).json({ message: "Échec de l'enregistrement" });
        }
    });

    return {
        pay
    };
};

module.exports = startWebSocket;