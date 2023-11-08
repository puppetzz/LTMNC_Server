const Problem = require("../models/Problem");

const listProblem = async (request, response) => {
  try {
    const data = await Problem.find();
    return response.status(200).json(data);
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

const getProblem = async (request, response) => {
  try {
    const data = await Problem.findById(request.params.id);
    return response.status(200).json(data);
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

const addProblem = async (request, response) => {
  const { testcase, detail, userId } = await request.body;

  if (!testcase || !detail) {
    return response.status(400).json({ message: "Missing required fields" });
  }

  const data = { ...detail, testcase, createdBy: userId };

  try {
    const newProblem = new Problem(data);
    const saved = await newProblem.save();

    return response.status(201).json(saved);
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

const editProblemById = async (request, response) => {
  const { testcase, detail, userId } = request.body;
  const id = request.params.id;

  if (!testcase || !detail || !id) {
    return response.status(400).json({ message: "Missing required fields" });
  }

  const data = { ...detail, testcase, createdBy: userId };

  try {
    const saved = await Problem.findByIdAndUpdate(id, data);

    return response.status(201).json(saved);
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

const removeProblem = async (request, response) => {
  const id = request.params.id;

  if (!id) {
    return response.status(400).json({ message: "Missing required fields" });
  }

  try {
    await Problem.findByIdAndDelete(id);

    return response.status(201).json("ProblemRoutes Delete Successfully");
  } catch (error) {
    console.log(error);
    return response.status(500).json(error);
  }
};

module.exports = {
  listProblem,
  getProblem,
  addProblem,
  editProblemById,
  removeProblem,
};
