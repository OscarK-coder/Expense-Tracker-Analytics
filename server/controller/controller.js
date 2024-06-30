const model = require('../models/model');

// POST: http://localhost:8080/api/categories
function create_Categories(req, res) {
    const Create = new model.Categories({
        type: "Investment",
        color: '#FCBE44'
    });

    Create.save()
        .then(() => res.json(Create))
        .catch(err => res.status(400).json({ message: `Error while creating categories ${err}` }));
}

// GET: http://localhost:8080/api/categories
async function get_Categories(req, res) {
    model.Categories.find({})
        .then(data => {
            const filter = data.map(v => ({ type: v.type, color: v.color }));
            res.json(filter);
        })
        .catch(err => res.status(400).json({ message: `Error while retrieving categories ${err}` }));
}

// POST: http://localhost:8080/api/transaction
async function create_Transaction(req, res) {
    if (!req.body) return res.status(400).json("Post HTTP Data not Provided");

    const { name, type, amount } = req.body;

    const create = await new model.Transaction({
        name,
        type,
        amount,
        date: new Date()
    });

    create.save()
        .then(() => res.json(create))
        .catch(err => res.status(400).json({ message: `Error while creating transaction ${err}` }));
}

// GET: http://localhost:8080/api/transaction
async function get_Transaction(req, res) {
    model.Transaction.find({})
        .then(data => res.json(data))
        .catch(err => res.status(400).json({ message: `Error while retrieving transactions ${err}` }));
}

// DELETE: http://localhost:8080/api/transaction
async function delete_Transaction(req, res) {
    if (!req.body) return res.status(400).json({ message: "Request body not Found" });

    model.Transaction.deleteOne(req.body)
        .then(() => res.json("Record Deleted...!"))
        .catch(err => res.status(400).json({ message: `Error while deleting transaction record ${err}` }));
}

// GET: http://localhost:8080/api/labels
async function get_Labels(req, res) {
    model.Transaction.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: 'type',
                foreignField: "type",
                as: "categories_info"
            }
        },
        {
            $unwind: "$categories_info"
        },
        {
            $group: {
                _id: {
                    _id: "$_id",
                    name: "$name",
                    type: "$type",
                    amount: "$amount"
                },
                color: { $first: "$categories_info.color" }
            }
        },
        {
            $project: {
                _id: "$_id._id",
                name: "$_id.name",
                type: "$_id.type",
                amount: "$_id.amount",
                color: "$color"
            }
        }
    ])
    .then(result => {
        const data = result.map(v => ({
            _id: v._id,
            name: v.name,
            type: v.type,
            amount: v.amount,
            color: v.color
        }));
        res.json(data);
    })
    .catch(error => {
        console.error("Error during aggregation:", error); // Added detailed error logging
        res.status(400).json({ message: "Lookup Collection Error", error: error.message });
    });
}

module.exports = {
    create_Categories,
    get_Categories,
    create_Transaction,
    get_Transaction,
    delete_Transaction,
    get_Labels
};
