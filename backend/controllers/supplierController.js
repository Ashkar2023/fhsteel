const { Supplier } = require("../models/index");
const { Product } = require("../models/index");
const { SupplierHistory } = require("../models/index");

exports.createSupplier = async (req, res) => {
  try {
    const { name, contactPerson, email, phone, address } = req.body;

    if (!name || !contactPerson || !phone) {
      return res
        .status(400)
        .json({ error: "All required fields must be provided" });
    }

    // Create the supplier in the database
    const newSupplier = await Supplier.create({
      name,
      contactPerson,
      email,
      phone,
      address,
    });

    return res
      .status(201)
      .json({ message: "Supplier created successfully", newSupplier });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getAllSuppliers = async (req, res) => {
  try {
    const suppliers = await Supplier.findAll({
      include: [
        {
          model: Product,
          as: "products",
        },
      ],
    });

    res
      .status(200)
      .json({ message: "Suppliers retrieved successfully", suppliers });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.message });
  }
};

// Toggle block status for a supplier
exports.toggleBlockSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    supplier.active = !supplier.active;
    await supplier.save();
    if (supplier.active) {
      return res
        .status(200)
        .json({ message: "Supplier UnBlocked successfully", supplier });
    } else {
      return res
        .status(200)
        .json({ message: "Supplier blocked successfully", supplier });
    }
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.getSupplierHistory = async (req, res) => {
  try {
    const { id } = req.params;

    const history = await SupplierHistory.findAll({
      where: { supplierId: id },
      include: [
        {
          model: Product,
          as: 'products',
          attributes: ["id", "name"],
        },
      ],
      order: [["date", "DESC"]],
    });

    res.status(200).json({ history });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

exports.deleteSupplier = async (req, res) => {
  try {
    const { id } = req.params;

    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    supplier.isDeleted = !supplier.isDeleted; // Toggle the `active` field
    await supplier.save();
    return res.status(200).json({ message: "Supplier Deleted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: error.message });
  }
};

exports.editSupplier = async (req, res) => {
  try {
    const { id, name, phone, address, contactPerson, email } = req.body;

    if (!id) {
      return res.status(400).json({
        error: "Id required",
      });
    }

    const supplier = await Supplier.findByPk(id);
    if (!supplier) {
      return res.status(404).json({ error: "Supplier not found" });
    }

    await Supplier.update(
      {
        name: name,
        phone: phone,
        address: address,
        contactPerson: contactPerson,
        email: email,
      },
      { where: { id } }
    );

    return res.status(200).json({ error: "Supplier updated successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
