const express = require('express');

const router = express.Router();
const Employee = require('../models/employee')

// Create (POST):
router.post('/', async (req, res) => {
  const { name, salary, deductions } = req.body;
  try {
    const newEmployee = new Employee({ name, salary, deductions });
    const savedEmployee = await newEmployee.save();
    res.json({
      message: 'Employee Created Successfully',
      employee: {
        id: savedEmployee.id,
        name: savedEmployee.name,
        salary: savedEmployee.salary,
        deductions: savedEmployee.deductions,
        netSalary: savedEmployee.salary - savedEmployee.deductions
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating employee' });
  }
});

// Read (GET) All:
router.get('/', async (req, res) => {

  try {
    const employees = await Employee.find();
    let data = []
    employees.map(emp => {
      data.push({
        id: emp.id,
        name: emp.name,
        salary: emp.salary,
        deductions: emp.deductions,
        netSalary: emp.salary - emp.deductions
      })
    })
    res.json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching employees' });
  }
});

// Read (GET) One:
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const employee = await Employee.findById(id);
    if (!employee) return res.status(404).json({ message: 'Employee not found' });
    res.json({
      id: employee.id,
      name: employee.name,
      salary: employee.salary,
      deductions: employee.deductions,
      netSalary: employee.salary - employee.deductions
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching employee' });
  }
});

// Update (PUT):
router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { name, salary, deductions } = req.body;
  const updates = { name, salary, deductions };
  try {
    const updatedEmployee = await Employee.findByIdAndUpdate(id, updates, { new: true });
    if (!updatedEmployee) return res.status(404).json({ message: 'Employee not found' });
    res.json({
      message:'Employee Updated Successfully',
      employee:{
        id: updatedEmployee.id,
        name: updatedEmployee.name,
        salary: updatedEmployee.salary,
        deductions: updatedEmployee.deductions,
        netSalary: updatedEmployee.salary - updatedEmployee.deductions
      }
    })
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating employee' });
  }
});

// Delete (DELETE):
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedEmployee = await Employee.findByIdAndDelete(id);
    if (!deletedEmployee) return res.status(404).json({ message: 'Employee not found' });
    // Respond with a success message or relevant information
    res.json({ message: 'Employee deleted successfully', success :true });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting employee' });
  }
});

module.exports = router;